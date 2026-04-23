import { collection, doc, getDocs, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { invalidateUserCaches } from './progress';
import { updateUserProfile } from './community';

/**
 * Busca o catálogo completo do Ache o Erro no Firestore.
 *
 * O documento `ache_o_erro_catalog/main` contém todas as linguagens
 * consolidadas pelo script upload-ache-o-erro-to-firestore.ts:
 *   { version, updatedAt, languages: { javascript, java, python, csharp } }
 */
export async function fetchAcheOErroCatalog(): Promise<Record<string, unknown> | null> {
  const docRef = doc(db, 'ache_o_erro_catalog', 'main');
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  const data = snap.data() as Record<string, unknown>;
  // Remove metadado de upload
  const { updatedAt: _updatedAt, ...rest } = data;
  return rest;
}

export type AcheOErroProgressEntry = {
  completed: boolean;
  bestTime: number;   // seconds
  bestMoves: number;
  language: string;
  level: string;
};

/**
 * Fetch all Ache o Erro results for a given user from Firestore.
 */
export async function fetchAcheOErroProgress(
  uid: string,
): Promise<Record<string, AcheOErroProgressEntry>> {
  const colRef = collection(db, 'users', uid, 'acheOErroResults');
  const snapshot = await getDocs(colRef);

  const results: Record<string, AcheOErroProgressEntry> = {};
  snapshot.docs.forEach((d) => {
    const data = d.data();
    results[d.id] = {
      completed: data.completed ?? false,
      bestTime: data.bestTime ?? 0,
      bestMoves: data.bestMoves ?? 0,
      language: data.language ?? '',
      level: data.level ?? '',
    };
  });

  return results;
}

/**
 * Save a completed Ache o Erro result.
 * Always persists the best time and best move count for each exercise.
 */
export async function saveAcheOErroResult(
  uid: string,
  exerciseId: string,
  timeSeconds: number,
  moves: number,
  language: string,
  level: string,
): Promise<void> {
  const docRef = doc(db, 'users', uid, 'acheOErroResults', exerciseId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const existing = docSnap.data();
    const newBestTime = Math.min(existing.bestTime ?? Infinity, timeSeconds);
    const newBestMoves = Math.min(existing.bestMoves ?? Infinity, moves);

    if (
      timeSeconds < (existing.bestTime ?? Infinity) ||
      moves < (existing.bestMoves ?? Infinity) ||
      !existing.completed
    ) {
      await setDoc(
        docRef,
        {
          exerciseId,
          completed: true,
          bestTime: newBestTime,
          bestMoves: newBestMoves,
          language,
          level,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    }
  } else {
    await setDoc(docRef, {
      exerciseId,
      completed: true,
      bestTime: timeSeconds,
      bestMoves: moves,
      language,
      level,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  await invalidateUserCaches(uid);
  await updateUserProfile(uid);
}
