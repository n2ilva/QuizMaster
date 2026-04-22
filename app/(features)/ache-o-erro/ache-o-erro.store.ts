import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAcheOErroProgress, saveAcheOErroResult } from '@/lib/api/ache-o-erro';
import { DebugExercise, Level } from './ache-o-erro.types';
import javascriptData from '@/data/ache-o-erro/javascript.json';
import javaData from '@/data/ache-o-erro/java.json';
import pythonData from '@/data/ache-o-erro/python.json';
import csharpData from '@/data/ache-o-erro/c-sharp.json';

const STORAGE_KEY = 'debug-practice-progress';

export type ExerciseProgress = {
  completed: boolean;
  bestTime: number; // in seconds
  bestMoves: number;
  language: string;
  level: string;
};

export type GlobalProgress = Record<string, ExerciseProgress>;

export const DebugPracticeStore = {
  async getAllExercises(): Promise<DebugExercise[]> {
    const exercises: DebugExercise[] = [];

    const dataSources = [
      { data: javascriptData, key: 'javascript' },
      { data: javaData, key: 'java' },
      { data: pythonData, key: 'python' },
      { data: csharpData, key: 'csharp' },
    ];

    dataSources.forEach(({ data, key }) => {
      const langData = (data as any)[key];
      if (langData && langData.levels) {
        const levels = langData.levels;
        (Object.keys(levels) as Level[]).forEach((levelKey) => {
          const levelData = levels[levelKey];
          levelData.questions.forEach((q: any) => {
            exercises.push({
              ...q,
              level: levelKey,
              language: key,
            });
          });
        });
      }
    });

    return exercises;
  },

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
