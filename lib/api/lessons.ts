import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    where,
} from "firebase/firestore";

import type { InProgressLessonRecord, UserLevel } from "@/lib/api/types";
import { cacheInvalidatePrefix } from "@/lib/cache";
import { db } from "@/lib/firebase";
import { invalidateUserCaches } from "./progress";

// ---------------------------------------------------------------------------
// Lesson ID helpers
// ---------------------------------------------------------------------------

function getInProgressLessonId(track: string, category: string): string {
  return `${track}__${category}`;
}

function getDifficultyAwareLessonId(
  track: string,
  category: string,
  difficulty?: UserLevel,
): string {
  if (!difficulty) return getInProgressLessonId(track, category);
  return `${track}__${category}__${difficulty}`;
}

// ---------------------------------------------------------------------------
// In-progress lessons
// ---------------------------------------------------------------------------

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
    if (!difficulty) return true;
    if (lessonDifficulty === difficulty) return true;
    return difficulty === "Fácil" && lessonDifficulty == null;
  });

  if (!matchingDoc) return null;

  return {
    id: matchingDoc.id,
    ...(matchingDoc.data() as Omit<InProgressLessonRecord, "id">),
  };
}

/** Save/update in-progress lesson under users/{uid}/inProgressLessons/{id}. */
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
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
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
  await addDoc(lessonsRef, { ...data, createdAt: serverTimestamp() });
  void invalidateUserCaches(uid);
  void cacheInvalidatePrefix("community:");
}
