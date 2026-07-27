import { MODULES } from "../../content/curriculum";
import { getStats, isDone } from "../../lib/progress";

export function Progress({ onOpen }: { onOpen: (id: string) => void }) {
  const s = getStats();
  const total = MODULES.length;
  const pct = total ? Math.round((s.doneCount / total) * 100) : 0;

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-extrabold text-ink">Progress</h1>

      <div className="grid grid-cols-3 gap-2">
        <Stat big={`🔥 ${s.streak}`} label="day streak" />
        <Stat big={`⭐ ${s.xp}`} label="XP" />
        <Stat big={`${s.doneCount}/${total}`} label="chapters" />
      </div>

      <div className="card-soft p-4">
        <div className="mb-2 flex items-center justify-between text-sm font-bold text-ink">
          <span>Your path</span>
          <span className="text-ink-soft">{pct}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-cream-200">
          <div className="h-full rounded-full bg-grass transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

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
