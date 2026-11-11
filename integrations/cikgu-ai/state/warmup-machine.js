/**
 * public-web/integrations/cikgu-ai/state/warmup-machine.js
 * Mesin Keadaan 4-Fasa untuk Trik UX "Silent Pre-Warm + Hai Cikgu".
 * Menghapuskan persepsi menunggu cold-start kontena dengan memulakan pemanasan senyap
 * sebaik halaman dibuka dan memaparkan dialog naratif guru masuk kelas jika masih sedang bangun.
 */

const NARRATIVE_STEPS = [
  "Sekejap ya, Cikgu tengah melangkah masuk ke kelas...",
  "Cikgu tengah buka Buku Teks KSSM dan rekod pemarkahan LPM...",
  "Menyediakan skema 23 subjek dan pen merah pemeriksa..."
];

export class WarmupStateMachine {
  constructor(client, onStateChange) {
    this.client = client;
    this.onStateChange = onStateChange;
    this.status = "idle"; // idle | warming | ready | offline
    this.narrativeText = "Klik 'Hai Cikgu!' untuk mula menyemak jawapan atau bertanya topik buku teks.";
    this._narrativeTimer = null;
    this._pollTimer = null;
    this._stepIdx = 0;
  }

  _emit(extra = {}) {
    if (this.onStateChange) {
      this.onStateChange({
        status: this.status,
        narrativeText: this.narrativeText,
        tier: this.client.activeTier,
        telemetry: this.client.lastTelemetry,
        ...extra
      });
    }
  }

  async triggerSilentPrewarm() {
    if (this.status === "ready" || this.status === "warming") return;
    const res = await this.client.warmup();
    if (res.ready) {
      this.status = "ready";
      this.narrativeText = "Cikgu dah sedia di meja! Pilih subjek dan hantar soalan atau jawapan kamu.";
      this._emit();
    }
  }

  async greetCikgu() {
    if (this.status === "ready") {
      this._emit();
      return true;
    }

    this.status = "warming";
    this._stepIdx = 0;
    this.narrativeText = NARRATIVE_STEPS[0];
    this._emit();

    this._clearTimers();
    this._narrativeTimer = setInterval(() => {
      this._stepIdx = (this._stepIdx + 1) % NARRATIVE_STEPS.length;
      this.narrativeText = NARRATIVE_STEPS[this._stepIdx];
      this._emit();
    }, 2400);

    for (let attempt = 0; attempt < 4; attempt++) {
      const res = await this.client.warmup({
        onFailover: (msg) => {
          this.narrativeText = msg;
          this._emit({ failoverNotice: msg });
        }
      });

      if (res.ready) {
        this._clearTimers();
        this.status = "ready";
        this.narrativeText =
          (res.data && res.data.mesej) ||
          "Cikgu dah sedia di meja! Tulis soalan atau jawapan kamu di bawah.";
        this._emit();
        return true;
      }

      if (res.waking) {
        await new Promise((r) => setTimeout(r, 2500));
        continue;
      }
      break;
    }

    this._clearTimers();
    this.status = "offline";
    this.narrativeText =
      "Pelayan awan Cikgu AI belum diaktifkan atau sedang tidur nyenyak. Anda boleh menyemak URL pelayan pada ikon ⚙️ Tetapan.";
    this._emit();
    return false;
  }

  _clearTimers() {
    if (this._narrativeTimer) {
      clearInterval(this._narrativeTimer);
      this._narrativeTimer = null;
    }
    if (this._pollTimer) {
      clearTimeout(this._pollTimer);
      this._pollTimer = null;
    }
  }
}
