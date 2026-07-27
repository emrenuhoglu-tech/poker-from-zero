// Single source of truth: content/poker_101.md. Parsed at runtime.
// Chapter = "## Chapter N — Title". The body is rendered as markdown in LessonBody.
import raw from "../../content/poker_101.md?raw";

export interface Module {
  id: string;
  num: number;
  label: string; // "Bölüm 1"
  title: string; // "Hoş geldin"
  body: string;
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
    // body: everything after the heading line, edge rules (---) stripped
    const body = part
      .slice(part.indexOf("\n") + 1)
      .replace(/^\s*---\s*$/gm, "")
      .trim();
    mods.push({ id: "b" + num, num, label, title, body });
  }
  return mods;
}

export const MODULES: Module[] = parse();

export function moduleById(id: string): Module | undefined {
  return MODULES.find((m) => m.id === id);
}
