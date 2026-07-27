import { useMemo, useState } from "react";
import { GLOSSARY } from "../../data/glossary";

export function Glossary({ onDone }: { onDone: () => void }) {
  const [q, setQ] = useState("");
  const terms = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return GLOSSARY;
    return GLOSSARY.filter((t) => t.term.toLowerCase().includes(s) || t.def.toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <button onClick={onDone} className="text-sm font-bold text-ink-soft">
          ← Progress
        </button>
        <h1 className="text-xl font-extrabold text-ink">Glossary</h1>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search terms…"
        aria-label="Search glossary"
        className="w-full rounded-2xl border-2 border-cream-200 bg-white px-4 py-3 text-[15px] outline-none focus:border-grass"
      />

      {terms.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-soft">No terms match “{q}”.</p>
      ) : (
        <div className="space-y-2">
          {terms.map((t) => (
            <div key={t.term} className="card-soft p-3">
              <div className="font-extrabold text-ink">{t.term}</div>
              <div className="text-[14px] text-ink-soft">{t.def}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
