// Client-side voice narration via the browser SpeechSynthesis API.
// No backend needed — works on static hosting (GitHub Pages). English voices.
//
// Reliability: Chrome cuts off long utterances (~15s on the Google voices) and can
// leave onend never firing. So we split text into short per-sentence utterances and
// queue them one at a time, advancing on end OR error. A generation token guarantees
// stopSpeech() / a new speak() cleanly supersede any in-flight queue.

let cachedVoice: SpeechSynthesisVoice | null = null;
let generation = 0;

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
  const gen = ++generation;
  const voice = cachedVoice || pickVoice();
  const chunks = (text.match(/[^.!?]+[.!?]*/g) || [text]).map((s) => s.trim()).filter(Boolean);
  let i = 0;

  const next = () => {
    if (gen !== generation) return; // superseded by stop() or a newer speak()
    if (i >= chunks.length) {
      opts?.onEnd?.();
      return;
    }
    const u = new SpeechSynthesisUtterance(chunks[i++]);
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    } else {
      u.lang = "en-US";
    }
    u.rate = opts?.rate ?? 0.95;
    u.onend = () => {
      if (gen === generation) next();
    };
    u.onerror = () => {
      if (gen === generation) next(); // skip a failed chunk, keep going
    };
    synth.speak(u);
  };

  next();
}

export function stopSpeech(): void {
  if (!supportsSpeech()) return;
  generation++; // invalidate any in-flight queue so its onend won't chain
  window.speechSynthesis.cancel();
}
