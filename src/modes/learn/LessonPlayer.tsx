import { useEffect, useState } from "react";
import { MODULES, moduleById, narratable } from "../../content/curriculum";
import { LessonBody } from "../../components/LessonBody";
import { completeModule } from "../../lib/progress";
import { speak, stopSpeech, supportsSpeech } from "../../lib/speech";

export function LessonPlayer({
  moduleId,
  onBack,
  onOpen,
  notify,
}: {
  moduleId: string;
  onBack: () => void;
  onOpen: (id: string) => void;
  notify: () => void;
}) {
  const m = moduleById(moduleId);
  const [finished, setFinished] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // stop any narration when leaving the lesson
  useEffect(() => () => stopSpeech(), []);

  function toggleSpeak() {
    if (speaking) {
      stopSpeech();
      setSpeaking(false);
    } else if (m) {
      speak(narratable(m.body), { onEnd: () => setSpeaking(false) });
      setSpeaking(true);
    }
  }

  if (!m) {
    return (
      <div className="p-6 text-center text-ink-soft">
        Chapter not found.{" "}
        <button onClick={onBack} className="font-bold text-grass-dark">
          ← Back
        </button>
      </div>
    );
  }

  const idx = MODULES.findIndex((x) => x.id === m.id);
  const next = MODULES[idx + 1];

  function finish() {
    completeModule(m!.id, 10);
    notify();
    setFinished(true);
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b-2 border-cream-200 bg-cream-100/90 px-4 py-3 backdrop-blur">
        <button onClick={onBack} className="text-sm font-bold text-ink-soft">
          ← Learn
        </button>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">{m.label}</div>
          <div className="truncate font-extrabold text-ink">{m.title}</div>
        </div>
        {supportsSpeech() && (
          <button
            onClick={toggleSpeak}
            className={
              "shrink-0 rounded-full px-3 py-1.5 text-sm font-bold transition " +
              (speaking ? "bg-coral text-white" : "bg-grass-soft text-grass-dark")
            }
          >
            {speaking ? "⏸ Stop" : "🔊 Listen"}
          </button>
        )}
      </div>

      <div className="flex-1 space-y-3 p-4 pb-28">
        <LessonBody body={m.body} />
      </div>

      <div className="sticky bottom-0 border-t-2 border-cream-200 bg-cream-100/95 p-3 backdrop-blur">
        {!finished ? (
          <button onClick={finish} className="btn-grass w-full py-3.5 text-lg">
            Done &nbsp;·&nbsp; +10 XP
          </button>
        ) : (
          <div className="animate-pop space-y-2">
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-grass-soft py-2.5 text-center font-extrabold text-grass-dark">
              🎉 Nice! +10 XP earned
            </div>
            {next ? (
              <button onClick={() => onOpen(next.id)} className="btn-grass w-full py-3.5 text-lg">
                Next: {next.label} →
              </button>
            ) : (
              <button onClick={onBack} className="btn-gold w-full py-3.5 text-lg">
                🏆 You finished every chapter — Back to list
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
