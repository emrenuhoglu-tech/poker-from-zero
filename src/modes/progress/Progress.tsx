import { useState } from "react";
import { MODULES } from "../../content/curriculum";
import { getStats, isDone, resetProgress } from "../../lib/progress";

export function Progress({
  onOpen,
  notify,
  onGlossary,
}: {
  onOpen: (id: string) => void;
  notify: () => void;
  onGlossary: () => void;
}) {
  const [confirmReset, setConfirmReset] = useState(false);
  const s = getStats();
  const total = MODULES.length;
  const pct = total ? Math.round((s.doneCount / total) * 100) : 0;

  function reset() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetProgress();
    setConfirmReset(false);
    notify();
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-extrabold text-ink">Progress</h1>

      <div className="grid grid-cols-3 gap-2">
        <Stat big={`🔥 ${s.streak}`} label="day streak" />
        <Stat big={`⭐ ${s.xp}`} label="XP" />
        <Stat big={`${s.doneCount}/${total}`} label="chapters" />
      </div>

      {/* level */}
      <div className="card-soft p-4">
        <div className="mb-2 flex items-center justify-between text-sm font-bold text-ink">
          <span className="text-grape">Level {s.level}</span>
          <span className="text-ink-soft">
            {s.xpInLevel}/{s.levelSize} XP
          </span>
        </div>
        <div
          className="h-3 overflow-hidden rounded-full bg-cream-200"
          role="progressbar"
          aria-valuenow={s.xpInLevel}
          aria-valuemin={0}
          aria-valuemax={s.levelSize}
          aria-label="Level progress"
        >
          <div className="h-full rounded-full bg-grape transition-all" style={{ width: `${(s.xpInLevel / s.levelSize) * 100}%` }} />
        </div>
      </div>

      {/* daily goal + best run */}
      <div className="grid grid-cols-2 gap-2">
        <div className="card-soft p-3">
          <div className="text-xs font-bold text-ink-soft">Daily goal</div>
          <div className="mt-1 text-lg font-extrabold text-ink">
            {Math.min(s.goalDone, s.goalTarget)}
            <span className="text-sm font-bold text-ink-soft">/{s.goalTarget}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-cream-200">
            <div className="h-full rounded-full bg-gold" style={{ width: `${Math.min(100, (s.goalDone / s.goalTarget) * 100)}%` }} />
          </div>
        </div>
        <div className="card-soft flex flex-col justify-center p-3">
          <div className="text-xs font-bold text-ink-soft">Best Hands streak</div>
          <div className="mt-1 text-lg font-extrabold text-ink">🃏 {s.bestRun}</div>
        </div>
      </div>

      {/* course path */}
      <div className="card-soft p-4">
        <div className="mb-2 flex items-center justify-between text-sm font-bold text-ink">
          <span>Your path</span>
          <span className="text-ink-soft">{pct}%</span>
        </div>
        <div
          className="h-3 overflow-hidden rounded-full bg-cream-200"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Course progress"
        >
          <div className="h-full rounded-full bg-grass transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <button onClick={onGlossary} className="btn-choice w-full py-3 text-[15px]">
        📖 Glossary
      </button>

      <div className="space-y-2">
        {MODULES.map((m) => {
          const done = isDone(m.id);
          return (
            <button
              key={m.id}
              onClick={() => onOpen(m.id)}
              className="flex w-full items-center gap-3 rounded-2xl border-2 border-cream-200 bg-white p-2.5 text-left transition active:translate-y-0.5"
            >
              <span
                className={
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold " +
                  (done ? "bg-grass text-white" : "bg-cream-100 text-ink-soft")
                }
              >
                {done ? "✓" : m.num}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-bold text-ink">{m.title}</span>
              {!done && <span className="shrink-0 text-xs text-ink-soft">start →</span>}
            </button>
          );
        })}
      </div>

      <button
        onClick={reset}
        className={
          "w-full rounded-2xl border-2 py-3 text-sm font-bold transition " +
          (confirmReset ? "border-coral bg-coral-soft text-coral-dark" : "border-cream-200 bg-white text-ink-soft")
        }
      >
        {confirmReset ? "Tap again to erase all progress" : "Start over"}
      </button>
    </div>
  );
}

function Stat({ big, label }: { big: string; label: string }) {
  return (
    <div className="card-soft flex flex-col items-center justify-center py-3">
      <div className="text-lg font-extrabold text-ink">{big}</div>
      <div className="text-[11px] text-ink-soft">{label}</div>
    </div>
  );
}
