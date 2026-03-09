import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Platform } from "react-native";

import type { GlossaryEntry } from "@/lib/api/types";
import { cacheRemove, fetchWithCache, GLOSSARY_TTL } from "@/lib/cache";
import { db } from "@/lib/firebase";

// ---------------------------------------------------------------------------
// Glossary
// ---------------------------------------------------------------------------

/**
 * Busca todos os termos do glossário técnico no Firestore (com cache longo).
 */
export async function fetchGlossary(): Promise<Record<string, GlossaryEntry>> {
  return fetchWithCache<Record<string, GlossaryEntry>>(
    "glossary:all",
    async () => {
      const snapshot = await getDocs(collection(db, "glossary"));
      const result: Record<string, GlossaryEntry> = {};
      for (const d of snapshot.docs) {
        const data = d.data();
        const term = (data.term as string) ?? "";
        const definition = (data.definition as string) ?? "";
        if (term) result[term.toLowerCase()] = { term, definition };
      }
      return result;
    },
    GLOSSARY_TTL,
  );
}

/**
 * Busca glossário específico de um track (ex.: glossary_matematica).
 */
const TRACKS_WITH_GLOSSARY = new Set(["matematica", "portugues", "ingles"]);

export function hasTrackGlossary(track: string): boolean {
  return TRACKS_WITH_GLOSSARY.has(track);
}

export async function fetchGlossaryByTrack(
  track: string,
): Promise<Record<string, GlossaryEntry>> {
  return fetchWithCache<Record<string, GlossaryEntry>>(
    `glossary:${track}`,
    async () => {
      const snapshot = await getDocs(collection(db, `glossary_${track}`));
      const result: Record<string, GlossaryEntry> = {};
      for (const d of snapshot.docs) {
        const data = d.data();
        const term = (data.term as string) ?? "";
        const definition = (data.definition as string) ?? "";
        if (term) result[term.toLowerCase()] = { term, definition };
      }
      return result;
    },
    GLOSSARY_TTL,
  );
}

// ---------------------------------------------------------------------------
// Glossary version sync
// ---------------------------------------------------------------------------

const GLOSSARY_VERSION_KEY = "@qm_glossary_version";

export async function syncGlossaryVersion(): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, "app_meta", "data_version"));
    if (!snap.exists()) return false;

    const remoteVersion = (snap.data().glossaryVersion as string) ?? null;
    if (!remoteVersion) return false;

    let localVersion: string | null = null;
    if (Platform.OS === "web") {
      localVersion = localStorage.getItem(GLOSSARY_VERSION_KEY);
    } else {
      localVersion = await AsyncStorage.getItem(GLOSSARY_VERSION_KEY);
    }

    if (localVersion === remoteVersion) return false;

    await cacheRemove("glossary:all");

    if (Platform.OS === "web") {
      localStorage.setItem(GLOSSARY_VERSION_KEY, remoteVersion);
    } else {
      await AsyncStorage.setItem(GLOSSARY_VERSION_KEY, remoteVersion);
    }

    return true;
  } catch {
    return false;
  }
}
