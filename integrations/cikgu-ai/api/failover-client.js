/**
 * public-web/integrations/cikgu-ai/api/failover-client.js
 * Penghala Pintar Dwi-Awan Sifar Kos (Primary: Modal GPU / Cloud Run -> Auto-Failover: Sandaran).
 * Menyokong penstriman SSE masa nyata dan pertukaran pelayan tanpa gangguan apabila pelayan utama
 * mencapai had kuota (HTTP 429 + X-Cikgu-Failover: hf-spaces) atau tidak dapat dihubungi.
 */

import {
  DAILY_AI_TOKEN_LIMIT,
  DEFAULT_CIKGU_CONFIG,
  loadDailyTokenState,
  loadRuntimeEndpoints,
  resolveCikguUserKey,
  saveDailyTokenState
} from "../config.js";
import { consumeSseSemakStream } from "./sse-stream-reader.js";

export class CikguFailoverClient {
  constructor() {
    this.primaryCooldownUntil = 0;
    this.activeTier = "cloud-run";
    this.lastTelemetry = null;
  }

  _resolveCandidateOrder() {
    const { mode, primaryUrl, backupUrl } = loadRuntimeEndpoints();
    if (mode === "hf-spaces") {
      return backupUrl
        ? [{ tier: "hf-spaces", url: backupUrl }]
        : [{ tier: "cloud-run", url: primaryUrl }];
    }
    if (mode === "cloud-run") {
      return [{ tier: "cloud-run", url: primaryUrl }];
    }
    const now = Date.now();
    if (now < this.primaryCooldownUntil && backupUrl) {
      return [
        { tier: "hf-spaces", url: backupUrl },
        { tier: "cloud-run", url: primaryUrl }
      ];
    }
    const list = [{ tier: "cloud-run", url: primaryUrl }];
    if (backupUrl && backupUrl !== primaryUrl) {
      list.push({ tier: "hf-spaces", url: backupUrl });
    }
    return list;
  }

  _markPrimaryFailover() {
    this.primaryCooldownUntil = Date.now() + DEFAULT_CIKGU_CONFIG.failoverCooldownMs;
    this.activeTier = "hf-spaces";
  }

  async warmup({ onFailover } = {}) {
    const candidates = this._resolveCandidateOrder();
    let lastError = null;

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), DEFAULT_CIKGU_CONFIG.warmupTimeoutMs);

      try {
        const resp = await fetch(`${candidate.url}/warmup`, {
          method: "GET",
          signal: controller.signal
        });
        clearTimeout(timer);

        const failoverHeader = resp.headers.get("X-Cikgu-Failover");
        if (resp.status === 429 && failoverHeader === "hf-spaces") {
          this._markPrimaryFailover();
          if (onFailover) onFailover("Kuota selamat Cloud Run dicapai — beralih ke Hugging Face Spaces Free.");
          continue;
        }

        if (resp.status === 503) {
          this.activeTier = candidate.tier;
          return { ready: false, waking: true, tier: candidate.tier };
        }

        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
        }

        const data = await resp.json();
        this.activeTier = candidate.tier;
        this.lastTelemetry = {
          tier: candidate.tier,
          provider: data.provider || candidate.tier,
          remainingQuotaPct: data.remaining_quota_pct ?? 100,
          ragDocuments: data.rag_documents ?? 2992
        };
        return { ready: true, waking: false, tier: candidate.tier, data };
      } catch (err) {
        clearTimeout(timer);
        lastError = err;
        if (candidate.tier === "cloud-run" && candidates.length > 1) {
          this._markPrimaryFailover();
          if (onFailover) {
            onFailover("Cloud Run tidak responsif — beralih secara automatik ke Hugging Face Spaces Free.");
          }
        }
      }
    }

    return {
      ready: false,
      waking: false,
      tier: this.activeTier,
      error: lastError ? String(lastError.message || lastError) : "Pelayan belum disambungkan"
    };
  }

  async fetchStatus() {
    const candidates = this._resolveCandidateOrder();
    const results = {};
    const userKey = resolveCikguUserKey();
    await Promise.all(
      candidates.map(async (c) => {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 5000);
        try {
          const r = await fetch(`${c.url}/v1/status`, {
            signal: ctrl.signal,
            headers: { "X-Etutor-User": userKey }
          });
          clearTimeout(t);
          if (r.ok) {
            const j = await r.json();
            results[c.tier] = j;
            if (typeof j.daily_remaining === "number") {
              saveDailyTokenState(j.daily_remaining, j.daily_limit || DAILY_AI_TOKEN_LIMIT);
            }
          } else {
            results[c.tier] = { ready: false, status: r.status };
          }
        } catch {
          clearTimeout(t);
          results[c.tier] = { ready: false, offline: true };
        }
      })
    );
    return results;
  }

  async fetchTtsBlob(payload) {
    const candidates = this._resolveCandidateOrder();
    let lastErr = null;
    for (const candidate of candidates) {
      try {
        const resp = await fetch(`${candidate.url}/v1/tts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return await resp.blob();
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr || new Error("Gagal memuatkan suara Cikgu.");
  }

  async streamSemak(payload, { onMeta, onToken, onFailover } = {}) {
    const localTok = loadDailyTokenState();
    if (localTok.remaining <= 0) {
      const limErr = new Error(
        `Kuota ${localTok.limit} token AI harian anda telah penuh untuk hari ini (reset jam 12:00 tengah malam MYT). Anda masih boleh membuka 'Skema Jawapan' tanpa had!`
      );
      limErr.isDailyLimit = true;
      throw limErr;
    }

    const candidates = this._resolveCandidateOrder();
    const userKey = resolveCikguUserKey();
    let lastErr = null;

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      try {
        const postSemak = (bodyObj) =>
          fetch(`${candidate.url}/v1/semak`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Etutor-User": userKey
            },
            body: JSON.stringify({ ...bodyObj, id_pengguna: userKey, stream: true })
          });

        let resp = await postSemak(payload);

        // Keserasian automatik jika pelayan sandaran masih menjalankan skema lama (markah_penuh <= 20)
        if (resp.status === 422 && (Number(payload.markah_penuh) > 20 || String(payload.jawapan_pelajar || "").length > 3800 || String(payload.skema_rasmi || "").length > 2400)) {
          resp = await postSemak({
            ...payload,
            soalan: String(payload.soalan || "").slice(0, 3800),
            jawapan_pelajar: String(payload.jawapan_pelajar || "").slice(0, 3800),
            skema_rasmi: String(payload.skema_rasmi || "").slice(0, 2400),
            konteks_skrin: String(payload.konteks_skrin || "").slice(0, 4400),
            markah_penuh: Math.max(1, Math.min(20, Math.round(Number(payload.markah_penuh) || 4)))
          });
        }

        const failoverHdr = resp.headers.get("X-Cikgu-Failover");
        // Jika Modal penuh (> 8 semakan serentak) atau kuota Cloud Run capai had: beralih ke sandaran serta-merta tanpa cooldown panjang
        if (resp.status === 429 && (failoverHdr === "cloud-run" || failoverHdr === "google-cloud")) {
          if (candidates.length > 1) {
            if (onFailover) {
              onFailover("Trafik GPU tinggi (>8 serentak) — melencongkan semakan ke Google Cloud secara automatik...");
            }
            continue;
          }
        }

        if ((resp.status === 429 && failoverHdr === "hf-spaces") || resp.status >= 502) {
          if (candidate.tier === "cloud-run" && candidates.length > 1) {
            this._markPrimaryFailover();
            if (onFailover) {
              onFailover("Beralih secara automatik ke pelayan sandaran percuma Hugging Face Spaces...");
            }
            continue;
          }
        }

        if (!resp.ok) {
          let errMsg = `Ralat pelayan (${resp.status})`;
          let isDailyCap = false;
          try {
            const j = await resp.json();
            if (j.detail) errMsg = j.detail;
            if (j.error === "daily_token_limit") {
              isDailyCap = true;
              saveDailyTokenState(0, j.daily_limit || DAILY_AI_TOKEN_LIMIT);
            }
          } catch {}
          const eObj = new Error(errMsg);
          if (isDailyCap) eObj.isDailyLimit = true;
          throw eObj;
        }

        const hdrRem = resp.headers.get("X-Cikgu-Daily-Remaining");
        const hdrLim = resp.headers.get("X-Cikgu-Daily-Limit");
        let syncedFromHeaders = false;
        if (hdrRem !== null && hdrRem !== "" && !isNaN(Number(hdrRem))) {
          saveDailyTokenState(Number(hdrRem), Number(hdrLim) || DAILY_AI_TOKEN_LIMIT);
          syncedFromHeaders = true;
        }

        this.activeTier = candidate.tier;
        return await consumeSseSemakStream(resp, candidate.tier, {
          syncedFromHeaders,
          onMeta,
          onToken
        });
      } catch (err) {
        if (err && err.isDailyLimit) throw err;
        lastErr = err;
        if (candidate.tier === "cloud-run" && candidates.length > 1) {
          this._markPrimaryFailover();
          if (onFailover) {
            onFailover("Sambungan utama terganggu — menyambung semula melalui Hugging Face Spaces Free...");
          }
          continue;
        }
        throw err;
      }
    }

    throw lastErr || new Error("Kedua-dua pelayan percuma sedang bangun. Sila klik 'Hai Cikgu' sebentar lagi.");
  }
}
