import { useEffect, useMemo, useState } from "react";
import { LessonList } from "./modes/learn/LessonList";
import { LessonPlayer } from "./modes/learn/LessonPlayer";
import { HandRankings } from "./modes/rankings/HandRankings";
import { Progress } from "./modes/progress/Progress";
import { getStats } from "./lib/progress";

type Tab = "learn" | "hands" | "progress";

function useHash(): string {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
}

function nav(to: string) {
  window.location.hash = to;
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "learn", label: "Learn", icon: "📚" },
  { id: "hands", label: "Hands", icon: "🃏" },
  { id: "progress", label: "Progress", icon: "⭐" },
];

export default function App() {
  const hash = useHash();
  const [tick, setTick] = useState(0);
  const notify = () => setTick((t) => t + 1);

  const segs = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const tab = (segs[0] as Tab) || "learn";
  const lessonId = segs[1];

  const stats = useMemo(() => getStats(), [tick, hash]);

  return (
    <div className="mx-auto flex h-[100dvh] max-w-md flex-col bg-cream-100">
      <header className="flex items-center justify-between border-b-2 border-cream-200 bg-white px-4 py-2.5">
        <span className="font-extrabold text-ink">♠️ Poker From Zero</span>
        <div className="flex items-center gap-3 text-sm font-extrabold">
          <span className="text-coral">🔥 {stats.streak}</span>
          <span className="text-gold-dark">⭐ {stats.xp}</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {tab === "learn" &&
          (lessonId ? (
            <LessonPlayer
              key={lessonId}
              moduleId={lessonId}
              onBack={() => nav("#/learn")}
              onOpen={(id) => nav("#/learn/" + id)}
              notify={notify}
            />
          ) : (
            <LessonList onOpen={(id) => nav("#/learn/" + id)} />
          ))}
        {tab === "hands" && <HandRankings notify={notify} />}
        {tab === "progress" && <Progress onOpen={(id) => nav("#/learn/" + id)} />}
      </main>

      <nav className="grid grid-cols-3 border-t-2 border-cream-200 bg-white">
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              onClick={() => nav("#/" + t.id)}
              className={
                "flex flex-col items-center gap-0.5 py-2.5 text-xs font-bold transition " +
                (active ? "text-grass-dark" : "text-ink-soft")
              }
            >
              <span className="text-xl">{t.icon}</span>
              {t.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
