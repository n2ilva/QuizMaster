import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchCodingPracticeProgress, saveCodingPracticeResult, fetchCodingExercises } from '@/lib/api/coding-practice';
import type { Exercise } from './coding-practice.types';
const STORAGE_KEY = 'coding-practice-progress';
const DATA_CACHE_KEY = 'coding-exercises-cache';

export type ExerciseProgress = {
  completed: boolean;
  bestTime: number; // in seconds
  bestMoves?: number;
};

export type GlobalProgress = Record<string, ExerciseProgress>;

export const CodingPracticeStore = {
  async getAllExercises(): Promise<Exercise[]> {
    try {
      // 1. Try fetching from remote first (to always be updated)
      const remote = await fetchCodingExercises();
      if (remote && remote.length > 0) {
        await AsyncStorage.setItem(DATA_CACHE_KEY, JSON.stringify(remote));
        return remote;
      }
    } catch(e) {
      console.log('Failed fetching from remote', e);
    }
    
    // 2. Fallback to local cache
    try {
      const local = await AsyncStorage.getItem(DATA_CACHE_KEY);
      if (local) {
        return JSON.parse(local) as Exercise[];
      }
    } catch(e) {
      console.log('Failed fetching local cache', e);
    }
    return [];
  },

  async getProgress(uid?: string): Promise<GlobalProgress> {
    // 1. Load local first
    let localData: GlobalProgress = {};
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) localData = JSON.parse(data);
    } catch (e) {
      console.error('Error loading local progress', e);
    }

    // 2. If user is logged in, sync with Firebase
    if (uid) {
      try {
        const remoteData = await fetchCodingPracticeProgress(uid);
        // Merge - remote takes precedence for completion, but we can keep best of both?
        // Usually remote is the source of truth
        const merged = { ...localData, ...remoteData };
        
        // Update local with merged data
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      } catch (e) {
        console.error('Error fetching remote progress', e);
      }
    }

    return localData;
  },

  async saveResult(exerciseId: string, timeSeconds: number, moves: number, uid?: string): Promise<void> {
    try {
      // Save locally
      const progress = await this.getProgress();
      const existing = progress[exerciseId];

      const isNewBestTime = !existing || timeSeconds < existing.bestTime;
      const isNewBestMoves = !existing || moves < (existing.bestMoves ?? Infinity);

      if (isNewBestTime || isNewBestMoves || !existing?.completed) {
        progress[exerciseId] = {
          completed: true,
          bestTime: existing ? Math.min(existing.bestTime, timeSeconds) : timeSeconds,
          bestMoves: existing ? Math.min(existing.bestMoves ?? Infinity, moves) : moves,
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      }

      // Save to Firebase
      if (uid) {
        await saveCodingPracticeResult(uid, exerciseId, timeSeconds, moves);
      }
    } catch (e) {
      console.error('Error saving coding practice result', e);
    }
  },

  async resetProgress(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
};
