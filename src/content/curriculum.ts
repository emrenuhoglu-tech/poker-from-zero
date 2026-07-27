// Single source of truth: content/poker_101.md. Parsed at runtime.
// Chapter = "## Chapter N — Title". The body is rendered as markdown in LessonBody.
// A chapter may end with one or more check questions:
//   @check Question? | Correct answer | Wrong 1 | Wrong 2
// These are pulled out of the body and used to gate "Done".
import raw from "../../content/poker_101.md?raw";

export interface Check {
  q: string;
  correct: string;
  wrong: string[];
}

export interface Module {
  id: string;
  num: number;
  label: string; // "Chapter 1"
  title: string; // "Welcome"
  body: string;
  checks: Check[];
}

function parse(): Module[] {
  const parts = raw.split(/\n(?=## )/);
  const mods: Module[] = [];
  for (const part of parts) {
    const head = part.match(/^##\s+(.+)$/m);
    if (!head) continue;
    const heading = head[1].trim();
    const numMatch = heading.match(/Chapter\s+(\d+)/);
    const num = numMatch ? parseInt(numMatch[1], 10) : mods.length + 1;
    const seg = heading.split(/\s+—\s+/);
    const label = seg.length > 1 ? seg[0].trim() : `Chapter ${num}`;
    const title = seg.length > 1 ? seg.slice(1).join(" — ").trim() : heading;

    const checks: Check[] = [];
    const body = part
      .slice(part.indexOf("\n") + 1)
      .split("\n")
      .filter((line) => {
        const t = line.trim();
        if (t.startsWith("@check ")) {
          const p = t.slice(7).split("|").map((s) => s.trim()).filter(Boolean);
          if (p.length >= 3) checks.push({ q: p[0], correct: p[1], wrong: p.slice(2) });
          return false; // strip from rendered body
        }
        return true;
      })
      .join("\n")
      .replace(/^\s*---\s*$/gm, "")
      .trim();

    mods.push({ id: "b" + num, num, label, title, body, checks });
  }
  return mods;
}

export const MODULES: Module[] = parse();

export function moduleById(id: string): Module | undefined {
  return MODULES.find((m) => m.id === id);
}

// Plain narratable text for voice read-aloud: drop @cards/@check lines and markdown
// markers, and speak @hand codes as words (AKs -> "ace king suited").
const RANK_WORD: Record<string, string> = {
  A: "ace", K: "king", Q: "queen", J: "jack", T: "ten",
  "9": "nine", "8": "eight", "7": "seven", "6": "six", "5": "five",
  "4": "four", "3": "three", "2": "two",
};

function speakHand(code: string): string {
  const r1 = RANK_WORD[code[0]] ?? code[0];
  const r2 = RANK_WORD[code[1]] ?? code[1];
  const suffix = code[2] === "s" ? " suited" : code[2] === "o" ? " offsuit" : "";
  return `${r1} ${r2}${suffix}`;
}

export function narratable(body: string): string {
  return body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("@cards") && !l.startsWith("@check"))
    .map((l) =>
      l
        .replace(/^###\s+/, "")
        .replace(/^>\s+/, "")
        .replace(/^-\s+/, "")
        .replace(/^\d+\.\s+/, "")
        .replace(/\*\*/g, "")
        .replace(/@hand\s+([A-Za-z0-9]+)/g, (_m, c) => speakHand(c))
        .replace(/^[^\p{L}\p{N}(]+/u, "")
        .trim(),
    )
    .filter(Boolean)
    .map((l) => (/[.!?:]$/.test(l) ? l : l + "."))
    .join(" ");
}
