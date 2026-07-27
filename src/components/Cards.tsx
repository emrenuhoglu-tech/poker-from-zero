// Oyun kartı görselleri: belirli kartlar (Ah Kd 5c) veya genel el kodu (JTs, AKo, AA).
// "Js" = maça vale (rütbe+tür), "AKs" = as-papaz suited (iki rütbe + s).

const RANK_SET = new Set(["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"]);
const SUIT: Record<string, { sym: string; red: boolean; name: string }> = {
  s: { sym: "♠", red: false, name: "spades" },
  h: { sym: "♥", red: true, name: "hearts" },
  d: { sym: "♦", red: true, name: "diamonds" },
  c: { sym: "♣", red: false, name: "clubs" },
};
const RANK_NAME: Record<string, string> = {
  A: "ace", K: "king", Q: "queen", J: "jack", T: "ten",
  "9": "nine", "8": "eight", "7": "seven", "6": "six", "5": "five",
  "4": "four", "3": "three", "2": "two",
};

type Size = "sm" | "md" | "lg";
const DIMS: Record<Size, { w: number; r: number; big: number }> = {
  sm: { w: 32, r: 11, big: 17 },
  md: { w: 44, r: 14, big: 25 },
  lg: { w: 62, r: 19, big: 37 },
};

function cardLabel(rank: string, suit: string): string {
  const s = SUIT[suit];
  return `${RANK_NAME[rank] ?? rank} of ${s ? s.name : suit}`;
}

function PlayingCard({ rank, suit, size = "md" }: { rank: string; suit: string; size?: Size }) {
  const s = SUIT[suit] || SUIT.s;
  const d = DIMS[size];
  const color = s.red ? "#e5484d" : "#2a2320";
  return (
    <div
      role="img"
      aria-label={cardLabel(rank, suit)}
      className="relative inline-flex shrink-0 flex-col items-center justify-center rounded-xl border border-cream-200 bg-white shadow-sm"
      style={{ width: d.w, height: Math.round(d.w * 1.42) }}
    >
      <span aria-hidden="true" className="absolute left-1 top-0.5 font-extrabold leading-none" style={{ fontSize: d.r, color }}>
        {rank}
      </span>
      <span aria-hidden="true" style={{ fontSize: d.big, color, lineHeight: 1 }}>
        {s.sym}
      </span>
    </div>
  );
}

// Tür belirtilmemiş genel el (AKs/AKo/AA) için temsili tür seçimi.
function glyphSuits(code: string): [string, string] {
  if (code.length >= 3 && code[2] === "s") return ["s", "s"]; // suited → aynı renk
  return ["s", "h"]; // offsuit / çift → farklı tür
}

function handLabel(code: string): string {
  const r1 = RANK_NAME[code[0]] ?? code[0];
  const r2 = RANK_NAME[code[1]] ?? code[1];
  const suffix = code[2] === "s" ? " suited" : code[2] === "o" ? " offsuit" : "";
  return `${r1} ${r2}${suffix}`;
}

// Genel el kodu: "AKs" | "AKo" | "AA"
export function HandGlyph({ code, size = "md" }: { code: string; size?: Size }) {
  const c = code.trim();
  const [r1, r2] = [c[0], c[1]];
  const [s1, s2] = glyphSuits(c);
  const suited = c[2] === "s";
  const offsuit = c[2] === "o";
  return (
    <span role="img" aria-label={handLabel(c)} className="inline-flex items-end gap-1">
      <span aria-hidden="true" className="flex gap-1">
        <PlayingCard rank={r1} suit={s1} size={size} />
        <PlayingCard rank={r2} suit={s2} size={size} />
      </span>
      {(suited || offsuit) && (
        <span
          aria-hidden="true"
          className={
            "mb-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold " +
            (suited ? "bg-grass-soft text-grass-dark" : "bg-cream-200 text-ink-soft")
          }
        >
          {suited ? "suited" : "offsuit"}
        </span>
      )}
    </span>
  );
}

// Belirli kartlar veya el kodları içeren bir dizi. "Ah Kd 5c" (board) ya da "AKs".
export function CardRow({ spec, size = "md", label }: { spec: string; size?: Size; label?: string }) {
  const tokens = spec.trim().split(/[\s,]+/).filter(Boolean);
  return (
    <div>
      {label && <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</div>}
      <div className="flex flex-wrap items-end gap-1.5">
        {tokens.map((t, i) => {
          if (t.length >= 2 && RANK_SET.has(t[0]) && RANK_SET.has(t[1])) {
            return <HandGlyph key={i} code={t} size={size} />;
          }
          const m = t.match(/^([AKQJT2-9])([shdc])$/i);
          if (m) return <PlayingCard key={i} rank={m[1].toUpperCase()} suit={m[2].toLowerCase()} size={size} />;
          return (
            <span key={i} className="text-sm text-ink-soft">
              {t}
            </span>
          );
        })}
      </div>
    </div>
  );
}
