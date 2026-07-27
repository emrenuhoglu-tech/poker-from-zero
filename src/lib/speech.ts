// Client-side voice narration via the browser SpeechSynthesis API.
// No backend needed — works on static hosting (GitHub Pages). English voices.

let cachedVoice: SpeechSynthesisVoice | null = null;

export function supportsSpeech(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find((v) => /en[-_]US/i.test(v.lang) && /natural|google|samantha|zira|aria/i.test(v.name)) ||
    voices.find((v) => /^en([-_]|$)/i.test(v.lang)) ||
    voices[0]
  );
}

// Voices load async in most browsers; warm the cache when they arrive.
if (supportsSpeech()) {
  cachedVoice = pickVoice();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = pickVoice();
  };
}

export function speak(text: string, opts?: { onEnd?: () => void; rate?: number }): void {
  if (!supportsSpeech()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voice = cachedVoice || pickVoice();
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang;
  } else {
    u.lang = "en-US";
  }
  u.rate = opts?.rate ?? 0.95;
  u.onend = () => opts?.onEnd?.();
  synth.speak(u);
}

export function stopSpeech(): void {
  if (supportsSpeech()) window.speechSynthesis.cancel();
}
