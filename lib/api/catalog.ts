import {
    collection,
    doc,
    getCountFromServer,
    getDoc,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore";

import { trackLabels } from "@/data/tracks";
import type { ThemeItem, TrackCatalogItem } from "@/lib/api/types";
import {
    checkAndInvalidateIfNewVersion,
    fetchWithCache,
    STATIC_TTL,
} from "@/lib/cache";
import { db } from "@/lib/firebase";

// ---------------------------------------------------------------------------
// Data version check
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
// Track catalog
// ---------------------------------------------------------------------------

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
        { categories: Set<string>; totalCards: number }
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
  return fetchWithCache(
    `categories:${track}`,
    async () => {
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

/**
 * Retorna o total de cards de uma categoria (todas as dificuldades).
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
      const countSnapshot = await getCountFromServer(query(cardsRef));
      const totalCards = countSnapshot.data().count;
      const catalog = await getTrackCatalog();
      return { totalCards, activeTracks: catalog.length };
    },
    STATIC_TTL,
  );
}

// ---------------------------------------------------------------------------
// Themes
// ---------------------------------------------------------------------------

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
