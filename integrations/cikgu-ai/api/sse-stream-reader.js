/**
 * public-web/integrations/cikgu-ai/api/sse-stream-reader.js
 * Pembaca aliran Server-Sent Events (SSE) masa nyata dan penyelarasan baki kuota token harian.
 */

import {
  DAILY_AI_TOKEN_LIMIT,
  loadDailyTokenState,
  saveDailyTokenState
} from "../config.js";

export async function consumeSseSemakStream(resp, tier, { syncedFromHeaders = false, onMeta, onToken } = {}) {
  let syncedFromServer = Boolean(syncedFromHeaders);

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
    return { tier };
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
        return { tier };
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
          if (onMeta) onMeta({ ...evt, tier });
        } else if (evt.type === "token" && evt.token && onToken) {
          onToken(evt.token);
        }
      } catch {
        // Abaikan serpihan JSON separa
      }
    }
  }

  finalizeTokensIfNeeded();
  return { tier };
}
