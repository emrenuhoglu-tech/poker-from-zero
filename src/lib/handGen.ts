// Random, category-correct 5-card example generator for the Hands quiz.
// Returns a CardRow spec (e.g. "9h 9s Kd 6c 3h") that is unambiguously the given
// ranking category (rank 1 = High Card ... 10 = Royal Flush).
const SUITS = ["s", "h", "d", "c"];
const R = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]; // index 0..12
const ALL = R.map((_, i) => i);

function rint(n: number): number {
  return Math.floor(Math.random() * n);
}
function pick<T>(a: T[]): T {
  return a[rint(a.length)];
}
function shuffle<T>(a: T[]): T[] {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = rint(i + 1);
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
// k distinct rank indices from a pool
function sample(pool: number[], k: number): number[] {
  return shuffle(pool).slice(0, k);
}
// 5 distinct ranks form a straight (incl. the A-2-3-4-5 wheel)?
function isStraightSet(idxs: number[]): boolean {
  const s = [...new Set(idxs)].sort((a, b) => a - b);
  if (s.length !== 5) return false;
  if (s[4] - s[0] === 4) return true;
  return JSON.stringify(s) === JSON.stringify([0, 1, 2, 3, 12]); // wheel A2345
}
// n suits, guaranteed at least 2 distinct (so a straight/high-card can't be a flush)
function mixedSuits(n: number): string[] {
  const order = shuffle(SUITS);
  return Array.from({ length: n }, (_, i) => order[i % 4]);
}
function card(i: number, s: string): string {
  return R[i] + s;
}

export function genExample(rank: number): string {
  switch (rank) {
    case 10: {
      // Royal flush
      const s = pick(SUITS);
      return [8, 9, 10, 11, 12].map((i) => card(i, s)).join(" ");
    }
    case 9: {
      // Straight flush (avoid royal: start 0..7 → up to 9-K)
      const s = pick(SUITS);
      const st = rint(8);
      return [0, 1, 2, 3, 4].map((o) => card(st + o, s)).join(" ");
    }
    case 8: {
      // Four of a kind
      const q = rint(13);
      const k = pick(ALL.filter((x) => x !== q));
      return [...SUITS.map((su) => card(q, su)), card(k, pick(SUITS))].join(" ");
    }
    case 7: {
      // Full house
      const t = rint(13);
      const p = pick(ALL.filter((x) => x !== t));
      const ts = shuffle(SUITS).slice(0, 3).map((su) => card(t, su));
      const ps = shuffle(SUITS).slice(0, 2).map((su) => card(p, su));
      return [...ts, ...ps].join(" ");
    }
    case 6: {
      // Flush (5 same suit, not a straight)
      const s = pick(SUITS);
      let idxs: number[];
      do {
        idxs = sample(ALL, 5);
      } while (isStraightSet(idxs));
      return idxs.map((i) => card(i, s)).join(" ");
    }
    case 5: {
      // Straight (mixed suits so it isn't a straight flush)
      const st = rint(9); // up to T-J-Q-K-A
      const suits = mixedSuits(5);
      return [0, 1, 2, 3, 4].map((o, k) => card(st + o, suits[k])).join(" ");
    }
    case 4: {
      // Three of a kind
      const t = rint(13);
      const ks = sample(ALL.filter((x) => x !== t), 2);
      const ts = shuffle(SUITS).slice(0, 3).map((su) => card(t, su));
      return [...ts, ...ks.map((i) => card(i, pick(SUITS)))].join(" ");
    }
    case 3: {
      // Two pair
      const [p1, p2] = sample(ALL, 2);
      const k = pick(ALL.filter((x) => x !== p1 && x !== p2));
      const a = shuffle(SUITS).slice(0, 2).map((su) => card(p1, su));
      const b = shuffle(SUITS).slice(0, 2).map((su) => card(p2, su));
      return [...a, ...b, card(k, pick(SUITS))].join(" ");
    }
    case 2: {
      // One pair
      const p = rint(13);
      const ks = sample(ALL.filter((x) => x !== p), 3);
      const pr = shuffle(SUITS).slice(0, 2).map((su) => card(p, su));
      return [...pr, ...ks.map((i) => card(i, pick(SUITS)))].join(" ");
    }
    default: {
      // High card (5 distinct ranks, not a straight, mixed suits)
      let idxs: number[];
      do {
        idxs = sample(ALL, 5);
      } while (isStraightSet(idxs));
      const suits = mixedSuits(5);
      return idxs.map((i, k) => card(i, suits[k])).join(" ");
    }
  }
}
