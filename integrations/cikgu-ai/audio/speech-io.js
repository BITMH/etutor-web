/**
 * public-web/integrations/cikgu-ai/audio/speech-io.js
 * Enjin Suara 100% Kuasa Peranti Pelajar (Zero-Serverless-Wakeup Browser Speech Engine):
 * - Menggunakan cip & pek suara asli peranti pelajar (`window.speechSynthesis`: ms-MY Yasmin / Amira / Google Bahasa Melayu)
 * - Lengkap Penormal Sebutan SPM (Matematik, Sains, Prinsip Perakaunan & Sejarah)
 * - Pemecah ayat berantai (Chunked Utterance Queue <= 165 aksara) supaya tidak terputus pada Chrome/Android
 * - Sifar (0) panggilan HTTP ke pelayan serverless — pelayan Modal GPU & Cloud Run kekal tidur nyenyak!
 */

export function normalizeSpmSpeechJs(raw, isEnglish = false) {
  let txt = String(raw || "");

  // Buang pemisah ribuan koma di dalam nombor (contoh: 1,250 -> 1250) supaya tidak dibaca "satu koma dua lima kosong"
  txt = txt.replace(/(\d),(?=\d{3}\b)/g, "$1");

  if (isEnglish) {
    txt = txt
      .replace(/\\leq|\\le|≤/gi, " is less than or equal to ")
      .replace(/\\geq|\\ge|≥/gi, " is greater than or equal to ")
      .replace(/\\times|×/gi, " times ")
      .replace(/\\div|÷/gi, " divided by ")
      .replace(/²/g, " squared ")
      .replace(/³/g, " cubed ")
      .replace(/°C\b/g, " degrees Celsius ")
      .replace(/\[(\d+)\s*(?:m|markah|marks?)\]/gi, " $1 marks ");
  } else {
    txt = txt
      .replace(/\bF(\d+)\s*:/g, "Fakta $1: ")
      .replace(/\bH(\d+[a-z]?)\s*:/gi, "Huraian $1: ")
      .replace(/\bC(\d+)\s*:/g, "Contoh $1: ")
      .replace(/\bRM\s*(\d+)/g, "Ringgit Malaysia $1")
      .replace(/\\leq|\\le|≤/gi, " kurang daripada atau sama dengan ")
      .replace(/\\geq|\\ge|≥/gi, " lebih besar daripada atau sama dengan ")
      .replace(/\\times|×/gi, " darab ")
      .replace(/\\div|÷/gi, " bahagi ")
      .replace(/²/g, " kuasa dua ")
      .replace(/³/g, " kuasa tiga ")
      .replace(/°C\b/g, " darjah Celsius ")
      .replace(/(\d+(?:\.\d+)?)\s*%/g, "$1 peratus")
      .replace(/\[(\d+)\s*(?:m|markah)\]/gi, " $1 markah ");
  }

  // Tanggalkan kurungan LaTeX & aksara Markdown
  txt = txt
    .replace(/\\\[|\\\]|\\\(|\\\)/g, " ")
    .replace(/[*_#`>|~•]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return txt.slice(0, 2600);
}

function splitIntoSafeSpeechChunks(cleanText, maxLen = 165) {
  if (!cleanText) return [];
  const rawSentences = cleanText.split(/(?<=[.!?।;:\n])\s+/);
  const chunks = [];
  let current = "";

  for (const sent of rawSentences) {
    const trimmed = sent.trim();
    if (!trimmed) continue;

    if (trimmed.length > maxLen) {
      if (current) {
        chunks.push(current.trim());
        current = "";
      }
      const words = trimmed.split(/\s+/);
      let sub = "";
      for (const w of words) {
        if ((sub + " " + w).trim().length > maxLen) {
          if (sub) chunks.push(sub.trim());
          sub = w;
        } else {
          sub = sub ? `${sub} ${w}` : w;
        }
      }
      if (sub) chunks.push(sub.trim());
    } else if ((current + " " + trimmed).trim().length > maxLen) {
      if (current) chunks.push(current.trim());
      current = trimmed;
    } else {
      current = current ? `${current} ${trimmed}` : trimmed;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

export class CikguSpeechIO {
  constructor({ onTranscript, onListeningChange } = {}) {
    this.onTranscript = onTranscript;
    this.onListeningChange = onListeningChange;
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.activeButton = null;
    this._playSessionId = 0;
    this._voices = [];

    if (typeof window !== "undefined" && window.speechSynthesis) {
      const refreshVoices = () => {
        try {
          this._voices = window.speechSynthesis.getVoices() || [];
        } catch {
          this._voices = [];
        }
      };
      refreshVoices();
      if (typeof window.speechSynthesis.addEventListener === "function") {
        window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
      } else {
        window.speechSynthesis.onvoiceschanged = refreshVoices;
      }
    }
  }

  isSttSupported() {
    return typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  isTtsSupported() {
    return typeof window !== "undefined" && Boolean(window.speechSynthesis && window.SpeechSynthesisUtterance);
  }

  _detectIsEnglish(text, subject) {
    if (String(subject || "").trim().toLowerCase() === "bahasa inggeris") return true;
    const lower = String(text || "").toLowerCase();
    const engHits = (lower.match(/\b(the|and|is|are|because|therefore|question|answer)\b/g) || []).length;
    const msHits = (lower.match(/\b(yang|dan|ialah|adalah|kerana|soalan|jawapan|untuk|dengan|markah)\b/g) || []).length;
    return engHits > msHits + 3;
  }

  _pickBestDeviceVoice(isEnglish) {
    if (!this.isTtsSupported()) return null;
    const voices =
      this._voices && this._voices.length > 0
        ? this._voices
        : window.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;

    const scoreVoice = (v) => {
      const lang = String(v.lang || "").toLowerCase().replace("_", "-");
      const name = String(v.name || "").toLowerCase();
      let bonus = 0;
      if (/natural|online|neural|yasmin|osman|amira|google|siri/i.test(name)) bonus += 25;
      if (v.localService) bonus += 5;

      if (isEnglish) {
        if (lang === "en-my") return 100 + bonus;
        if (lang === "en-gb" || lang === "en-sg") return 90 + bonus;
        if (lang.startsWith("en")) return 75 + bonus;
        return -1;
      }

      if (lang === "ms-my" || lang === "ms") return 100 + bonus;
      if (lang.startsWith("ms") || lang.startsWith("zsm")) return 92 + bonus;
      if (lang.startsWith("id")) return 70 + bonus; // Sebutan fonetik Nusantara terdekat jika PC tiada pek ms-MY
      if (lang === "en-my" || lang === "en-sg") return 40 + bonus;
      return -1;
    };

    let best = null;
    let bestScore = -1;
    for (const v of voices) {
      const sc = scoreVoice(v);
      if (sc > bestScore) {
        bestScore = sc;
        best = v;
      }
    }
    return best;
  }

  toggleDictation(subject = "Sejarah") {
    if (this.isListening) {
      this.stopDictation();
      return;
    }
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    this.recognition = new SpeechRec();
    this.recognition.lang = String(subject || "").toLowerCase() === "bahasa inggeris" ? "en-GB" : "ms-MY";
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onListeningChange) this.onListeningChange(true);
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript && this.onTranscript) {
        this.onTranscript(transcript.trim());
      }
    };

    this.recognition.onerror = () => {
      this.isListening = false;
      if (this.onListeningChange) this.onListeningChange(false);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onListeningChange) this.onListeningChange(false);
    };

    this.recognition.start();
  }

  stopDictation() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // abaikan
      }
    }
    this.isListening = false;
    if (this.onListeningChange) this.onListeningChange(false);
  }

  speakText(rawMarkdown, subject = "auto", btnEl = null) {
    if (this.isSpeaking && this.activeButton === btnEl) {
      this.stopSpeaking();
      return;
    }

    this.stopSpeaking();
    if (!this.isTtsSupported() || !rawMarkdown || !String(rawMarkdown).trim()) return;

    const isEng = this._detectIsEnglish(rawMarkdown, subject);
    const cleanText = normalizeSpmSpeechJs(rawMarkdown, isEng);
    const chunks = splitIntoSafeSpeechChunks(cleanText, 165);
    if (!chunks.length) return;

    const sessionId = ++this._playSessionId;
    const chosenVoice = this._pickBestDeviceVoice(isEng);
    this.isSpeaking = true;
    this.activeButton = btnEl;
    if (btnEl) {
      btnEl.disabled = false;
      btnEl.textContent = "⏹️ Berhenti";
    }

    let idx = 0;
    const speakNextChunk = () => {
      if (sessionId !== this._playSessionId) return;
      if (idx >= chunks.length) {
        this.stopSpeaking();
        return;
      }
      const utt = new window.SpeechSynthesisUtterance(chunks[idx++]);
      if (chosenVoice) {
        utt.voice = chosenVoice;
        utt.lang = chosenVoice.lang || (isEng ? "en-GB" : "ms-MY");
      } else {
        utt.lang = isEng ? "en-GB" : "ms-MY";
      }
      utt.rate = 1.02;
      utt.pitch = 1.0;
      utt.onend = () => speakNextChunk();
      utt.onerror = () => this.stopSpeaking();
      window.speechSynthesis.speak(utt);
    };

    try {
      window.speechSynthesis.cancel();
      speakNextChunk();
    } catch {
      this.stopSpeaking();
    }
  }

  stopSpeaking() {
    this._playSessionId++;
    this.isSpeaking = false;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // abaikan
      }
    }
    if (this.activeButton) {
      this.activeButton.disabled = false;
      this.activeButton.textContent = "🔊 Dengar";
      this.activeButton = null;
    }
  }
}
