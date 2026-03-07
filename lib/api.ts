import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    documentId,
    getCountFromServer,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
    writeBatch,
} from "firebase/firestore";

import { selectRandomCards, shuffleCardOptions } from "@/data/cards/generator";
import { trackLabels } from "@/data/tracks";
import {
    cacheInvalidatePrefix,
    checkAndInvalidateIfNewVersion,
    COMMUNITY_TTL,
    fetchWithCache,
    STATIC_TTL,
    USER_TTL,
} from "@/lib/cache";
import { db } from "@/lib/firebase";

// ---------------------------------------------------------------------------
// Data version check — invalidates client cache when server data changes
// ---------------------------------------------------------------------------

/**
 * Busca a versão dos dados no Firestore e invalida o cache local se mudou.
 * Deve ser chamado no startup do app (antes de carregar o catálogo).
 */
export async function syncDataVersion(): Promise<boolean> {
  return checkAndInvalidateIfNewVersion(async () => {
    const snap = await getDoc(doc(db, "app_meta", "data_version"));
    if (!snap.exists()) return null;
    return (snap.data().version as string) ?? null;
  });
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UserLevel = "Fácil" | "Médio" | "Difícil";

export const DIFFICULTY_ORDER: UserLevel[] = ["Fácil", "Médio", "Difícil"];

export type DifficultyProgress = {
  difficulty: UserLevel;
  totalCards: number;
  correctCards: number;
  masteryPercent: number;
  unlocked: boolean;
  mastered: boolean;
};

/** A single completed lesson stored under users/{uid}/lessons/{id} */
export type LessonRecord = {
  id: string;
  track?: string;
  category: string;
  difficulty?: UserLevel;
  correctCount: number;
  totalCount: number;
  durationMs: number;
  createdAt: unknown;
};

/** A lesson started but not yet completed under users/{uid}/inProgressLessons/{id} */
export type InProgressLessonRecord = {
  id: string;
  track: string;
  category: string;
  difficulty?: UserLevel;
  answeredCount: number;
  correctCount: number;
  totalCount: number;
  elapsedMs: number;
  updatedAt?: unknown;
};

/** Aggregated stats per category */
export type CategoryProgress = {
  track: string;
  category: string;
  totalLessons: number;
  totalQuestionsAnswered: number;
  uniqueQuestionsAnswered: number;
  studyPercent: number;
  accuracyPercent: number;
  avgTimePerQuestionMs: number;
  inProgressAnswered: number;
  hasInProgressLesson: boolean;
  /** Epoch ms of the most recent lesson in this category */
  lastStudiedAt: number;
};

/** Overall progress summary */
export type ProgressSummary = {
  accuracyPercent: number;
  avgTimeMs: number;
  totalLessons: number;
  totalScore: number;
  streak: number;
  categories: CategoryProgress[];
};

/** User's summary level for display and community ranking */
export type SummaryLevel =
  | "Iniciante"
  | "Intermediário"
  | "Profissional"
  | "Expert";

/** Score level for community ranking - badge system */
export type ScoreLevel = "Bronze" | "Prata" | "Ouro" | "Diamante";

/** User profile for community/ranking */
export type UserProfile = {
  userId: string;
  name: string;
  level: SummaryLevel;
  scoreLevel: ScoreLevel;
  score: number;
  totalQuestionsAnswered: number;
  overallAccuracy: number;
  avgTimePerQuestion: number;
  streak: number;
  updatedAt: unknown;
};

/** Progress data stored in users/{uid}/profile - used by community */
export type UserProgressData = {
  level: SummaryLevel;
  scoreLevel: ScoreLevel;
  score: number;
  totalQuestionsAnswered: number;
  overallAccuracy: number;
  avgTimePerQuestion: number;
  updatedAt: unknown;
};

/** Stats for a specific category for a specific user */
export type CategoryStats = {
  totalCards: number;
  uniqueStudied: number;
  uniqueCorrect: number;
  totalAnswered: number;
  accuracyPercent: number;
  hasInProgressLesson: boolean;
  inProgressAnswered: number;
  dueForReview: number;
  currentDifficulty: UserLevel | null;
  currentDifficultyMasteryPercent: number;
  nextDifficulty: UserLevel | null;
};

/** Histórico individual de um card para o usuário */
export type CardHistory = {
  cardId: string;
  timesShown: number;
  timesCorrect: number;
  timesWrong: number;
  lastSeenAt: unknown;
  /** Consecutive correct answers (reset on wrong). Used for SRS interval. */
  streak: number;
  /** Timestamp for when this card should next be reviewed. */
  nextReviewAt: unknown;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the SRS review interval in milliseconds based on the current
 * consecutive-correct streak.
 *
 * streak 0 → 0 ms        (review again immediately – just got it wrong)
 * streak 1 → 4 hours
 * streak 2 → 1 day
 * streak 3 → 3 days
 * streak 4 → 7 days
 * streak 5 → 14 days
 * streak 6+→ 30 days
 */
function getSrsIntervalMs(streak: number): number {
  const HOUR = 3_600_000;
  const DAY = 86_400_000;
  switch (streak) {
    case 0:
      return 0;
    case 1:
      return 4 * HOUR;
    case 2:
      return 1 * DAY;
    case 3:
      return 3 * DAY;
    case 4:
      return 7 * DAY;
    case 5:
      return 14 * DAY;
    default:
      return 30 * DAY;
  }
}

/**
 * Calcula o nível resumido do usuário baseado em acurácia
 * Iniciante: 0-20%, Intermediário: 21-50%, Profissional: 51-80%, Expert: >80%
 */
export function getSummaryLevel(accuracyPercent: number): SummaryLevel {
  if (accuracyPercent > 80) return "Expert";
  if (accuracyPercent > 50) return "Profissional";
  if (accuracyPercent > 20) return "Intermediário";
  return "Iniciante";
}
/**
 * Calcula o nível de pontuação (medalha) baseado na pontuação total
 * Bronze: 0-500, Prata: 501-1500, Ouro: 1501-3000, Diamante: >3000
 */
export function getScoreLevel(score: number): ScoreLevel {
  if (score > 3000) return "Diamante";
  if (score > 1500) return "Ouro";
  if (score > 500) return "Prata";
  return "Bronze";
}
function getInProgressLessonId(track: string, category: string): string {
  return `${track}__${category}`;
}

function getDifficultyAwareLessonId(
  track: string,
  category: string,
  difficulty?: UserLevel,
): string {
  if (!difficulty) {
    return getInProgressLessonId(track, category);
  }

  return `${track}__${category}__${difficulty}`;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export { formatDuration };

function buildDifficultyProgress(
  cards: Array<{ id: string; difficulty: UserLevel }>,
  history: Map<string, CardHistory>,
): DifficultyProgress[] {
  const progress = DIFFICULTY_ORDER.map((difficulty) => {
    const levelCards = cards.filter((card) => card.difficulty === difficulty);
    const totalCards = levelCards.length;
    const correctCards = levelCards.filter(
      (card) => (history.get(card.id)?.timesCorrect ?? 0) > 0,
    ).length;
    const masteryPercent =
      totalCards > 0 ? Math.round((correctCards / totalCards) * 100) : 0;

    return {
      difficulty,
      totalCards,
      correctCards,
      masteryPercent,
      unlocked: false,
      mastered: totalCards > 0 && correctCards >= totalCards,
    } satisfies DifficultyProgress;
  });

  let previousLevelsMastered = true;

  return progress.map((item) => {
    if (item.totalCards === 0) {
      return item;
    }

    const unlocked = previousLevelsMastered;
    if (!item.mastered) {
      previousLevelsMastered = false;
    }

    return {
      ...item,
      unlocked,
    };
  });
}

function resolveActiveDifficulty(progress: DifficultyProgress[]): {
  activeDifficulty: UserLevel;
  nextDifficulty: UserLevel | null;
} {
  const available = progress.filter((item) => item.totalCards > 0);

  if (available.length === 0) {
    return { activeDifficulty: "Fácil", nextDifficulty: null };
  }

  const current =
    available.find((item) => item.unlocked && !item.mastered) ??
    available[available.length - 1];
  const currentIndex = available.findIndex(
    (item) => item.difficulty === current.difficulty,
  );

  return {
    activeDifficulty: current.difficulty,
    nextDifficulty: available[currentIndex + 1]?.difficulty ?? null,
  };
}

/**
 * Calcula o streak (dias consecutivos) de estudo a partir das lições.
 * Considera "hoje" como parte do streak se houver lição hoje.
 */
function calculateStreak(lessons: LessonRecord[]): number {
  if (lessons.length === 0) return 0;

  // Extrai datas únicas (YYYY-MM-DD) das lições, usando createdAt como Firestore Timestamp
  const uniqueDays = new Set<string>();
  for (const lesson of lessons) {
    const ts = lesson.createdAt as { toDate?: () => Date } | undefined;
    if (!ts || typeof ts.toDate !== "function") continue;
    const d = ts.toDate();
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    uniqueDays.add(key);
  }

  if (uniqueDays.size === 0) return 0;

  // Ordena as datas em ordem decrescente
  const sorted = Array.from(uniqueDays).sort().reverse();

  // Verifica se o dia mais recente é hoje ou ontem (para manter o streak ativo)
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

  if (sorted[0] !== todayStr && sorted[0] !== yesterdayStr) {
    return 0; // streak quebrado
  }

  // Conta dias consecutivos a partir do mais recente
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + "T00:00:00");
    const curr = new Date(sorted[i] + "T00:00:00");
    const diffMs = prev.getTime() - curr.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
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

  if (uniqueCardIds.length === 0) {
    return new Map<string, number>();
  }

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
// Cache invalidation helpers
// ---------------------------------------------------------------------------

/**
 * Invalida todos os caches de progresso de um usuário.
 * Chamada após operações de escrita (salvar lição, atualizar progresso, etc.)
 */
async function invalidateUserCaches(uid: string): Promise<void> {
  await Promise.all([
    cacheInvalidatePrefix(`progress:${uid}`),
    cacheInvalidatePrefix(`catStats:${uid}`),
  ]);
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

  const lessonsQuery = query(lessonsRef, orderBy("createdAt", "desc"));
  const [lessonsSnapshot, inProgressSnapshot] = await Promise.all([
    getDocs(lessonsQuery),
    getDocs(inProgressRef),
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

  if (lessons.length === 0 && inProgressLessons.length === 0) {
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

  const accuracyPercent =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const avgTimeMs =
    lessons.length > 0 ? Math.round(totalDuration / lessons.length) : 0;

  // Calcula o score total usando a mesma fórmula de updateUserProfile
  const avgTimePerQuestion =
    totalQuestions > 0 ? totalDuration / totalQuestions : 0;
  const totalScore = calculateScore(
    totalQuestions,
    accuracyPercent,
    avgTimePerQuestion,
  );

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

  return {
    accuracyPercent,
    avgTimeMs,
    totalLessons: lessons.length,
    totalScore,
    streak: calculateStreak(lessons),
    categories,
  };
}

// ---------------------------------------------------------------------------
// Analyze performance issues (weakest categories)
// ---------------------------------------------------------------------------

export type WeakestSubject = {
  track: string;
  category: string;
  /** Accuracy percentage (0-100) based on individual card history */
  accuracy: number;
  /** Number of unique cards the user has answered in this category */
  uniqueCards: number;
  /** Total times cards were shown (includes repeats) */
  totalAnswered: number;
  /** Total wrong answers */
  totalWrong: number;
};

/**
 * Identifica os assuntos onde o usuário erra mais frequentemente.
 * Usa o cardHistory (card-a-card) para maior precisão.
 * Os IDs dos cards seguem o formato: track__category__difficulty__number
 */
export async function getWeakestSubjects(
  uid: string,
  limit: number = 5,
): Promise<WeakestSubject[]> {
  const histRef = collection(db, "users", uid, "cardHistory");
  const snapshot = await getDocs(histRef);

  // Agrupa por track__category
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
    // ID format: track__category__difficulty__number
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

  // Filtra categorias com pelo menos 3 cards respondidos (amostra mínima),
  // acurácia <= 80% (exclui categorias já dominadas) e ordena pela menor acurácia
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
// Themes
// ---------------------------------------------------------------------------

export type ThemeItem = {
  id: string;
  name: string;
  description: string;
};

export async function fetchThemes(): Promise<ThemeItem[]> {
  return fetchWithCache(
    "themes",
    async () => {
      const themesRef = collection(db, "themes");
      const q = query(themesRef, orderBy("name", "asc"));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((d) => ({
        id: d.id,
        name: (d.data().name as string) ?? "",
        description: (d.data().description as string) ?? "",
      }));
    },
    STATIC_TTL,
  );
}

// ---------------------------------------------------------------------------
// Card counts (Firestore-based)
// ---------------------------------------------------------------------------

/**
 * Retorna o total de cards de uma categoria (todas as dificuldades).
 * Usa getCountFromServer para evitar baixar todos os documentos.
 */
export async function getTotalCardsForCategory(
  track: string,
  category: string,
): Promise<number> {
  return fetchWithCache(
    `cardCount:${track}:${category}`,
    async () => {
      const cardsRef = collection(db, "cards");
      const q = query(
        cardsRef,
        where("track", "==", track),
        where("category", "==", category),
      );
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    },
    STATIC_TTL,
  );
}

/**
 * Retorna estatísticas gerais do banco de cards no Firestore.
 */
export async function getDatabaseStats(): Promise<{
  totalCards: number;
  activeTracks: number;
}> {
  return fetchWithCache(
    "dbStats",
    async () => {
      const cardsRef = collection(db, "cards");

      // Total de cards (eficiente — não baixa documentos)
      const countSnapshot = await getCountFromServer(query(cardsRef));
      const totalCards = countSnapshot.data().count;

      const catalog = await getTrackCatalog();
      const activeTracks = catalog.length;

      return { totalCards, activeTracks };
    },
    STATIC_TTL,
  );
}

export type TrackCatalogItem = {
  key: string;
  label: string;
  categories: string[];
  totalCards: number;
};

function humanizeTrackLabel(track: string): string {
  return track
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function resolveTrackLabel(track: string): string {
  return trackLabels[track] ?? humanizeTrackLabel(track);
}

export async function getTrackCatalog(): Promise<TrackCatalogItem[]> {
  return fetchWithCache(
    "catalog",
    async () => {
      const cardsRef = collection(db, "cards");
      const snapshot = await getDocs(cardsRef);

      const grouped = new Map<
        string,
        {
          categories: Set<string>;
          totalCards: number;
        }
      >();

      for (const d of snapshot.docs) {
        const data = d.data();
        const track = (data.track as string | undefined)?.trim();
        const category = (data.category as string | undefined)?.trim();
        if (!track) continue;

        const entry = grouped.get(track);
        if (entry) {
          if (category) entry.categories.add(category);
          entry.totalCards += 1;
        } else {
          grouped.set(track, {
            categories: new Set(category ? [category] : []),
            totalCards: 1,
          });
        }
      }

      return Array.from(grouped.entries())
        .map(([key, value]) => ({
          key,
          label: resolveTrackLabel(key),
          categories: Array.from(value.categories).sort((a, b) =>
            a.localeCompare(b, "pt-BR"),
          ),
          totalCards: value.totalCards,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
    },
    STATIC_TTL,
  );
}

export async function getCategoriesForTrack(track: string): Promise<string[]> {
  // Tenta obter categorias do catálogo em cache (evita query separada)
  return fetchWithCache(
    `categories:${track}`,
    async () => {
      // Tenta extrair do catálogo já cacheado primeiro
      try {
        const catalog = await getTrackCatalog();
        const trackEntry = catalog.find((t) => t.key === track);
        if (trackEntry && trackEntry.categories.length > 0) {
          return trackEntry.categories;
        }
      } catch {
        // Fallback para query direta
      }

      const cardsRef = collection(db, "cards");
      const q = query(cardsRef, where("track", "==", track));
      const snapshot = await getDocs(q);
      const categories = new Set<string>();

      for (const d of snapshot.docs) {
        const category = (d.data().category as string | undefined)?.trim();
        if (category) categories.add(category);
      }

      return Array.from(categories).sort((a, b) => a.localeCompare(b, "pt-BR"));
    },
    STATIC_TTL,
  );
}

// ---------------------------------------------------------------------------
// Flashcards (exercise cards)
// ---------------------------------------------------------------------------

export type Flashcard = {
  id: string;
  track: string;
  category: string;
  difficulty: UserLevel;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  example: string;
};

export type StudyDeck = {
  cards: Flashcard[];
  activeDifficulty: UserLevel;
  nextDifficulty: UserLevel | null;
  progressByDifficulty: DifficultyProgress[];
  supplementalDifficulties: UserLevel[];
};

/** Quantidade de cards por lição */
const CARDS_PER_LESSON = 10;

/**
 * Busca o histórico de cards do usuário para uma lista de card IDs.
 */
export async function fetchCardHistory(
  uid: string,
  cardIds: string[],
): Promise<Map<string, CardHistory>> {
  const result = new Map<string, CardHistory>();
  if (cardIds.length === 0) return result;

  // Firestore 'in' aceita no máximo 30 valores por query
  const chunks: string[][] = [];
  for (let i = 0; i < cardIds.length; i += 30) {
    chunks.push(cardIds.slice(i, i + 30));
  }

  const histRef = collection(db, "users", uid, "cardHistory");

  for (const chunk of chunks) {
    const q = query(histRef, where("cardId", "in", chunk));
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      const data = d.data() as CardHistory;
      result.set(data.cardId, data);
    }
  }

  return result;
}

/**
 * Salva o resultado de um card individual no histórico do usuário.
 * Atualiza contadores e campos de repetição espaçada (SRS).
 *
 * - Acertou → streak++, nextReviewAt = now + intervalo crescente
 * - Errou   → streak=0, nextReviewAt = now (volta logo)
 */
export async function saveCardResult(
  uid: string,
  cardId: string,
  correct: boolean,
): Promise<void> {
  const histRef = doc(db, "users", uid, "cardHistory", cardId);

  const histCollection = collection(db, "users", uid, "cardHistory");
  const q = query(histCollection, where("cardId", "==", cardId));
  const snap = await getDocs(q);

  const now = Date.now();

  if (snap.empty) {
    const newStreak = correct ? 1 : 0;
    await setDoc(histRef, {
      cardId,
      timesShown: 1,
      timesCorrect: correct ? 1 : 0,
      timesWrong: correct ? 0 : 1,
      streak: newStreak,
      nextReviewAt: new Date(now + getSrsIntervalMs(newStreak)),
      lastSeenAt: serverTimestamp(),
    });
  } else {
    const existing = snap.docs[0].data() as CardHistory;
    const newStreak = correct ? (existing.streak ?? 0) + 1 : 0;
    await setDoc(snap.docs[0].ref, {
      cardId,
      timesShown: (existing.timesShown ?? 0) + 1,
      timesCorrect: (existing.timesCorrect ?? 0) + (correct ? 1 : 0),
      timesWrong: (existing.timesWrong ?? 0) + (correct ? 0 : 1),
      streak: newStreak,
      nextReviewAt: new Date(now + getSrsIntervalMs(newStreak)),
      lastSeenAt: serverTimestamp(),
    });
  }
}

/**
 * Seleção inteligente de cards com base em Repetição Espaçada (SRS)
 * e rotação máxima para evitar repetição.
 *
 * Prioridade de preenchimento dos {@link limit} slots:
 * 1. Cards VENCIDOS no SRS (nextReviewAt <= agora) — mais antigos primeiro
 * 2. Cards NUNCA VISTOS — embaralhados aleatoriamente
 * 3. Cards já vistos MAS ERRADOS (taxa de erro > 0) — menor streak primeiro
 * 4. Cards já vistos e corretos — menos vezes vistos primeiro (rotação)
 *
 * Ao final, a lista selecionada é embaralhada para que a ordem de
 * apresentação não revele a lógica interna.
 */
function srsSelectCards(
  cards: Flashcard[],
  history: Map<string, CardHistory>,
  limit: number,
): Flashcard[] {
  // Função auxiliar para embaralhar in-place (Fisher-Yates)
  function shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  if (cards.length <= limit) return shuffle([...cards]);

  const now = Date.now();

  // Classifica cada card em um bucket
  const due: { card: Flashcard; reviewAt: number }[] = [];
  const never: Flashcard[] = [];
  const seenWithErrors: {
    card: Flashcard;
    streak: number;
    timesShown: number;
  }[] = [];
  const seenCorrect: { card: Flashcard; timesShown: number }[] = [];

  for (const card of cards) {
    const hist = history.get(card.id);

    if (!hist) {
      never.push(card);
      continue;
    }

    const reviewAt =
      hist.nextReviewAt instanceof Date
        ? hist.nextReviewAt.getTime()
        : typeof hist.nextReviewAt === "object" &&
            hist.nextReviewAt !== null &&
            "toMillis" in hist.nextReviewAt
          ? (hist.nextReviewAt as { toMillis(): number }).toMillis()
          : typeof hist.nextReviewAt === "number"
            ? hist.nextReviewAt
            : 0;

    if (reviewAt <= now) {
      // Card vencido no SRS — precisa ser revisado
      due.push({ card, reviewAt });
    } else if ((hist.timesWrong ?? 0) > 0) {
      // Já errou pelo menos 1 vez — foco em reforço
      seenWithErrors.push({
        card,
        streak: hist.streak ?? 0,
        timesShown: hist.timesShown ?? 0,
      });
    } else {
      // Só acertou — rotação por menos visto
      seenCorrect.push({ card, timesShown: hist.timesShown ?? 0 });
    }
  }

  // Ordena cada bucket pela prioridade interna
  due.sort((a, b) => a.reviewAt - b.reviewAt); // mais antigo primeiro
  shuffle(never); // aleatoriza novos
  seenWithErrors.sort(
    (a, b) => a.streak - b.streak || a.timesShown - b.timesShown,
  ); // menor streak / menos visto
  seenCorrect.sort((a, b) => a.timesShown - b.timesShown); // menos visto primeiro

  const selected: Flashcard[] = [];

  // Preenche na ordem de prioridade
  for (const d of due) {
    if (selected.length >= limit) break;
    selected.push(d.card);
  }
  for (const card of never) {
    if (selected.length >= limit) break;
    selected.push(card);
  }
  for (const s of seenWithErrors) {
    if (selected.length >= limit) break;
    selected.push(s.card);
  }
  for (const s of seenCorrect) {
    if (selected.length >= limit) break;
    selected.push(s.card);
  }

  // Embaralha o resultado final para não revelar a lógica de seleção
  return shuffle(selected);
}

function selectStudyDeckCards(
  allCards: Flashcard[],
  history: Map<string, CardHistory>,
  activeDifficulty: UserLevel,
  limit: number,
  useSrs: boolean,
): {
  cards: Flashcard[];
  supplementalDifficulties: UserLevel[];
} {
  const selectedCards: Flashcard[] = [];
  const supplementalDifficulties: UserLevel[] = [];
  const startIndex = Math.max(0, DIFFICULTY_ORDER.indexOf(activeDifficulty));

  for (const difficulty of DIFFICULTY_ORDER.slice(startIndex)) {
    const remaining = limit - selectedCards.length;
    if (remaining <= 0) {
      break;
    }

    const cardsForDifficulty = allCards.filter(
      (card) => card.difficulty === difficulty,
    );
    if (cardsForDifficulty.length === 0) {
      continue;
    }

    const shouldUseSrsForDifficulty = useSrs && difficulty === activeDifficulty;

    const chosenCards = shouldUseSrsForDifficulty
      ? srsSelectCards(cardsForDifficulty, history, remaining)
      : selectRandomCards(cardsForDifficulty, remaining);

    if (chosenCards.length === 0) {
      continue;
    }

    selectedCards.push(...chosenCards);

    if (difficulty !== activeDifficulty) {
      supplementalDifficulties.push(difficulty);
    }
  }

  return {
    cards: selectRandomCards(selectedCards, selectedCards.length),
    supplementalDifficulties,
  };
}

/**
 * Busca cards para uma sessão de estudo usando seleção SRS.
 * Busca TODOS os cards da categoria (sem filtro de dificuldade).
 */
export async function fetchCards(
  track: string,
  category: string,
  uid?: string,
): Promise<StudyDeck> {
  const cardsRef = collection(db, "cards");
  const q = query(
    cardsRef,
    where("track", "==", track),
    where("category", "==", category),
  );

  const snapshot = await getDocs(q);

  const allCards: Flashcard[] = snapshot.docs.map((d) => {
    const data = d.data();
    const card: Flashcard = {
      id: d.id,
      track: data.track as string,
      category: data.category as string,
      difficulty: (data.difficulty as UserLevel) ?? "Fácil",
      question: data.question as string,
      options: data.options as [string, string, string, string],
      correctIndex: data.correctIndex as number,
      explanation: (data.explanation as string) ?? "",
      example: (data.example as string) ?? "",
    };
    return shuffleCardOptions(card);
  });

  const history =
    uid && allCards.length > 0
      ? await fetchCardHistory(
          uid,
          allCards.map((card) => card.id),
        )
      : new Map<string, CardHistory>();

  const progressByDifficulty = buildDifficultyProgress(allCards, history);
  const { activeDifficulty, nextDifficulty } =
    resolveActiveDifficulty(progressByDifficulty);
  const { cards: selectedCards, supplementalDifficulties } =
    selectStudyDeckCards(
      allCards,
      history,
      activeDifficulty,
      CARDS_PER_LESSON,
      Boolean(uid),
    );

  return {
    cards: selectedCards,
    activeDifficulty,
    nextDifficulty,
    progressByDifficulty,
    supplementalDifficulties,
  };
}

const MASTER_TEST_COUNT = 20;

/**
 * Busca cards aleatórios de todo o track para o Teste Master.
 */
export async function fetchMasterTestCards(
  track: string,
): Promise<Flashcard[]> {
  const cardsRef = collection(db, "cards");
  const q = query(cardsRef, where("track", "==", track));
  const snapshot = await getDocs(q);

  const allCards: Flashcard[] = snapshot.docs.map((d) => {
    const data = d.data();
    const card: Flashcard = {
      id: d.id,
      track: data.track as string,
      category: data.category as string,
      difficulty: (data.difficulty as UserLevel) ?? "Fácil",
      question: data.question as string,
      options: data.options as [string, string, string, string],
      correctIndex: data.correctIndex as number,
      explanation: (data.explanation as string) ?? "",
      example: (data.example as string) ?? "",
    };
    return shuffleCardOptions(card);
  });

  return selectRandomCards(allCards, MASTER_TEST_COUNT);
}

/**
 * Busca estatísticas simplificadas de uma categoria para o usuário.
 * Sem separação por dificuldade — visão unificada com dados SRS.
 */
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

  // Contadores de lições
  let totalAnswered = 0;
  for (const d of lessonsSnap.docs) {
    const data = d.data();
    totalAnswered += (data.totalCount as number) ?? 0;
  }

  // In-progress
  let inProgressAnswered = 0;
  let hasInProgressLesson = false;
  for (const d of inProgressSnap.docs) {
    const data = d.data();
    const answered = (data.answeredCount as number) ?? 0;
    inProgressAnswered += answered;
    if (answered > 0) hasInProgressLesson = true;
  }
  totalAnswered += inProgressAnswered;

  // cardHistory: unique studied, unique correct, due for review
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

export async function fetchInProgressLesson(
  uid: string,
  track: string,
  category: string,
  difficulty?: UserLevel,
): Promise<InProgressLessonRecord | null> {
  const inProgressRef = collection(db, "users", uid, "inProgressLessons");
  const inProgressQuery = query(
    inProgressRef,
    where("track", "==", track),
    where("category", "==", category),
  );
  const snapshot = await getDocs(inProgressQuery);
  if (snapshot.empty) return null;

  const matchingDoc = snapshot.docs.find((lessonDoc) => {
    const lessonDifficulty = lessonDoc.data().difficulty as
      | UserLevel
      | undefined;

    if (!difficulty) {
      return true;
    }

    if (lessonDifficulty === difficulty) {
      return true;
    }

    return difficulty === "Fácil" && lessonDifficulty == null;
  });

  if (!matchingDoc) return null;

  return {
    id: matchingDoc.id,
    ...(matchingDoc.data() as Omit<InProgressLessonRecord, "id">),
  };
}

/** Save/update in-progress lesson under users/{uid}/inProgressLessons/{track__category}. */
export async function upsertInProgressLesson(
  uid: string,
  data: {
    track: string;
    category: string;
    difficulty: UserLevel;
    answeredCount: number;
    correctCount: number;
    totalCount: number;
    elapsedMs: number;
  },
): Promise<void> {
  const lessonId = getDifficultyAwareLessonId(
    data.track,
    data.category,
    data.difficulty,
  );
  const lessonRef = doc(db, "users", uid, "inProgressLessons", lessonId);
  await setDoc(
    lessonRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  // Invalida caches de progresso do usuário
  void invalidateUserCaches(uid);
}

/** Clear in-progress lesson when user completes it. */
export async function clearInProgressLesson(
  uid: string,
  data: {
    track: string;
    category: string;
    difficulty?: UserLevel;
  },
): Promise<void> {
  const lessonId = getDifficultyAwareLessonId(
    data.track,
    data.category,
    data.difficulty,
  );
  const lessonRef = doc(db, "users", uid, "inProgressLessons", lessonId);
  await deleteDoc(lessonRef);

  if (data.difficulty === "Fácil") {
    const legacyLessonRef = doc(
      db,
      "users",
      uid,
      "inProgressLessons",
      getInProgressLessonId(data.track, data.category),
    );
    await deleteDoc(legacyLessonRef).catch(() => undefined);
  }

  // Invalida caches de progresso do usuário
  void invalidateUserCaches(uid);
}

/** Save a completed lesson under users/{uid}/lessons. */
export async function saveLesson(
  uid: string,
  data: {
    category: string;
    track: string;
    difficulty?: UserLevel;
    correctCount: number;
    totalCount: number;
    durationMs: number;
  },
): Promise<void> {
  const lessonsRef = collection(db, "users", uid, "lessons");
  await addDoc(lessonsRef, {
    ...data,
    createdAt: serverTimestamp(),
  });

  // Invalida caches de progresso do usuário e comunidade
  void invalidateUserCaches(uid);
  void cacheInvalidatePrefix("community:");
}

/** Reset all user progress by deleting lessons and in-progress lessons. */
export async function resetUserProgress(uid: string): Promise<void> {
  // Helper to delete all docs in a collection respecting batch limit of 500
  async function deleteCollection(
    colRef: ReturnType<typeof collection>,
  ): Promise<void> {
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return;

    const docs = snapshot.docs;
    for (let i = 0; i < docs.length; i += 500) {
      const chunk = docs.slice(i, i + 500);
      const batch = writeBatch(db);
      for (const d of chunk) {
        batch.delete(d.ref);
      }
      await batch.commit();
    }
  }

  // Delete all lessons
  const lessonsRef = collection(db, "users", uid, "lessons");
  await deleteCollection(lessonsRef);

  // Delete all in-progress lessons
  const inProgressRef = collection(db, "users", uid, "inProgressLessons");
  await deleteCollection(inProgressRef);

  // Delete all card history (unique studied/correct tracking)
  const cardHistoryRef = collection(db, "users", uid, "cardHistory");
  await deleteCollection(cardHistoryRef);

  // Delete progress data
  try {
    const progressRef = doc(db, "users", uid, "progressData", "current");
    await deleteDoc(progressRef);
  } catch {
    // May not exist
  }

  // Reset community profile (separate call since document may not exist)
  try {
    const communityRef = doc(db, "community", uid);
    await setDoc(
      communityRef,
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
    // Don't throw - the main reset already succeeded
  }

  // Invalida todos os caches do usuário e comunidade
  void invalidateUserCaches(uid);
  void cacheInvalidatePrefix("community:");
}

// ---------------------------------------------------------------------------
// Community & Scoring
// ---------------------------------------------------------------------------

/**
 * Calcula a pontuação do usuário baseado em:
 * - Quantidade de questões respondidas
 * - Taxa de acerto
 * - Tempo por questão (quanto mais rápido, melhor)
 */
export function calculateScore(
  totalQuestions: number,
  accuracyPercent: number,
  avgTimePerQuestionMs: number,
): number {
  // Base score: 1 ponto por questão respondida
  const baseScore = totalQuestions;

  // Bonus de acurácia: até 50% extra baseado em taxa de acerto
  const accuracyBonus = baseScore * (accuracyPercent / 100) * 0.5;

  // Bonus de velocidade: até 25% extra (quanto mais rápido, melhor)
  // Considera 20 segundos como tempo "ideal" (20000ms)
  const speedFactor = Math.max(0, 1 - avgTimePerQuestionMs / 20000);
  const speedBonus = baseScore * speedFactor * 0.25;

  const totalScore = baseScore + accuracyBonus + speedBonus;
  return Math.round(totalScore);
}

/**
 * Salva os dados de progresso do usuário em users/{uid}/progressData/current
 */
async function saveProgressData(
  uid: string,
  level: SummaryLevel,
  scoreLevel: ScoreLevel,
  score: number,
  totalQuestionsAnswered: number,
  overallAccuracy: number,
  avgTimePerQuestion: number,
): Promise<void> {
  const progressRef = doc(db, "users", uid, "progressData", "current");
  await setDoc(progressRef, {
    level,
    scoreLevel,
    score,
    totalQuestionsAnswered,
    overallAccuracy,
    avgTimePerQuestion,
    updatedAt: serverTimestamp(),
  } as UserProgressData);
}

/**
 * Atualiza o perfil público do usuário após uma lição completada
 */
export async function updateUserProfile(
  uid: string,
  userName: string,
): Promise<void> {
  console.log("[updateUserProfile] Iniciando para uid:", uid);

  // Busca todas as lições do usuário para calcular o total de questões
  const lessonsRef = collection(db, "users", uid, "lessons");
  const lessonsSnapshot = await getDocs(lessonsRef);

  let totalCorrect = 0;
  let totalQuestions = 0;
  let totalDuration = 0;

  lessonsSnapshot.docs.forEach((doc) => {
    const data = doc.data() as LessonRecord;
    totalCorrect += data.correctCount;
    totalQuestions += data.totalCount;
    totalDuration += data.durationMs;
  });

  console.log(
    "[updateUserProfile] Total questões:",
    totalQuestions,
    "Total corretas:",
    totalCorrect,
  );

  // Calcula a pontuação
  const avgTimePerQuestion =
    totalQuestions > 0 ? totalDuration / totalQuestions : 0;
  const accuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const score = calculateScore(totalQuestions, accuracy, avgTimePerQuestion);
  const summaryLevel = getSummaryLevel(accuracy);
  const scoreLevel = getScoreLevel(score);

  console.log(
    "[updateUserProfile] Score:",
    score,
    "Level:",
    summaryLevel,
    "ScoreLevel:",
    scoreLevel,
  );

  // Calcula o streak de dias consecutivos
  const lessonsForStreak: LessonRecord[] = lessonsSnapshot.docs.map(
    (d) =>
      ({
        id: d.id,
        ...d.data(),
      }) as LessonRecord,
  );
  const streak = calculateStreak(lessonsForStreak);

  // Salva os dados de progresso em users/{uid}/progressData/current
  await saveProgressData(
    uid,
    summaryLevel,
    scoreLevel,
    score,
    totalQuestions,
    accuracy,
    avgTimePerQuestion,
  );

  console.log("[updateUserProfile] Dados de progresso salvos");

  // Atualiza o documento de perfil em community/{uid}
  const profileRef = doc(db, "community", uid);
  await setDoc(profileRef, {
    userId: uid,
    name: userName,
    level: summaryLevel,
    scoreLevel: scoreLevel,
    score: score,
    totalQuestionsAnswered: totalQuestions,
    overallAccuracy: accuracy,
    avgTimePerQuestion: avgTimePerQuestion,
    streak: streak,
    updatedAt: serverTimestamp(),
  });

  console.log("[updateUserProfile] Perfil da comunidade atualizado");

  // Invalida caches do usuário e comunidade
  void invalidateUserCaches(uid);
  void cacheInvalidatePrefix("community:");
}

/**
 * Garante que o usuário tem um perfil na comunidade, mesmo sem lições completadas
 */
export async function ensureUserProfile(
  uid: string,
  userName: string,
): Promise<void> {
  console.log("[ensureUserProfile] Verificando perfil para uid:", uid);
  const profileRef = doc(db, "community", uid);

  // Usa setDoc com merge para criar ou atualizar apenas o nome se já existir
  await setDoc(
    profileRef,
    {
      userId: uid,
      name: userName,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  console.log("[ensureUserProfile] Perfil garantido para:", userName);
}

/**
 * Busca todos os usuários ordenados pela pontuação (decrescente)
 */
export async function fetchUsersByLevel(
  level: ScoreLevel,
  limitCount: number = 50,
): Promise<UserProfile[]> {
  return fetchWithCache(
    `community:${level}:${limitCount}`,
    async () => {
      const communityRef = collection(db, "community");
      // Busca todos os usuários ordenados por score (não filtra por level para evitar índice composto)
      const q = query(communityRef, orderBy("score", "desc"));

      const snapshot = await getDocs(q);

      // Filtra por nível de medalha localmente e limita o resultado
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
            overallAccuracy: (d.data().overallAccuracy as number) ?? 0,
            avgTimePerQuestion: (d.data().avgTimePerQuestion as number) ?? 0,
            streak: (d.data().streak as number) ?? 0,
            updatedAt: d.data().updatedAt,
          };
        })
        .filter((user) => user.scoreLevel === level)
        .slice(0, limitCount);
    },
    COMMUNITY_TTL,
  );
}
