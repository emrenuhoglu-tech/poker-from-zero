import { useState } from "react";
import { RANKINGS, type Ranking } from "../../data/rankings";
import { CardRow } from "../../components/Cards";
import { addXp } from "../../lib/progress";

function twoDistinct(): [Ranking, Ranking] {
  const a = Math.floor(Math.random() * RANKINGS.length);
  let b = Math.floor(Math.random() * RANKINGS.length);
  while (b === a) b = Math.floor(Math.random() * RANKINGS.length);
  return [RANKINGS[a], RANKINGS[b]];
}

export function HandRankings({ notify }: { notify: () => void }) {
  const [mode, setMode] = useState<"ladder" | "quiz">("ladder");

  return (
    <div className="space-y-3 p-4">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Hands</h1>
        <p className="text-sm text-ink-soft">Which hand beats which? A strongest-to-weakest ladder + practice.</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setMode("ladder")}
          className={mode === "ladder" ? "btn-grass px-4 py-2" : "btn-choice px-4 py-2"}
        >
          🪜 Ladder
        </button>
        <button
          onClick={() => setMode("quiz")}
          className={mode === "quiz" ? "btn-grass px-4 py-2" : "btn-choice px-4 py-2"}
        >
          🎯 Practice
        </button>
      </div>

      {mode === "ladder" ? <Ladder /> : <Quiz notify={notify} />}
    </div>
  );
}

function Ladder() {
  // Strongest on top (10 → 1)
  const ordered = [...RANKINGS].reverse();
  return (
    <div className="space-y-2">
      {ordered.map((r) => (
        <div key={r.rank} className="card-soft p-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cream-100 text-sm font-extrabold text-ink-soft">
              {r.rank}
            </span>
            <span className="font-extrabold text-ink">{r.name}</span>
          </div>
          <div className="mt-2">
            <CardRow spec={r.example} size="sm" />
          </div>
          <p className="mt-1.5 text-[13px] text-ink-soft">{r.note}</p>
        </div>
      ))}
    </div>
  );
}

function Quiz({ notify }: { notify: () => void }) {
  const [pair, setPair] = useState<[Ranking, Ranking]>(() => twoDistinct());
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState({ ok: 0, total: 0 });

  const answered = picked !== null;
  const strongerIdx = pair[0].rank > pair[1].rank ? 0 : 1;

  function pick(i: number) {
    if (answered) return;
    setPicked(i);
    const ok = i === strongerIdx;
    setScore((s) => ({ ok: s.ok + (ok ? 1 : 0), total: s.total + 1 }));
    if (ok) {
      addXp(2);
      notify();
    }
  }

  function nextQ() {
    setPair(twoDistinct());
    setPicked(null);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-bold text-ink">Which is stronger?</span>
        <span className="text-sm text-ink-soft">
          {score.ok}/{score.total}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {pair.map((r, i) => {
          const isStronger = i === strongerIdx;
          let ring = "border-cream-200";
          if (answered && isStronger) ring = "border-grass shadow-[0_3px_0_rgba(88,204,2,0.35)]";
          else if (answered && i === picked && !isStronger) ring = "border-coral shadow-[0_3px_0_rgba(255,111,89,0.3)]";
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={answered}
              className={"rounded-3xl border-2 bg-white p-3 text-left transition active:translate-y-0.5 " + ring}
            >
              <CardRow spec={r.example} size="sm" />
              {answered && (
                <div className="mt-2 text-sm font-bold text-ink">
                  {isStronger ? "✓ " : ""}
                  {r.name}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <>
          <div
            className={
              "rounded-2xl px-4 py-3 text-center font-extrabold " +
              (picked === strongerIdx ? "bg-grass-soft text-grass-dark" : "bg-coral-soft text-coral-dark")
            }
          >
            {picked === strongerIdx
              ? "Correct! +2 XP 🎉"
              : `Close! ${pair[strongerIdx].name} beats ${pair[1 - strongerIdx].name}.`}
          </div>
          <button onClick={nextQ} className="btn-grass w-full py-3">
            Next →
          </button>
        </>
      )}
    </div>
  );
}
