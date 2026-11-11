/**
 * public-web/integrations/cikgu-ai/audio/speech-io.js
 * Pengawal Input Suara (Web Speech API STT ms-MY / en-GB) &
 * Bacaan Suara Guru Sebenar berasaskan Microsoft Edge Neural TTS (`ms-MY-YasminNeural` / `en-MY-YasminNeural`).
 */

export class CikguSpeechIO {
  constructor({ client, onTranscript, onListeningChange } = {}) {
    this.client = client || null;
    this.onTranscript = onTranscript;
    this.onListeningChange = onListeningChange;
    this.recognition = null;
    this.isListening = false;
    this.currentAudio = null;
    this.currentObjectUrl = null;
    this.activeButton = null;
  }

  isSttSupported() {
    return typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
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

  async speakText(rawMarkdown, subject = "auto", btnEl = null) {
    // Jika pengguna klik butang yang sama semasa sedang dimainkan, hentikan audio
    if (this.currentAudio && this.activeButton === btnEl) {
      this.stopSpeaking();
      return;
    }

    this.stopSpeaking();
    if (!rawMarkdown || !String(rawMarkdown).trim()) return;

    this.activeButton = btnEl;
    if (btnEl) {
      btnEl.disabled = true;
      btnEl.textContent = "⏳ Suara...";
    }

    try {
      if (!this.client) throw new Error("Klien TTS belum tersedia");
      const mp3Blob = await this.client.fetchTtsBlob({
        teks: String(rawMarkdown),
        subjek: String(subject || "auto"),
        jantina: "female"
      });

      const url = URL.createObjectURL(mp3Blob);
      this.currentObjectUrl = url;
      const audio = new Audio(url);
      this.currentAudio = audio;

      if (btnEl) {
        btnEl.disabled = false;
        btnEl.textContent = "⏹️ Berhenti";
      }

      audio.onended = () => {
        this.stopSpeaking();
      };
      audio.onerror = () => {
        this.stopSpeaking();
      };

      await audio.play();
    } catch {
      this.stopSpeaking();
    }
  }

  stopSpeaking() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.src = "";
      } catch {
        // abaikan
      }
      this.currentAudio = null;
    }
    if (this.currentObjectUrl) {
      try {
        URL.revokeObjectURL(this.currentObjectUrl);
      } catch {
        // abaikan
      }
      this.currentObjectUrl = null;
    }
    if (this.activeButton) {
      this.activeButton.disabled = false;
      this.activeButton.textContent = "🔊 Dengar";
      this.activeButton = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}
