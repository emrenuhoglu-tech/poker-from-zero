import { useState } from "react";
import { RANKINGS, type Ranking } from "../../data/rankings";
import { CardRow } from "../../components/Cards";
import { genExample } from "../../lib/handGen";
import { recordQuizAnswer, recordRun, getStats, type Stats } from "../../lib/progress";

function twoDistinct(): [Ranking, Ranking] {
  const a = Math.floor(Math.random() * RANKINGS.length);
  let b = Math.floor(Math.random() * RANKINGS.length);
  while (b === a) b = Math.floor(Math.random() * RANKINGS.length);
  return [RANKINGS[a], RANKINGS[b]];
}

function makeQ() {
  const [a, b] = twoDistinct();
  return { a, b, specA: genExample(a.rank), specB: genExample(b.rank) };
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
          aria-pressed={mode === "ladder"}
          className={mode === "ladder" ? "btn-grass px-4 py-2" : "btn-choice px-4 py-2"}
        >
          🪜 Ladder
        </button>
        <button
          onClick={() => setMode("quiz")}
          aria-pressed={mode === "quiz"}
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
  const ordered = [...RANKINGS].reverse(); // strongest on top
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft">
        <span>💪 Strongest</span>
      </div>
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
      <div className="px-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft">Weakest</div>
    </div>
  );
}

function Quiz({ notify }: { notify: () => void }) {
  const [q, setQ] = useState(makeQ);
  const [picked, setPicked] = useState<number | null>(null);
  const [run, setRun] = useState(0);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [stats, setStats] = useState<Stats>(() => getStats());

  const pair = [q.a, q.b];
  const specs = [q.specA, q.specB];
  const answered = picked !== null;
  const strongerIdx = q.a.rank > q.b.rank ? 0 : 1;

  function pick(i: number) {
    if (answered) return;
    setPicked(i);
    const ok = i === strongerIdx;
    const { awarded } = recordQuizAnswer(ok);
    const nextRun = ok ? run + 1 : 0;
    setRun(nextRun);
    if (ok) recordRun(nextRun);
    notify();
    setStats(getStats());
    const winner = pair[strongerIdx];
    const loser = pair[1 - strongerIdx];
    setMsg(
      ok
        ? {
            ok: true,
            text: awarded > 0 ? `Correct! +${awarded} XP 🎉` : "Correct! 🎉 (daily XP maxed — keep the streak going!)",
          }
        : {
            ok: false,
            text: `${winner.name} (#${winner.rank}) beats ${loser.name} (#${loser.rank}). ${winner.note}`,
          },
    );
  }

  function nextQ() {
    setQ(makeQ());
    setPicked(null);
    setMsg(null);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold text-ink">Which is stronger?</span>
        <span className="text-ink-soft">
          🔥 {run} · best {stats.bestRun}
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-full bg-cream-100 px-3 py-1.5 text-xs font-bold text-ink-soft">
        <span>Daily goal</span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-200">
          <div className="h-full rounded-full bg-gold" style={{ width: `${Math.min(100, (stats.goalDone / stats.goalTarget) * 100)}%` }} />
        </div>
        <span>
          {Math.min(stats.goalDone, stats.goalTarget)}/{stats.goalTarget}
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
              aria-disabled={answered}
              className={"rounded-3xl border-2 bg-white p-3 text-left transition active:translate-y-0.5 " + ring}
            >
              <CardRow spec={specs[i]} size="sm" />
              {answered && (
                <div className="mt-2 text-sm font-bold text-ink">
                  {isStronger ? "✓ " : ""}
                  {r.name} <span className="font-normal text-ink-soft">· #{r.rank}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {answered && msg && (
        <>
          <div
            className={
              "rounded-2xl px-4 py-3 text-center text-sm font-bold " +
              (msg.ok ? "bg-grass-soft text-grass-dark" : "bg-coral-soft text-coral-dark")
            }
          >
            {msg.text}
          </div>
          <button onClick={nextQ} className="btn-grass w-full py-3">
            Next →
          </button>
        </>
      )}
    </div>
  );
}
