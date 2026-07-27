import { MODULES } from "../../content/curriculum";
import { isDone } from "../../lib/progress";

// Öğrenme yolu — her bölüm bir düğüm. Tamamlanan yeşil, sıradaki vurgulu.
export function LessonList({ onOpen }: { onOpen: (id: string) => void }) {
  const nextIdx = MODULES.findIndex((m) => !isDone(m.id));

  return (
    <div className="space-y-3 p-4">
      <div className="mb-1">
        <h1 className="text-2xl font-extrabold text-ink">Learn</h1>
        <p className="text-sm text-ink-soft">
          {MODULES.length} bite-size chapters. From never-held-a-card to winning player.
        </p>
      </div>

      {MODULES.map((m, i) => {
        const done = isDone(m.id);
        const isNext = i === nextIdx;
        return (
          <button
            key={m.id}
            onClick={() => onOpen(m.id)}
            className={
              "flex w-full items-center gap-3 rounded-3xl border-2 bg-white p-3 text-left transition active:translate-y-0.5 " +
              (isNext ? "border-grass shadow-[0_3px_0_rgba(88,204,2,0.35)]" : "border-cream-200 shadow-sm")
            }
          >
            <div
              className={
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold " +
                (done ? "bg-grass text-white" : isNext ? "bg-grass-soft text-grass-dark" : "bg-cream-100 text-ink-soft")
              }
            >
              {done ? "✓" : m.num}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">{m.label}</div>
              <div className="truncate font-bold text-ink">{m.title}</div>
            </div>
            {isNext && (
              <span className="shrink-0 rounded-full bg-grass-soft px-2.5 py-1 text-xs font-extrabold text-grass-dark">
                Next
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
