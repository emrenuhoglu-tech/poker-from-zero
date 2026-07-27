import { useEffect, useMemo, useState } from "react";
import { MODULES, moduleById, narratable } from "../../content/curriculum";
import { LessonBody } from "../../components/LessonBody";
import { completeModule, addXp, isDone } from "../../lib/progress";
import { speak, stopSpeech, supportsSpeech } from "../../lib/speech";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Mode = "read" | "quiz" | "result";

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
  const [mode, setMode] = useState<Mode>("read");
  const [speaking, setSpeaking] = useState(false);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [awarded, setAwarded] = useState(0);
  const alreadyDone = m ? isDone(m.id) : false;

  useEffect(() => () => stopSpeech(), []);

  const quiz = useMemo(
    () =>
      (m ? m.checks : []).map((c) => {
        const opts = shuffle([c.correct, ...c.wrong]);
        return { q: c.q, opts, correct: opts.indexOf(c.correct) };
      }),
    // rebuild only when the chapter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [moduleId],
  );

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

  function toggleSpeak() {
    if (speaking) {
      stopSpeech();
      setSpeaking(false);
    } else {
      speak(narratable(m!.body), { onEnd: () => setSpeaking(false) });
      setSpeaking(true);
    }
  }

  function grant(correct: number) {
    const first = completeModule(m!.id, 10);
    let gained = first ? 10 : 0;
    if (first && correct > 0) {
      addXp(correct * 2);
      gained += correct * 2;
    }
    setAwarded(gained);
    notify();
    setMode("result");
  }

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === quiz[qi].correct) setCorrectCount((c) => c + 1);
  }

  function nextQuestion() {
    if (qi + 1 < quiz.length) {
      setQi(qi + 1);
      setPicked(null);
    } else {
      grant(correctCount);
    }
  }

  function startQuiz() {
    stopSpeech();
    setSpeaking(false);
    setQi(0);
    setPicked(null);
    setCorrectCount(0);
    setMode("quiz");
  }

  const header = (
    <div className="sticky top-0 z-10 flex items-center gap-3 border-b-2 border-cream-200 bg-cream-100/90 px-4 py-3 backdrop-blur">
      <button onClick={onBack} className="rounded-lg px-1 py-1 text-sm font-bold text-ink-soft">
        ← Learn
      </button>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">{m.label}</div>
        <div className="flex items-center gap-1.5">
          <span className="truncate font-extrabold text-ink">{m.title}</span>
          {alreadyDone && <span className="shrink-0 text-grass-dark">✓</span>}
        </div>
      </div>
      {mode === "read" && supportsSpeech() && (
        <button
          onClick={toggleSpeak}
          aria-label={speaking ? "Stop narration" : "Listen to this chapter"}
          className={
            "shrink-0 rounded-full px-3 py-2 text-sm font-bold transition " +
            (speaking ? "bg-coral text-white" : "bg-grass-soft text-grass-dark")
          }
        >
          {speaking ? "⏹ Stop" : "🔊 Listen"}
        </button>
      )}
    </div>
  );

  // ---- READ ----
  if (mode === "read") {
    return (
      <div className="flex min-h-full flex-col">
        {header}
        <div className="flex-1 space-y-3 p-4 pb-28">
          <LessonBody body={m.body} />
        </div>
        <div className="sticky bottom-0 border-t-2 border-cream-200 bg-cream-100/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
          {alreadyDone ? (
            <div className="flex gap-2">
              <button onClick={onBack} className="btn-grass flex-1 py-3.5 text-base">
                ✓ Completed
              </button>
              {quiz.length > 0 && (
                <button onClick={startQuiz} className="btn-choice px-4 py-3.5 text-sm">
                  Practice
                </button>
              )}
            </div>
          ) : quiz.length > 0 ? (
            <button onClick={startQuiz} className="btn-grass w-full py-3.5 text-lg">
              Check what you learned →
            </button>
          ) : (
            <button onClick={() => grant(0)} className="btn-grass w-full py-3.5 text-lg">
              Done &nbsp;·&nbsp; +10 XP
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---- QUIZ ----
  if (mode === "quiz") {
    const q = quiz[qi];
    const answered = picked !== null;
    return (
      <div className="flex min-h-full flex-col">
        {header}
        <div className="flex-1 space-y-4 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-ink-soft">
            <span>
              Question {qi + 1} / {quiz.length}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-200">
              <div className="h-full rounded-full bg-grass" style={{ width: `${((qi + (answered ? 1 : 0)) / quiz.length) * 100}%` }} />
            </div>
          </div>

          <p className="text-lg font-bold text-ink">{q.q}</p>

          <div className="flex flex-col gap-2.5">
            {q.opts.map((opt, i) => {
              const isCorrect = i === q.correct;
              let cls = "btn-choice";
              if (answered && isCorrect) cls = "btn-choice !border-grass !bg-grass-soft";
              else if (answered && i === picked && !isCorrect) cls = "btn-choice !border-coral !bg-coral-soft";
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  aria-disabled={answered}
                  className={cls + " justify-start px-4 py-3.5 text-left text-[15px]"}
                >
                  {answered && isCorrect ? "✓ " : answered && i === picked ? "✗ " : ""}
                  {opt}
                </button>
              );
            })}
          </div>

          {answered && (
            <button onClick={nextQuestion} className="btn-grass w-full py-3.5 text-lg">
              {qi + 1 < quiz.length ? "Next →" : "Finish"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---- RESULT ----
  return (
    <div className="flex min-h-full flex-col">
      {header}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="text-6xl">{awarded > 0 ? "🎉" : "✓"}</div>
        {quiz.length > 0 && (
          <p className="text-lg font-bold text-ink">
            You got {correctCount} / {quiz.length} right
          </p>
        )}
        <div className="animate-pop rounded-2xl bg-grass-soft px-5 py-3 font-extrabold text-grass-dark">
          {awarded > 0 ? `+${awarded} XP earned` : "Reviewed — already completed"}
        </div>
        <div className="w-full max-w-xs space-y-2 pt-2">
          {next ? (
            <button onClick={() => onOpen(next.id)} className="btn-grass w-full py-3.5 text-lg">
              Next: {next.label} →
            </button>
          ) : (
            <button onClick={onBack} className="btn-gold w-full py-3.5 text-lg">
              🏆 You finished the course — Back to lessons
            </button>
          )}
          <button onClick={onBack} className="btn-choice w-full py-3">
            Back to lessons
          </button>
        </div>
      </div>
    </div>
  );
}
