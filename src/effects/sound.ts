let audioContext: AudioContext | null = null;
let enabled = false;
let optedIn = false;

const getContext = () => {
  if (!audioContext) audioContext = new AudioContext();
  return audioContext;
};

export function isSoundEnabled() {
  return enabled;
}

export function setSoundEnabled(value: boolean) {
  enabled = value;
  optedIn = value;
  localStorage.setItem("site-sound", value ? "on" : "off");
}

export function initSound() {
  const stored = localStorage.getItem("site-sound");
  enabled = stored === "on";
  optedIn = stored === "on" || stored === "off";
}

/** Включает звук при первом клике по CTA, если пользователь ещё не выбирал. */
export function ensureSoundForCta() {
  if (optedIn && !enabled) return;
  if (!optedIn) {
    enabled = true;
    localStorage.setItem("site-sound", "on");
    optedIn = true;
  }
}

export function unlockSound() {
  const context = getContext();
  if (context.state === "suspended") void context.resume();
}

export function playClickSound() {
  if (!enabled) return;

  const context = getContext();
  if (context.state === "suspended") void context.resume();

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(440, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(520, context.currentTime + 0.06);
  gain.gain.value = 0.0001;
  oscillator.connect(gain);
  gain.connect(context.destination);

  const now = context.currentTime;
  gain.gain.exponentialRampToValueAtTime(0.035, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
  oscillator.start(now);
  oscillator.stop(now + 0.11);
}

export function playSuccessSound() {
  if (!enabled) return;

  const context = getContext();
  if (context.state === "suspended") void context.resume();

  const now = context.currentTime;

  const playTone = (frequency: number, start: number, duration: number, volume: number) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.value = 0.0001;
    oscillator.connect(gain);
    gain.connect(context.destination);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  };

  playTone(523.25, now, 0.14, 0.03);
  playTone(659.25, now + 0.07, 0.16, 0.028);
  playTone(783.99, now + 0.14, 0.2, 0.024);
}
