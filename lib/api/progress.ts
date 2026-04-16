import {
    collection,
    deleteDoc,
    doc,
    documentId,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
    writeBatch,
} from "firebase/firestore";

import { cacheInvalidatePrefix, fetchWithCache, USER_TTL } from "@/lib/cache";
import { db } from "@/lib/firebase";
import { buildDifficultyProgress, resolveActiveDifficulty } from "./cards";
import { fetchCodingPracticeProgress, fetchCodingExercises } from "./coding-practice";
import { getTotalCardsForCategory } from "./catalog";
import type {
    CardHistory,
    CategoryProgress,
    CategoryStats,
    InProgressLessonRecord,
    LessonRecord,
    ProgressSummary,
    ScoreLevel,
    SummaryLevel,
    UserLevel,
    WeakestSubject,
} from "./types";

// ---------------------------------------------------------------------------
// Scoring helpers (also exported for use in community module)
// ---------------------------------------------------------------------------

export function getSummaryLevel(accuracyPercent: number): SummaryLevel {
  if (accuracyPercent > 80) return "Expert";
  if (accuracyPercent > 50) return "Profissional";
  if (accuracyPercent > 20) return "Intermediário";
  return "Iniciante";
}

export function getScoreLevel(score: number): ScoreLevel {
  if (score > 3000) return "Diamante";
  if (score > 1500) return "Ouro";
  if (score > 500) return "Prata";
  return "Bronze";
}

export function calculateScore(
  totalQuestions: number,
  accuracyPercent: number,
  avgTimePerQuestionMs: number,
): number {
  const baseScore = totalQuestions;
  const accuracyBonus = baseScore * (accuracyPercent / 100) * 0.5;
  const speedFactor = Math.max(0, 1 - avgTimePerQuestionMs / 20000);
  const speedBonus = baseScore * speedFactor * 0.25;
  return Math.round(baseScore + accuracyBonus + speedBonus);
}

export function calculateCodingExerciseScore(
  minMoves: number,
  bestMoves: number,
  difficulty: "fácil" | "intermediário" | "avançado" = "fácil"
): number {
  const accuracy = Math.min(100, Math.round((minMoves / (bestMoves || minMoves)) * 100));
  const diffMultiplier = difficulty === 'avançado' ? 2 : (difficulty === 'intermediário' ? 1.5 : 1);
  
  // Use 1 base point per exercise as requested
  const exerciseScore = calculateScore(1, accuracy, 0); 
  return Math.round(exerciseScore * diffMultiplier);
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

export async function invalidateUserCaches(uid: string): Promise<void> {
  await Promise.all([
    cacheInvalidatePrefix(`progress:${uid}`),
    cacheInvalidatePrefix(`catStats:${uid}`),
  ]);
}

function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function calculateStreak(lessons: LessonRecord[]): number {
  if (lessons.length === 0) return 0;

  const uniqueDays = new Set<string>();
  for (const lesson of lessons) {
    const ts = lesson.createdAt as { toDate?: () => Date } | undefined;
    if (!ts || typeof ts.toDate !== "function") continue;
    uniqueDays.add(formatDateKey(ts.toDate()));
  }

  if (uniqueDays.size === 0) return 0;

  const sorted = Array.from(uniqueDays).sort().reverse();
  const now = new Date();
  const todayStr = formatDateKey(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateKey(yesterday);

  if (sorted[0] !== todayStr && sorted[0] !== yesterdayStr) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + "T00:00:00");
    const curr = new Date(sorted[i] + "T00:00:00");
    const diffDays = Math.round(
      (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

async function getUniqueSeenQuestionsByCategory(
  uid: string,
): Promise<Map<string, number>> {
  const historyRef = collection(db, "users", uid, "cardHistory");
  const historySnapshot = await getDocs(historyRef);

  const uniqueCardIds = Array.from(
    new Set(
      historySnapshot.docs
        .map((d) => (d.data().cardId as string | undefined)?.trim())
        .filter((id): id is string => Boolean(id)),
    ),
  );

  if (uniqueCardIds.length === 0) return new Map<string, number>();

  const cardsRef = collection(db, "cards");
  const categoryCounts = new Map<string, number>();

  for (let i = 0; i < uniqueCardIds.length; i += 30) {
    const chunk = uniqueCardIds.slice(i, i + 30);
    const cardsQuery = query(cardsRef, where(documentId(), "in", chunk));
    const cardsSnapshot = await getDocs(cardsQuery);

    for (const cardDoc of cardsSnapshot.docs) {
      const card = cardDoc.data();
      const track = (card.track as string | undefined)?.trim();
      const category = (card.category as string | undefined)?.trim();
      if (!track || !category) continue;
      const key = `${track}__${category}`;
      categoryCounts.set(key, (categoryCounts.get(key) ?? 0) + 1);
    }
  }

  return categoryCounts;
}

// ---------------------------------------------------------------------------
// Fetch user progress
// ---------------------------------------------------------------------------

export async function fetchUserProgress(uid: string): Promise<ProgressSummary> {
  return fetchWithCache(
    `progress:${uid}`,
    () => _fetchUserProgressFromServer(uid),
    USER_TTL,
  );
}

async function _fetchUserProgressFromServer(
  uid: string,
): Promise<ProgressSummary> {
  const lessonsRef = collection(db, "users", uid, "lessons");
  const inProgressRef = collection(db, "users", uid, "inProgressLessons");
  const lessonsQuery = query(lessonsRef);

  const [lessonsSnapshot, inProgressSnapshot, codingResults, allExercises] = await Promise.all([
    getDocs(lessonsQuery),
    getDocs(inProgressRef),
    fetchCodingPracticeProgress(uid),
    fetchCodingExercises()
  ]);

  const uniqueSeenByCategory = await getUniqueSeenQuestionsByCategory(uid);

  const lessons: LessonRecord[] = lessonsSnapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<LessonRecord, "id">),
  }));

  const inProgressLessons: InProgressLessonRecord[] =
    inProgressSnapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<InProgressLessonRecord, "id">),
    }));

  const hasAnyCodingResult = Object.keys(codingResults).length > 0;

  if (lessons.length === 0 && inProgressLessons.length === 0 && !hasAnyCodingResult) {
    return {
      accuracyPercent: 0,
      avgTimeMs: 0,
      totalLessons: 0,
      totalScore: 0,
      streak: 0,
      categories: [],
    };
  }

  const grouped = new Map<
    string,
    {
      track: string;
      category: string;
      correct: number;
      total: number;
      totalDurationMs: number;
      totalQuestionsAnswered: number;
      totalLessons: number;
      inProgressAnswered: number;
      hasInProgressLesson: boolean;
      lastStudiedAt: number;
    }
  >();

  let totalCorrect = 0;
  let totalQuestions = 0;
  let totalDuration = 0;

  for (const lesson of lessons) {
    totalCorrect += lesson.correctCount;
    totalQuestions += lesson.totalCount;
    totalDuration += lesson.durationMs;

    const track = lesson.track ?? "";
    const key = `${track}__${lesson.category}`;
    const ts = lesson.createdAt as { toDate?: () => Date } | undefined;
    const lessonMs = ts?.toDate?.()?.getTime() ?? 0;
    const existing = grouped.get(key);
    if (existing) {
      existing.correct += lesson.correctCount;
      existing.total += lesson.totalCount;
      existing.totalDurationMs += lesson.durationMs;
      existing.totalQuestionsAnswered += lesson.totalCount;
      existing.totalLessons += 1;
      if (lessonMs > existing.lastStudiedAt) existing.lastStudiedAt = lessonMs;
    } else {
      grouped.set(key, {
        track,
        category: lesson.category,
        correct: lesson.correctCount,
        total: lesson.totalCount,
        totalDurationMs: lesson.durationMs,
        totalQuestionsAnswered: lesson.totalCount,
        totalLessons: 1,
        inProgressAnswered: 0,
        hasInProgressLesson: false,
        lastStudiedAt: lessonMs,
      });
    }
  }

  for (const inProgress of inProgressLessons) {
    totalCorrect += inProgress.correctCount;
    totalQuestions += inProgress.answeredCount;
    totalDuration += inProgress.elapsedMs;

    const key = `${inProgress.track}__${inProgress.category}`;
    const ipTs = inProgress.updatedAt as { toDate?: () => Date } | undefined;
    const ipMs = ipTs?.toDate?.()?.getTime() ?? 0;
    const existing = grouped.get(key);
    if (existing) {
      existing.correct += inProgress.correctCount;
      existing.total += inProgress.answeredCount;
      existing.totalDurationMs += inProgress.elapsedMs;
      existing.totalQuestionsAnswered += inProgress.answeredCount;
      existing.inProgressAnswered += inProgress.answeredCount;
      existing.hasInProgressLesson = true;
      if (ipMs > existing.lastStudiedAt) existing.lastStudiedAt = ipMs;
    } else {
      grouped.set(key, {
        track: inProgress.track,
        category: inProgress.category,
        correct: inProgress.correctCount,
        total: inProgress.answeredCount,
        totalDurationMs: inProgress.elapsedMs,
        totalQuestionsAnswered: inProgress.answeredCount,
        totalLessons: 0,
        inProgressAnswered: inProgress.answeredCount,
        hasInProgressLesson: true,
        lastStudiedAt: ipMs,
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Calculate Coding Practice Score
  // ---------------------------------------------------------------------------
  let totalCodingScore = 0;
  Object.keys(codingResults).forEach(exerciseId => {
    const res = codingResults[exerciseId];
    if (!res.completed) return;

    const exercise = allExercises.find(e => e.id === exerciseId);
    if (!exercise) return;

    const minMoves = exercise.solution.filter(s => s !== 'sym_newline').length;
    const bestMoves = res.bestMoves || minMoves;
    
    totalCodingScore += calculateCodingExerciseScore(
      minMoves, 
      bestMoves, 
      exercise.difficulty as any
    );
  });

  const avgTimePerQuestion =
    totalQuestions > 0 ? totalDuration / totalQuestions : 0;
  const totalScore = calculateScore(
    totalQuestions,
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
    avgTimePerQuestion,
  );

  const finalScore = (totalScore || 0) + totalCodingScore;

  const categories: CategoryProgress[] = (
    await Promise.all(
      Array.from(grouped.values()).map(async (data) => {
        let totalCardsInCategory = 0;
        try {
          if (data.track && data.category) {
            totalCardsInCategory = await getTotalCardsForCategory(
              data.track,
              data.category,
            );
          }
        } catch (err) {
          console.warn(
            `Falha ao contar cards para ${data.track}/${data.category}:`,
            err,
          );
        }

        const uniqueSeen =
          uniqueSeenByCategory.get(`${data.track}__${data.category}`) ??
          Math.min(data.totalQuestionsAnswered, totalCardsInCategory);

        const studyPercent =
          totalCardsInCategory > 0
            ? Math.min(
                100,
                Math.round((uniqueSeen / totalCardsInCategory) * 100),
              )
            : 0;

        return {
          track: data.track,
          category: data.category,
          totalLessons: data.totalLessons,
          totalQuestionsAnswered: data.totalQuestionsAnswered,
          uniqueQuestionsAnswered: uniqueSeen,
          studyPercent,
          accuracyPercent:
            data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
          avgTimePerQuestionMs:
            data.totalQuestionsAnswered > 0
              ? Math.round(data.totalDurationMs / data.totalQuestionsAnswered)
              : 0,
          inProgressAnswered: data.inProgressAnswered,
          hasInProgressLesson: data.hasInProgressLesson,
          lastStudiedAt: data.lastStudiedAt,
        };
      }),
    )
  ).sort((a, b) => b.lastStudiedAt - a.lastStudiedAt);

  const accuracyPercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const avgTimeMs = lessons.length > 0 ? Math.round(totalDuration / lessons.length) : 0;

  return {
    accuracyPercent,
    avgTimeMs,
    totalLessons: lessons.length,
    totalScore: finalScore,
    streak: calculateStreak(lessons),
    categories,
  };
}

// ---------------------------------------------------------------------------
// Category stats
// ---------------------------------------------------------------------------

export async function fetchCategoryStats(
  uid: string,
  track: string,
  category: string,
): Promise<CategoryStats> {
  const cardsRef = collection(db, "cards");
  const lessonsRef = collection(db, "users", uid, "lessons");
  const inProgressRef = collection(db, "users", uid, "inProgressLessons");
  const histRef = collection(db, "users", uid, "cardHistory");

  const cardsQuery = query(
    cardsRef,
    where("track", "==", track),
    where("category", "==", category),
  );
  const lessonsQuery = query(
    lessonsRef,
    where("track", "==", track),
    where("category", "==", category),
  );
  const inProgressQuery = query(
    inProgressRef,
    where("track", "==", track),
    where("category", "==", category),
  );
  const histQuery = query(
    histRef,
    where("cardId", ">=", `${track}__${category}__`),
    where("cardId", "<", `${track}__${category}__\uf8ff`),
  );

  const [cardsSnap, lessonsSnap, inProgressSnap, histSnap] = await Promise.all([
    getDocs(cardsQuery),
    getDocs(lessonsQuery),
    getDocs(inProgressQuery),
    getDocs(histQuery),
  ]);

  const allCards = cardsSnap.docs.map((cardDoc) => ({
    id: cardDoc.id,
    difficulty: ((cardDoc.data().difficulty as UserLevel | undefined) ??
      "Fácil") as UserLevel,
  }));
  const totalCards = allCards.length;

  let totalAnswered = 0;
  for (const d of lessonsSnap.docs) {
    totalAnswered += (d.data().totalCount as number) ?? 0;
  }

  let inProgressAnswered = 0;
  let hasInProgressLesson = false;
  for (const d of inProgressSnap.docs) {
    const answered = (d.data().answeredCount as number) ?? 0;
    inProgressAnswered += answered;
    if (answered > 0) hasInProgressLesson = true;
  }
  totalAnswered += inProgressAnswered;

  let uniqueStudied = 0;
  let uniqueCorrect = 0;
  let dueForReview = 0;
  const now = Date.now();
  const history = new Map<string, CardHistory>();

  for (const d of histSnap.docs) {
    const data = d.data() as CardHistory;
    history.set(data.cardId, data);
    uniqueStudied++;
    if ((data.timesCorrect ?? 0) > 0) uniqueCorrect++;

    const reviewAt =
      data.nextReviewAt instanceof Date
        ? data.nextReviewAt.getTime()
        : typeof data.nextReviewAt === "object" &&
            data.nextReviewAt !== null &&
            "toMillis" in data.nextReviewAt
          ? (data.nextReviewAt as { toMillis(): number }).toMillis()
          : typeof data.nextReviewAt === "number"
            ? data.nextReviewAt
            : 0;
    if (reviewAt > 0 && reviewAt <= now) dueForReview++;
  }

  const progressByDifficulty = buildDifficultyProgress(allCards, history);
  const { activeDifficulty, nextDifficulty } =
    resolveActiveDifficulty(progressByDifficulty);
  const activeProgress = progressByDifficulty.find(
    (item) => item.difficulty === activeDifficulty,
  );

  return {
    totalCards,
    uniqueStudied,
    uniqueCorrect,
    totalAnswered,
    accuracyPercent:
      uniqueStudied > 0 ? Math.round((uniqueCorrect / uniqueStudied) * 100) : 0,
    hasInProgressLesson,
    inProgressAnswered,
    dueForReview,
    currentDifficulty: totalCards > 0 ? activeDifficulty : null,
    currentDifficultyMasteryPercent: activeProgress?.masteryPercent ?? 0,
    nextDifficulty,
  };
}

// ---------------------------------------------------------------------------
// Weakest subjects
// ---------------------------------------------------------------------------

export async function getWeakestSubjects(
  uid: string,
  limit: number = 5,
): Promise<WeakestSubject[]> {
  const histRef = collection(db, "users", uid, "cardHistory");
  const snapshot = await getDocs(histRef);

  const grouped = new Map<
    string,
    {
      track: string;
      category: string;
      uniqueCards: number;
      totalShown: number;
      totalCorrect: number;
      totalWrong: number;
    }
  >();

  for (const d of snapshot.docs) {
    const data = d.data() as CardHistory;
    const parts = data.cardId.split("__");
    if (parts.length < 3) continue;

    const track = parts[0];
    const category = parts[1];
    const key = `${track}__${category}`;

    const existing = grouped.get(key);
    if (existing) {
      existing.uniqueCards += 1;
      existing.totalShown += data.timesShown ?? 0;
      existing.totalCorrect += data.timesCorrect ?? 0;
      existing.totalWrong += data.timesWrong ?? 0;
    } else {
      grouped.set(key, {
        track,
        category,
        uniqueCards: 1,
        totalShown: data.timesShown ?? 0,
        totalCorrect: data.timesCorrect ?? 0,
        totalWrong: data.timesWrong ?? 0,
      });
    }
  }

  const subjects = Array.from(grouped.values())
    .filter(
      (g) =>
        g.uniqueCards >= 3 &&
        (g.totalShown > 0
          ? Math.round((g.totalCorrect / g.totalShown) * 100)
          : 0) <= 80,
    )
    .map((g) => ({
      track: g.track,
      category: g.category,
      accuracy:
        g.totalShown > 0
          ? Math.round((g.totalCorrect / g.totalShown) * 100)
          : 0,
      uniqueCards: g.uniqueCards,
      totalAnswered: g.totalShown,
      totalWrong: g.totalWrong,
    }))
    .sort((a, b) => b.totalWrong - a.totalWrong);

  return subjects.slice(0, limit);
}

// ---------------------------------------------------------------------------
// Reset progress
// ---------------------------------------------------------------------------

export async function resetUserProgress(uid: string): Promise<void> {
  async function deleteCollection(
    colRef: ReturnType<typeof collection>,
  ): Promise<void> {
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return;
    const docs = snapshot.docs;
    for (let i = 0; i < docs.length; i += 500) {
      const chunk = docs.slice(i, i + 500);
      const batch = writeBatch(db);
      for (const d of chunk) batch.delete(d.ref);
      await batch.commit();
    }
  }

  await deleteCollection(collection(db, "users", uid, "lessons"));
  await deleteCollection(collection(db, "users", uid, "inProgressLessons"));
  await deleteCollection(collection(db, "users", uid, "cardHistory"));
  await deleteCollection(collection(db, "users", uid, "codingPracticeResults"));

  try {
    await deleteDoc(doc(db, "users", uid, "progressData", "current"));
  } catch {
    // May not exist
  }

  try {
    await setDoc(
      doc(db, "community", uid),
      {
        level: "Iniciante" as SummaryLevel,
        scoreLevel: "Bronze" as ScoreLevel,
        score: 0,
        totalQuestionsAnswered: 0,
        overallAccuracy: 0,
        avgTimePerQuestion: 0,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Erro ao resetar perfil da comunidade:", error);
  }

  void invalidateUserCaches(uid);
  void cacheInvalidatePrefix("community:");
}
