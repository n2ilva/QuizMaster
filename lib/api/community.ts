import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";

import {
  cacheInvalidatePrefix,
  COMMUNITY_TTL,
  fetchWithCache,
} from "@/lib/cache";
import { db } from "@/lib/firebase";
import { 
  calculateScore, 
  calculateStreak, 
  getScoreLevel, 
  getSummaryLevel, 
  invalidateUserCaches,
  calculateCodingExerciseScore
} from "./progress";
import { fetchCodingPracticeProgress, fetchCodingExercises } from "./coding-practice";
import type {
  LessonRecord,
  ScoreLevel,
  SummaryLevel,
  UserProfile,
  UserProgressData,
} from "./types";

// ---------------------------------------------------------------------------
// Community / ranking
// ---------------------------------------------------------------------------

/**
 * Atualiza o perfil público do usuário após uma lição completada.
 */
export async function updateUserProfile(
  uid: string,
  userName?: string,
): Promise<void> {
  const lessonsRef = collection(db, "users", uid, "lessons");
  
  // Fetch everything in parallel for the hybrid score
  const [lessonsSnapshot, codingResults] = await Promise.all([
    getDocs(lessonsRef),
    fetchCodingPracticeProgress(uid)
  ]);

  let totalCorrect = 0;
  let totalQuestions = 0;
  let totalDuration = 0;

  // Aggregate Quiz stats
  const categoryMap = new Map<
    string,
    { track: string; correct: number; total: number; duration: number }
  >();

  lessonsSnapshot.docs.forEach((d) => {
    const data = d.data() as LessonRecord;
    totalCorrect += data.correctCount;
    totalQuestions += data.totalCount;
    totalDuration += data.durationMs;
    const key = data.category;
    const existing = categoryMap.get(key);
    if (existing) {
      existing.correct += data.correctCount;
      existing.total += data.totalCount;
      existing.duration += data.durationMs;
    } else {
      categoryMap.set(key, {
        track: data.track ?? "",
        correct: data.correctCount,
        total: data.totalCount,
        duration: data.durationMs,
      });
    }
  });

  // Calculate Quiz Score
  const avgTimePerQuestion = totalQuestions > 0 ? totalDuration / totalQuestions : 0;
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const quizScore = calculateScore(totalQuestions, accuracy, avgTimePerQuestion);

  // Calculate Coding Practice Score (Quebra-Cabeça)
  const allExercises = await fetchCodingExercises();
  let codingScore = 0;
  let totalCodingCompleted = 0;
  
  const codingCategoryMap = new Map<
    string,
    { language: string; type: string; accuracySum: number; timeSum: number; count: number }
  >();

  Object.keys(codingResults).forEach((exerciseId) => {
    const res = codingResults[exerciseId];
    if (!res.completed) return;

    totalCodingCompleted++;
    const exercise = allExercises.find(e => e.id === exerciseId);
    if (!exercise) return;

    const minMoves = exercise.solution.filter(s => s !== 'sym_newline').length;
    const bestMoves = res.bestMoves || minMoves;
    const accuracy = Math.min(100, Math.round((minMoves / bestMoves) * 100));

    codingScore += calculateCodingExerciseScore(
      minMoves,
      bestMoves,
      exercise.difficulty as any
    );

    // Aggregate coding stats per category
    const key = `${exercise.language}__${exercise.exerciseType}`;
    const existing = codingCategoryMap.get(key);
    if (existing) {
      existing.accuracySum += accuracy;
      existing.timeSum += res.bestTime;
      existing.count += 1;
    } else {
      codingCategoryMap.set(key, {
        language: exercise.language,
        type: exercise.exerciseType,
        accuracySum: accuracy,
        timeSum: res.bestTime,
        count: 1,
      });
    }
  });

  // Pick top coding category
  let topCodingCategory: string | undefined;
  let topCodingAccuracy: number | undefined;
  let topCodingAvgTimeMs: number | undefined;
  let topCodingCount = 0;

  codingCategoryMap.forEach((val) => {
    if (val.count > topCodingCount) {
      topCodingCount = val.count;
      topCodingCategory = `${val.language} - ${val.type}`;
      topCodingAccuracy = Math.round(val.accuracySum / val.count);
      topCodingAvgTimeMs = Math.round((val.timeSum / val.count) * 1000); // converting bestTime (seconds) to ms
    }
  });

  const totalScore = quizScore + codingScore;
  const summaryLevel = getSummaryLevel(accuracy);
  const scoreLevel = getScoreLevel(totalScore);

  // Streak
  const lessonsForStreak: LessonRecord[] = lessonsSnapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as LessonRecord,
  );
  const streak = calculateStreak(lessonsForStreak);

  // Top Category (Quiz)
  let topCategory: string | undefined;
  let topCategoryTrack: string | undefined;
  let topCategoryAccuracy: number | undefined;
  let topCategoryAvgTimeMs: number | undefined;
  let topTotal = 0;
  categoryMap.forEach((val, key) => {
    if (val.total > topTotal) {
      topTotal = val.total;
      topCategory = key;
      topCategoryTrack = val.track;
      topCategoryAccuracy = val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0;
      topCategoryAvgTimeMs = val.total > 0 ? Math.round(val.duration / val.total) : 0;
    }
  });

  const progressRef = doc(db, "users", uid, "progressData", "current");
  const profileRef = doc(db, "community", uid);

  const batch = writeBatch(db);
  batch.set(progressRef, {
    level: summaryLevel,
    scoreLevel,
    score: totalScore,
    totalQuestionsAnswered: totalQuestions,
    totalCodingCompleted,
    overallAccuracy: accuracy,
    avgTimePerQuestion,
    topCodingCategory,
    topCodingAccuracy,
    topCodingAvgTimeMs,
    updatedAt: serverTimestamp(),
  } as UserProgressData);

  const profileData: any = {
    userId: uid,
    level: summaryLevel,
    scoreLevel,
    score: totalScore,
    totalQuestionsAnswered: totalQuestions,
    totalCodingCompleted,
    overallAccuracy: accuracy,
    avgTimePerQuestion,
    streak,
    topCodingCategory,
    topCodingAccuracy,
    topCodingAvgTimeMs,
    ...(topCategory !== undefined && {
      topCategory,
      topCategoryTrack: topCategoryTrack ?? "",
      topCategoryAccuracy: topCategoryAccuracy ?? 0,
      topCategoryAvgTimeMs: topCategoryAvgTimeMs ?? 0,
    }),
    updatedAt: serverTimestamp(),
  };

  if (userName) {
    profileData.name = userName;
  }

  batch.set(profileRef, profileData, { merge: true });

  await batch.commit();

  void invalidateUserCaches(uid);
  void cacheInvalidatePrefix("community:");
}

/**
 * Garante que o usuário tem um perfil na comunidade, mesmo sem lições completadas.
 */
export async function ensureUserProfile(
  uid: string,
  userName: string,
): Promise<void> {
  const profileRef = doc(db, "community", uid);
  await setDoc(
    profileRef,
    { userId: uid, name: userName, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

/**
 * Busca todos os usuários ordenados pela pontuação (decrescente).
 */
export async function fetchUsersByLevel(
  level: ScoreLevel,
  limitCount: number = 50,
): Promise<UserProfile[]> {
  return fetchWithCache(
    `community:${level}:${limitCount}`,
    async () => {
      const communityRef = collection(db, "community");
      const q = query(communityRef, orderBy("score", "desc"));
      const snapshot = await getDocs(q);

      return snapshot.docs
        .map((d) => {
          const score = (d.data().score as number) ?? 0;
          return {
            userId: d.id,
            name: (d.data().name as string) ?? "Usuário",
            level: (d.data().level as SummaryLevel) ?? "Iniciante",
            scoreLevel:
              (d.data().scoreLevel as ScoreLevel) ?? getScoreLevel(score),
            score: score,
            totalQuestionsAnswered:
              (d.data().totalQuestionsAnswered as number) ?? 0,
            totalCodingCompleted:
              (d.data().totalCodingCompleted as number) ?? 0,
            overallAccuracy: (d.data().overallAccuracy as number) ?? 0,
            avgTimePerQuestion: (d.data().avgTimePerQuestion as number) ?? 0,
            streak: (d.data().streak as number) ?? 0,
            updatedAt: d.data().updatedAt,
            topCategory: (d.data().topCategory as string) ?? undefined,
            topCategoryTrack:
              (d.data().topCategoryTrack as string) ?? undefined,
            topCategoryAccuracy:
              (d.data().topCategoryAccuracy as number) ?? undefined,
            topCategoryAvgTimeMs:
              (d.data().topCategoryAvgTimeMs as number) ?? undefined,
            topCodingCategory:
              (d.data().topCodingCategory as string) ?? undefined,
            topCodingAccuracy:
              (d.data().topCodingAccuracy as number) ?? undefined,
            topCodingAvgTimeMs:
              (d.data().topCodingAvgTimeMs as number) ?? undefined,
          };
        })
        .filter((user) => user.scoreLevel === level)
        .slice(0, limitCount);
    },
    COMMUNITY_TTL,
  );
}
