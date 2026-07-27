// Progress: completed chapters, XP, LOCAL-day activity streak, quiz stats. localStorage.
import { load, save, remove } from "./storage";

interface ProgressData {
  done: string[]; // completed module ids
  xp: number;
  days: string[]; // LOCAL ISO days with any activity
  quizDay?: string; // local day the quiz counters below refer to
  quizAwarded?: number; // corrects that earned XP today (for the daily cap)
  quizOk?: number;
  quizTotal?: number;
  bestRun?: number; // best consecutive correct in the Hands quiz
}

const KEY = "progress";
const LEVEL_SIZE = 50; // xp per level
const DAILY_GOAL = 20; // quiz corrects that award XP per day

// LOCAL date (not UTC) so "today" matches the learner's clock, e.g. Europe/Madrid.
function localDay(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function today(): string {
  return localDay(new Date());
}

function read(): ProgressData {
  return load<ProgressData>(KEY, { done: [], xp: 0, days: [] });
}

function touchDay(p: ProgressData): void {
  const t = today();
  if (!p.days.includes(t)) p.days.push(t);
}

// Consecutive days of activity up to today. If today has no activity yet, the
// streak is still alive counting back from yesterday. DST-safe (setDate walk).
function streak(days: string[]): number {
  const set = new Set(days);
  const d = new Date();
  if (!set.has(localDay(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(localDay(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

// Complete a chapter. First time only awards XP. Returns whether it was the first time.
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

// Uncapped XP (chapter check-questions, drills). touchDay keeps the streak alive.
export function addXp(n: number): void {
  const p = read();
  p.xp += n;
  touchDay(p);
  save(KEY, p);
}

// Count any interaction as activity (keeps an honest streak even on wrong answers).
export function recordActivity(): void {
  const p = read();
  touchDay(p);
  save(KEY, p);
}

// A Hands-quiz answer. XP is capped at DAILY_GOAL corrects/day (kills farming).
export function recordQuizAnswer(ok: boolean): { awarded: number } {
  const p = read();
  const t = today();
  if (p.quizDay !== t) {
    p.quizDay = t;
    p.quizAwarded = 0;
    p.quizOk = 0;
    p.quizTotal = 0;
  }
  p.quizTotal = (p.quizTotal ?? 0) + 1;
  let awarded = 0;
  if (ok) {
    p.quizOk = (p.quizOk ?? 0) + 1;
    if ((p.quizAwarded ?? 0) < DAILY_GOAL) {
      awarded = 2;
      p.xp += 2;
      p.quizAwarded = (p.quizAwarded ?? 0) + 1;
    }
  }
  touchDay(p);
  save(KEY, p);
  return { awarded };
}

export function recordRun(run: number): void {
  const p = read();
  if (run > (p.bestRun ?? 0)) {
    p.bestRun = run;
    save(KEY, p);
  }
}

export function isDone(id: string): boolean {
  return read().done.includes(id);
}

export function resetProgress(): void {
  remove(KEY);
}

export interface Stats {
  xp: number;
  level: number;
  xpInLevel: number;
  levelSize: number;
  doneCount: number;
  streak: number;
  totalDays: number;
  practicedToday: boolean;
  goalDone: number;
  goalTarget: number;
  bestRun: number;
  quizOkToday: number;
  quizTotalToday: number;
}

export function getStats(): Stats {
  const p = read();
  const t = today();
  const onToday = p.quizDay === t;
  return {
    xp: p.xp,
    level: Math.floor(p.xp / LEVEL_SIZE) + 1,
    xpInLevel: p.xp % LEVEL_SIZE,
    levelSize: LEVEL_SIZE,
    doneCount: p.done.length,
    streak: streak(p.days),
    totalDays: p.days.length,
    practicedToday: p.days.includes(t),
    goalDone: onToday ? p.quizAwarded ?? 0 : 0,
    goalTarget: DAILY_GOAL,
    bestRun: p.bestRun ?? 0,
    quizOkToday: onToday ? p.quizOk ?? 0 : 0,
    quizTotalToday: onToday ? p.quizTotal ?? 0 : 0,
  };
}
