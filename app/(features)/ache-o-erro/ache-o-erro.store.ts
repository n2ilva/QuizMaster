import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAcheOErroProgress, saveAcheOErroResult } from '@/lib/api/ache-o-erro';
import { DebugExercise, Level } from './ache-o-erro.types';

const STORAGE_KEY = 'debug-practice-progress';

export type ExerciseProgress = {
  completed: boolean;
  bestTime: number; // in seconds
  bestMoves: number;
  language: string;
  level: string;
};

export type GlobalProgress = Record<string, ExerciseProgress>;

/**
 * Converte o catálogo bruto vindo do Firestore (ache_o_erro_catalog/main)
 * para uma lista plana de DebugExercise — o mesmo formato que a screen consome.
 *
 * Estrutura do catálogo Firestore:
 *   { version, languages: { javascript: { javascript: { levels: { junior: { questions: [...] } } } } } }
 *
 * A chave duplicada (ex: languages.javascript.javascript) existe porque cada
 * JSON local tem a linguagem como chave raiz. O script de upload manteve essa
 * estrutura para não precisar alterar os JSONs.
 */
export function parseCatalogToExercises(
  catalog: Record<string, unknown> | null,
): DebugExercise[] {
  if (!catalog) return [];

  const exercises: DebugExercise[] = [];
  const languages = catalog.languages as Record<string, unknown> | undefined;
  if (!languages) return [];

  const LANG_KEYS: { outerKey: string; innerKey: string }[] = [
    { outerKey: 'javascript', innerKey: 'javascript' },
    { outerKey: 'java',       innerKey: 'java' },
    { outerKey: 'python',     innerKey: 'python' },
    { outerKey: 'csharp',     innerKey: 'csharp' },
    { outerKey: 'sql',        innerKey: 'sql' },
  ];

  for (const { outerKey, innerKey } of LANG_KEYS) {
    const outerData = languages[outerKey] as Record<string, unknown> | undefined;
    if (!outerData) continue;

    const langData = outerData[innerKey] as { levels?: Record<string, { questions: any[] }> } | undefined;
    if (!langData?.levels) continue;

    (Object.keys(langData.levels) as Level[]).forEach((levelKey) => {
      const levelData = langData.levels![levelKey];
      (levelData.questions ?? []).forEach((q: any) => {
        exercises.push({
          ...q,
          level: levelKey,
          language: outerKey,
        });
      });
    });
  }

  return exercises;
}

export const DebugPracticeStore = {
  async getProgress(uid?: string): Promise<GlobalProgress> {
    // 1. Load local cache first (fast)
    let localData: GlobalProgress = {};
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) localData = JSON.parse(data);
    } catch (e) {
      console.error('Error loading local ache-o-erro progress', e);
    }

    // 2. If user is logged in, sync with Firebase (remote is source of truth)
    if (uid) {
      try {
        const remoteData = await fetchAcheOErroProgress(uid);
        // Merge: prefer best of both for times/moves, remote takes precedence for completion
        const merged: GlobalProgress = { ...localData };
        for (const [id, remote] of Object.entries(remoteData)) {
          const local = localData[id];
          if (!local) {
            merged[id] = remote;
          } else {
            merged[id] = {
              completed: local.completed || remote.completed,
              bestTime: Math.min(local.bestTime, remote.bestTime),
              bestMoves: Math.min(local.bestMoves, remote.bestMoves),
              language: remote.language || local.language,
              level: remote.level || local.level,
            };
          }
        }
        // Persist merged data locally
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      } catch (e) {
        console.error('Error fetching remote ache-o-erro progress', e);
      }
    }

    return localData;
  },

  async saveResult(
    exerciseId: string,
    timeSeconds: number,
    moves: number,
    language: string,
    level: string,
    uid?: string,
  ): Promise<void> {
    try {
      // 1. Update local cache
      const progress = await this.getProgress();
      const existing = progress[exerciseId];

      const isNewBestTime = !existing || timeSeconds < existing.bestTime;
      const isNewBestMoves = !existing || moves < (existing.bestMoves ?? Infinity);

      if (isNewBestTime || isNewBestMoves || !existing?.completed) {
        progress[exerciseId] = {
          completed: true,
          bestTime: existing ? Math.min(existing.bestTime, timeSeconds) : timeSeconds,
          bestMoves: existing ? Math.min(existing.bestMoves ?? Infinity, moves) : moves,
          language,
          level,
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      }

      // 2. Sync to Firebase
      if (uid) {
        await saveAcheOErroResult(uid, exerciseId, timeSeconds, moves, language, level);
      }
    } catch (e) {
      console.error('Error saving ache-o-erro result', e);
    }
  },

  async resetProgress(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
};
