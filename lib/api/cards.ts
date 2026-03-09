import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    where,
} from "firebase/firestore";

import { selectRandomCards, shuffleCardOptions } from "@/data/cards/generator";
import type {
    CardHistory,
    DifficultyProgress,
    Flashcard,
    StudyDeck,
    UserLevel,
} from "@/lib/api/types";
import { DIFFICULTY_ORDER } from "@/lib/api/types";
import { db } from "@/lib/firebase";

// ---------------------------------------------------------------------------
// SRS helpers
// ---------------------------------------------------------------------------

/**
 * Retorna o intervalo SRS em ms baseado no streak de acertos consecutivos.
 * streak 0 = 0ms, 1 = 4h, 2 = 1d, 3 = 3d, 4 = 7d, 5 = 14d, 6+ = 30d
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

export function buildDifficultyProgress(
  cards: { id: string; difficulty: UserLevel }[],
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
    if (item.totalCards === 0) return item;
    const unlocked = previousLevelsMastered;
    if (!item.mastered) previousLevelsMastered = false;
    return { ...item, unlocked };
  });
}

export function resolveActiveDifficulty(progress: DifficultyProgress[]): {
  activeDifficulty: UserLevel;
  nextDifficulty: UserLevel | null;
} {
  const available = progress.filter((item) => item.totalCards > 0);

  if (available.length === 0) {
    return { activeDifficulty: "F\u00e1cil", nextDifficulty: null };
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

const CARDS_PER_LESSON = 10;

// ---------------------------------------------------------------------------
// Card history
// ---------------------------------------------------------------------------

export async function fetchCardHistory(
  uid: string,
  cardIds: string[],
): Promise<Map<string, CardHistory>> {
  const result = new Map<string, CardHistory>();
  if (cardIds.length === 0) return result;

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

export async function saveCardResult(
  uid: string,
  cardId: string,
  correct: boolean,
): Promise<void> {
  const histRef = doc(db, "users", uid, "cardHistory", cardId);
  const snap = await getDoc(histRef);
  const now = Date.now();

  if (!snap.exists()) {
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
    const existing = snap.data() as CardHistory;
    const newStreak = correct ? (existing.streak ?? 0) + 1 : 0;
    await setDoc(histRef, {
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

// ---------------------------------------------------------------------------
// SRS card selection
// ---------------------------------------------------------------------------

function srsSelectCards(
  cards: Flashcard[],
  history: Map<string, CardHistory>,
  limit: number,
): Flashcard[] {
  function shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  if (cards.length <= limit) return shuffle([...cards]);

  const now = Date.now();
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
      due.push({ card, reviewAt });
    } else if ((hist.timesWrong ?? 0) > 0) {
      seenWithErrors.push({
        card,
        streak: hist.streak ?? 0,
        timesShown: hist.timesShown ?? 0,
      });
    } else {
      seenCorrect.push({ card, timesShown: hist.timesShown ?? 0 });
    }
  }

  due.sort((a, b) => a.reviewAt - b.reviewAt);
  shuffle(never);
  seenWithErrors.sort(
    (a, b) => a.streak - b.streak || a.timesShown - b.timesShown,
  );
  seenCorrect.sort((a, b) => a.timesShown - b.timesShown);

  const selected: Flashcard[] = [];
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

  return shuffle(selected);
}

function selectStudyDeckCards(
  allCards: Flashcard[],
  history: Map<string, CardHistory>,
  activeDifficulty: UserLevel,
  limit: number,
  useSrs: boolean,
): { cards: Flashcard[]; supplementalDifficulties: UserLevel[] } {
  const selectedCards: Flashcard[] = [];
  const supplementalDifficulties: UserLevel[] = [];
  const startIndex = Math.max(0, DIFFICULTY_ORDER.indexOf(activeDifficulty));

  for (const difficulty of DIFFICULTY_ORDER.slice(startIndex)) {
    const remaining = limit - selectedCards.length;
    if (remaining <= 0) break;

    const cardsForDifficulty = allCards.filter(
      (card) => card.difficulty === difficulty,
    );
    if (cardsForDifficulty.length === 0) continue;

    const shouldUseSrsForDifficulty = useSrs && difficulty === activeDifficulty;
    const chosenCards = shouldUseSrsForDifficulty
      ? srsSelectCards(cardsForDifficulty, history, remaining)
      : selectRandomCards(cardsForDifficulty, remaining);

    if (chosenCards.length === 0) continue;
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

// ---------------------------------------------------------------------------
// Fetch cards for study session
// ---------------------------------------------------------------------------

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
      difficulty: (data.difficulty as UserLevel) ?? "F\u00e1cil",
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
      difficulty: (data.difficulty as UserLevel) ?? "F\u00e1cil",
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
