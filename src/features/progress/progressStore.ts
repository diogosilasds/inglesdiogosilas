import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PASS_THRESHOLD, STAR_THRESHOLDS, XP_BONUS_PERFECT, XP_PER_CORRECT } from "@/config/constants";

export interface TextProgress {
  status: "LOCKED" | "UNLOCKED" | "COMPLETED";
  stars: 0 | 1 | 2 | 3;
  highScore: number;
  attempts: number;
  mistakes: Record<string, number>; // pair "en" sentence -> error count
}

export interface DayActivity {
  date: string; // YYYY-MM-DD
  answered: number;
  correct: number;
}

export interface ProgressState {
  global: {
    xp: number;
    streak: number;
    lastActiveDate: string;
    totalAnswered: number;
    totalCorrect: number;
    activity: DayActivity[]; // last 30 days
  };
  texts: Record<string, TextProgress>;
  ensureUnlocked: (id: number) => void;
  recordSession: (
    textId: number,
    answered: number,
    correct: number,
    mistakes: string[],
    nextTextId?: number,
  ) => { earnedXp: number; newStars: number; unlockedNext: boolean };
  recordSingle: (correct: boolean) => void;
  toggleCompleted: (textId: number) => void;
  reset: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

const computeStars = (ratio: number): 0 | 1 | 2 | 3 => {
  if (ratio >= STAR_THRESHOLDS.three) return 3;
  if (ratio >= STAR_THRESHOLDS.two) return 2;
  if (ratio >= STAR_THRESHOLDS.one) return 1;
  return 0;
};

const updateActivity = (activity: DayActivity[], answered: number, correct: number): DayActivity[] => {
  const t = today();
  const list = [...activity];
  const existing = list.find((d) => d.date === t);
  if (existing) {
    existing.answered += answered;
    existing.correct += correct;
  } else {
    list.push({ date: t, answered, correct });
  }
  // keep last 30
  return list.slice(-30);
};

const updateStreak = (lastActive: string, currentStreak: number): { streak: number; lastActiveDate: string } => {
  const t = today();
  if (lastActive === t) return { streak: currentStreak || 1, lastActiveDate: t };
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (lastActive === yesterday) return { streak: currentStreak + 1, lastActiveDate: t };
  return { streak: 1, lastActiveDate: t };
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      global: {
        xp: 0,
        streak: 0,
        lastActiveDate: "",
        totalAnswered: 0,
        totalCorrect: 0,
        activity: [],
      },
      texts: {},
      ensureUnlocked: (id) => {
        const { texts } = get();
        if (!texts[id]) {
          set({
            texts: {
              ...texts,
              [id]: { status: "UNLOCKED", stars: 0, highScore: 0, attempts: 0, mistakes: {} },
            },
          });
        }
      },
      recordSingle: (correct) => {
        const g = get().global;
        const streakUp = updateStreak(g.lastActiveDate, g.streak);
        set({
          global: {
            ...g,
            ...streakUp,
            totalAnswered: g.totalAnswered + 1,
            totalCorrect: g.totalCorrect + (correct ? 1 : 0),
            activity: updateActivity(g.activity, 1, correct ? 1 : 0),
            xp: g.xp + (correct ? XP_PER_CORRECT : 0),
          },
        });
      },
      recordSession: (textId, answered, correct, mistakes, nextTextId) => {
        const ratio = answered ? correct / answered : 0;
        const stars = computeStars(ratio);
        const earnedXp = correct * XP_PER_CORRECT + (ratio === 1 ? XP_BONUS_PERFECT : 0);
        const { texts, global } = get();
        const prev: TextProgress = texts[textId] ?? {
          status: "UNLOCKED",
          stars: 0,
          highScore: 0,
          attempts: 0,
          mistakes: {},
        };
        const mistakeMap = { ...prev.mistakes };
        mistakes.forEach((m) => {
          mistakeMap[m] = (mistakeMap[m] ?? 0) + 1;
        });
        const newTexts: Record<string, TextProgress> = {
          ...texts,
          [textId]: {
            status: ratio >= PASS_THRESHOLD ? "COMPLETED" : "UNLOCKED",
            stars: Math.max(prev.stars, stars) as 0 | 1 | 2 | 3,
            highScore: Math.max(prev.highScore, Math.round(ratio * 100)),
            attempts: prev.attempts + 1,
            mistakes: mistakeMap,
          },
        };
        let unlockedNext = false;
        if (ratio >= PASS_THRESHOLD && nextTextId && !newTexts[nextTextId]) {
          newTexts[nextTextId] = {
            status: "UNLOCKED",
            stars: 0,
            highScore: 0,
            attempts: 0,
            mistakes: {},
          };
          unlockedNext = true;
        }
        const streakUp = updateStreak(global.lastActiveDate, global.streak);
        set({
          texts: newTexts,
          global: {
            ...global,
            ...streakUp,
            xp: global.xp + earnedXp,
            totalAnswered: global.totalAnswered + answered,
            totalCorrect: global.totalCorrect + correct,
            activity: updateActivity(global.activity, answered, correct),
          },
        });
        return { earnedXp, newStars: stars, unlockedNext };
      },
      toggleCompleted: (textId) => {
        const { texts } = get();
        const prev: TextProgress = texts[textId] ?? {
          status: "UNLOCKED",
          stars: 0,
          highScore: 0,
          attempts: 0,
          mistakes: {},
        };
        const isDone = prev.status === "COMPLETED";
        set({
          texts: {
            ...texts,
            [textId]: {
              ...prev,
              status: isDone ? "UNLOCKED" : "COMPLETED",
              stars: isDone ? prev.stars : (Math.max(prev.stars, 1) as 0 | 1 | 2 | 3),
            },
          },
        });
      },
      reset: () =>
        set({
          global: { xp: 0, streak: 0, lastActiveDate: "", totalAnswered: 0, totalCorrect: 0, activity: [] },
          texts: {},
        }),
    }),
    { name: "mv80-progress-v1" },
  ),
);
