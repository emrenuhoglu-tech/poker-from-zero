// İlerleme: tamamlanan bölümler, XP, gün serisi. localStorage.
import { load, save } from "./storage";

interface ProgressData {
  done: string[]; // tamamlanan modül id'leri
  xp: number;
  days: string[]; // çalışılan ISO günler
}

const KEY = "progress";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function read(): ProgressData {
  return load<ProgressData>(KEY, { done: [], xp: 0, days: [] });
}

function touchDay(p: ProgressData): void {
  if (!p.days.includes(today())) p.days.push(today());
}

// Bir bölümü tamamla. İlk kez tamamlanıyorsa XP ver. İlk-kez mi döndürür.
export function completeModule(id: string, xp = 10): boolean {
  const p = read();
  const first = !p.done.includes(id);
  if (first) {
    p.done.push(id);
    p.xp += xp;
  }
  touchDay(p);
  save(KEY, p);
  return first;
}

export function addXp(n: number): void {
  const p = read();
  p.xp += n;
  touchDay(p);
  save(KEY, p);
}

export function isDone(id: string): boolean {
  return read().done.includes(id);
}

function streak(days: string[]): number {
  const set = new Set(days);
  const d = new Date();
  let n = 0;
  for (let i = 0; i < 120; i++) {
    const iso = new Date(d.getTime() - i * 86400000).toISOString().slice(0, 10);
    if (set.has(iso)) n++;
    else if (i > 0) break;
  }
  return n;
}

export interface Stats {
  xp: number;
  doneCount: number;
  streak: number;
  totalDays: number;
}

export function getStats(): Stats {
  const p = read();
  return { xp: p.xp, doneCount: p.done.length, streak: streak(p.days), totalDays: p.days.length };
}
