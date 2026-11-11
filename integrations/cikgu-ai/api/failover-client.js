/**
 * public-web/integrations/cikgu-ai/api/failover-client.js
 * Penghala Pintar Dwi-Awan Sifar Kos (Primary: Google Cloud Run -> Auto-Failover: Hugging Face Spaces Free)
 * Menyokong penstriman SSE masa nyata dan pertukaran pelayan tanpa gangguan apabila Cloud Run mencapai
 * had kuota percuma 85% (HTTP 429 + X-Cikgu-Failover: hf-spaces) atau tidak dapat dihubungi.
 */

import {
  DAILY_AI_TOKEN_LIMIT,
  DEFAULT_CIKGU_CONFIG,
  loadDailyTokenState,
  loadRuntimeEndpoints,
  resolveCikguUserKey,
  saveDailyTokenState
} from "../config.js";

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
          // Kontena sedang bangun tetapi boleh dihubungi (cold-start sedang berjalan)
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
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
        }
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
        const resp = await fetch(`${candidate.url}/v1/semak`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Etutor-User": userKey
          },
          body: JSON.stringify({ ...payload, id_pengguna: userKey, stream: true })
        });

        const failoverHdr = resp.headers.get("X-Cikgu-Failover");
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
          } catch {
            // abaikan
          }
          const eObj = new Error(errMsg);
          if (isDailyCap) eObj.isDailyLimit = true;
          throw eObj;
        }

        const hdrRem = resp.headers.get("X-Cikgu-Daily-Remaining");
        const hdrLim = resp.headers.get("X-Cikgu-Daily-Limit");
        let syncedFromServer = false;
        if (hdrRem !== null && hdrRem !== "" && !isNaN(Number(hdrRem))) {
          saveDailyTokenState(Number(hdrRem), Number(hdrLim) || DAILY_AI_TOKEN_LIMIT);
          syncedFromServer = true;
        }

        this.activeTier = candidate.tier;
        if (!resp.body) {
          const fallbackJson = await resp.json();
          if (typeof fallbackJson.daily_remaining === "number") {
            saveDailyTokenState(
              fallbackJson.daily_remaining,
              fallbackJson.daily_limit || DAILY_AI_TOKEN_LIMIT
            );
            syncedFromServer = true;
          } else if (!syncedFromServer) {
            const cur = loadDailyTokenState();
            saveDailyTokenState(Math.max(0, cur.remaining - 1), cur.limit);
          }
          if (onToken && fallbackJson.ulasan) onToken(fallbackJson.ulasan);
          return { tier: candidate.tier };
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        let politeBlocked = false;

        const finalizeTokensIfNeeded = () => {
          if (!syncedFromServer && !politeBlocked) {
            const cur = loadDailyTokenState();
            saveDailyTokenState(Math.max(0, cur.remaining - 1), cur.limit);
            syncedFromServer = true;
          }
        };

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";

          for (const block of parts) {
            const line = block.trim();
            if (!line.startsWith("data:")) continue;
            const dataStr = line.slice(5).trim();
            if (dataStr === "[DONE]") {
              finalizeTokensIfNeeded();
              return { tier: candidate.tier };
            }
            try {
              const evt = JSON.parse(dataStr);
              if (evt.type === "meta") {
                if (evt.sahsiah_signal === "tiada_sapaan_disekat") politeBlocked = true;
                if (typeof evt.daily_remaining === "number") {
                  saveDailyTokenState(
                    evt.daily_remaining,
                    evt.daily_limit || DAILY_AI_TOKEN_LIMIT
                  );
                  syncedFromServer = true;
                }
                if (onMeta) onMeta({ ...evt, tier: candidate.tier });
              } else if (evt.type === "token" && evt.token && onToken) {
                onToken(evt.token);
              }
            } catch {
              // Abaikan serpihan JSON separa
            }
          }
        }
        finalizeTokensIfNeeded();
        return { tier: candidate.tier };
      } catch (err) {
        if (err && err.isDailyLimit) {
          throw err;
        }
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
