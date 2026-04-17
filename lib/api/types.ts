// ---------------------------------------------------------------------------
// Shared types — used across multiple api modules
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
  extraStats?: {
    incidents: { completed: number; total: number };
    datacenter: { completed: number; total: number };
  };
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
  totalCodingCompleted: number;
  overallAccuracy: number;
  avgTimePerQuestion: number;
  streak: number;
  updatedAt: unknown;
  topCategory?: string;
  topCategoryTrack?: string;
  topCategoryAccuracy?: number;
  topCategoryAvgTimeMs?: number;
  topCodingCategory?: string;
  topCodingAccuracy?: number;
  topCodingAvgTimeMs?: number;
};

/** Progress data stored in users/{uid}/profile - used by community */
export type UserProgressData = {
  level: SummaryLevel;
  scoreLevel: ScoreLevel;
  score: number;
  totalQuestionsAnswered: number;
  totalCodingCompleted: number;
  overallAccuracy: number;
  avgTimePerQuestion: number;
  topCodingCategory?: string;
  topCodingAccuracy?: number;
  topCodingAvgTimeMs?: number;
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

export type ThemeItem = {
  id: string;
  name: string;
  description: string;
};

export type TrackCatalogItem = {
  key: string;
  label: string;
  categories: string[];
  totalCards: number;
};

export type GlossaryEntry = {
  term: string;
  definition: string;
};

export type CodingPracticeResult = {
  exerciseId: string;
  completed: boolean;
  bestTime: number;
  bestMoves: number;
  updatedAt: unknown;
};
export type QuickResponseResult = {
  exerciseId: string;
  completed: boolean;
  attempts: number;
  withinSLA: boolean;
  updatedAt: unknown;
};
