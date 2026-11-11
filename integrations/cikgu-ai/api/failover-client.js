/**
 * public-web/integrations/cikgu-ai/api/failover-client.js
 * Penghala Pintar Dwi-Awan Sifar Kos (Primary: Google Cloud Run -> Auto-Failover: Hugging Face Spaces Free)
 * Menyokong penstriman SSE masa nyata dan pertukaran pelayan tanpa gangguan apabila Cloud Run mencapai
 * had kuota percuma 85% (HTTP 429 + X-Cikgu-Failover: hf-spaces) atau tidak dapat dihubungi.
 */

import { DEFAULT_CIKGU_CONFIG, loadRuntimeEndpoints } from "../config.js";

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
    await Promise.all(
      candidates.map(async (c) => {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 5000);
        try {
          const r = await fetch(`${c.url}/v1/status`, { signal: ctrl.signal });
          clearTimeout(t);
          results[c.tier] = r.ok ? await r.json() : { ready: false, status: r.status };
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
    const candidates = this._resolveCandidateOrder();
    let lastErr = null;

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      try {
        const resp = await fetch(`${candidate.url}/v1/semak`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, stream: true })
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
          try {
            const j = await resp.json();
            if (j.detail) errMsg = j.detail;
          } catch {
            // abaikan
          }
          throw new Error(errMsg);
        }

        this.activeTier = candidate.tier;
        if (!resp.body) {
          const fallbackJson = await resp.json();
          if (onToken && fallbackJson.ulasan) onToken(fallbackJson.ulasan);
          return { tier: candidate.tier };
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

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
              return { tier: candidate.tier };
            }
            try {
              const evt = JSON.parse(dataStr);
              if (evt.type === "meta" && onMeta) {
                onMeta({ ...evt, tier: candidate.tier });
              } else if (evt.type === "token" && evt.token && onToken) {
                onToken(evt.token);
              }
            } catch {
              // Abaikan serpihan JSON separa
            }
          }
        }
        return { tier: candidate.tier };
      } catch (err) {
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
