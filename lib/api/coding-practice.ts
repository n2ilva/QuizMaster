import { collection, doc, getDocs, serverTimestamp, setDoc, query, where, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { invalidateUserCaches } from './progress';
import { updateUserProfile } from './community';
import type { CodingPracticeResult } from './types';
import type { Exercise } from '@/app/(features)/coding-practice/coding-practice.types';
export async function fetchCodingPracticeProgress(uid: string): Promise<Record<string, { completed: boolean; bestTime: number; bestMoves?: number }>> {
  const colRef = collection(db, 'users', uid, 'codingPracticeResults');
  const snapshot = await getDocs(colRef);
  
  const results: Record<string, { completed: boolean; bestTime: number; bestMoves?: number }> = {};
  snapshot.docs.forEach(d => {
    const data = d.data();
    results[d.id] = {
      completed: data.completed,
      bestTime: data.bestTime,
      bestMoves: data.bestMoves,
    };
  });
  
  return results;
}

export async function saveCodingPracticeResult(uid: string, exerciseId: string, timeSeconds: number, moves: number): Promise<void> {
  const docRef = doc(db, 'users', uid, 'codingPracticeResults', exerciseId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const existing = docSnap.data();
    const newBestTime = Math.min(existing.bestTime ?? Infinity, timeSeconds);
    const newBestMoves = Math.min(existing.bestMoves ?? Infinity, moves);
    
    if (timeSeconds < (existing.bestTime ?? Infinity) || moves < (existing.bestMoves ?? Infinity) || !existing.completed) {
      await setDoc(docRef, {
        exerciseId,
        completed: true,
        bestTime: newBestTime,
        bestMoves: newBestMoves,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
  } else {
    await setDoc(docRef, {
      exerciseId,
      completed: true,
      bestTime: timeSeconds,
      bestMoves: moves,
      updatedAt: serverTimestamp(),
    });
  }
  
  await invalidateUserCaches(uid);
  await updateUserProfile(uid);
}

export async function fetchCodingExercises(): Promise<Exercise[]> {
  const colRef = collection(db, 'coding_exercises');
  const snapshot = await getDocs(colRef);
  
  const exercises: Exercise[] = [];
  snapshot.docs.forEach(d => {
    const data = d.data() as Exercise;
    exercises.push(data);
  });
  
  return exercises;
}
