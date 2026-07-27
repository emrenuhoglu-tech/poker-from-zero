// content MD gövdesini render eder. Desteklenen: ### altbaşlık, - madde, 1. sıralı,
// > ipucu, @cards[Etiket] <spec> (kart satırı), satır içi **kalın** ve @hand <kod>.
import type { ReactNode } from "react";
import { CardRow, HandGlyph } from "./Cards";

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|@hand\s+[A-Za-z0-9]+)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) {
          return (
            <strong key={i} className="font-bold text-ink">
              {p.slice(2, -2)}
            </strong>
          );
        }
        const h = p.match(/^@hand\s+([A-Za-z0-9]+)$/);
        if (h) {
          return (
            <span key={i} className="mx-1 inline-block translate-y-1 align-baseline">
              <HandGlyph code={h[1]} size="sm" />
            </span>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

export function LessonBody({ body }: { body: string }) {
  const lines = body.split("\n");
  const out: ReactNode[] = [];
  let bullets: string[] = [];
  let ordered: string[] = [];

  const flush = (key: string) => {
    if (bullets.length) {
      const items = bullets.slice();
      bullets = [];
      out.push(
        <ul key={"u" + key} className="space-y-1.5 pl-1">
          {items.map((b, i) => (
            <li key={i} className="flex gap-2 text-[15px] leading-relaxed text-ink">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-grass" />
              <span>
                <Inline text={b} />
              </span>
            </li>
          ))}
        </ul>,
      );
    }
    if (ordered.length) {
      const items = ordered.slice();
      ordered = [];
      out.push(
        <ol key={"o" + key} className="space-y-1.5">
          {items.map((b, i) => (
            <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-ink">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-grass-soft text-xs font-extrabold text-grass-dark">
                {i + 1}
              </span>
              <span className="pt-0.5">
                <Inline text={b} />
              </span>
            </li>
          ))}
        </ol>,
      );
    }
  };

  lines.forEach((rawLine, i) => {
    const t = rawLine.trim();
    const key = "l" + i;
    if (!t) {
      flush("u" + i);
      return;
    }
    if (t.startsWith("### ")) {
      flush("u" + i);
      out.push(
        <h3 key={key} className="pt-1 text-base font-extrabold text-ink">
          {t.slice(4)}
        </h3>,
      );
      return;
    }
    const cardsM = t.match(/^@cards(?:\[([^\]]+)\])?\s+(.+)$/);
    if (cardsM) {
      flush("u" + i);
      out.push(
        <div key={key} className="rounded-2xl bg-cream-100 px-3 py-3">
          <CardRow spec={cardsM[2]} size="md" label={cardsM[1]} />
        </div>,
      );
      return;
    }
    if (t.startsWith("> ")) {
      flush("u" + i);
      out.push(
        <div key={key} className="rounded-2xl border-2 border-gold-soft bg-gold-soft/60 px-4 py-3 text-[15px] leading-relaxed text-ink">
          <Inline text={t.slice(2)} />
        </div>,
      );
      return;
    }
    if (t.startsWith("- ")) {
      if (ordered.length) flush("u" + i);
      bullets.push(t.slice(2));
      return;
    }
    const ordM = t.match(/^\d+\.\s+(.*)$/);
    if (ordM) {
      if (bullets.length) flush("u" + i);
      ordered.push(ordM[1]);
      return;
    }
    flush("u" + i);
    out.push(
      <p key={key} className="text-[15px] leading-relaxed text-ink">
        <Inline text={t} />
      </p>,
    );
  });
  flush("uend");

  return <div className="space-y-3">{out}</div>;
}
