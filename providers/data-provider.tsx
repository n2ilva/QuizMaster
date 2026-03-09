import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { AppState, Platform } from 'react-native';

import { preloadGlossary } from '@/components/glossary-text';
import {
    fetchUserProgress,
    getDatabaseStats,
    getTrackCatalog,
    syncDataVersion,
    type ProgressSummary,
    type TrackCatalogItem,
} from '@/lib/api';
import { cacheRemove } from '@/lib/cache';
import { useAuth } from '@/providers/auth-provider';

type DataContextValue = {
  /** True while the initial preload is running */
  isPreloading: boolean;
  /** Progress 0–100 for loading UI */
  preloadProgress: number;

  /** Cached track catalog (immutable between sessions) */
  trackCatalog: TrackCatalogItem[];
  /** Cached database stats */
  dbStats: { totalCards: number; activeTracks: number } | null;
  /** Cached user progress (refreshable) */
  userProgress: ProgressSummary | null;

  /** Re-fetch user progress (after a lesson ends, etc.) */
  refreshUserProgress: () => Promise<void>;
  /** Re-fetch the entire catalog (rarely needed) */
  refreshCatalog: () => Promise<void>;
};

const DataContext = createContext<DataContextValue | undefined>(undefined);

/** Retry helper — retries a failing async operation with linear back-off */
async function withRetry<T>(fn: () => Promise<T>, attempts = 3, delayMs = 1000): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i < attempts - 1) {
        await new Promise<void>((r) => setTimeout(r, delayMs * (i + 1)));
      }
    }
  }
  throw lastErr;
}

export function DataProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();

  const [isPreloading, setIsPreloading] = useState(true);
  const [preloadProgress, setPreloadProgress] = useState(0);

  const [trackCatalog, setTrackCatalog] = useState<TrackCatalogItem[]>([]);
  const [dbStats, setDbStats] = useState<{ totalCards: number; activeTracks: number } | null>(null);
  const [userProgress, setUserProgress] = useState<ProgressSummary | null>(null);

  const refreshCatalog = useCallback(async () => {
    try {
      // Invalida cache local para forçar busca fresca do Firestore
      await Promise.all([cacheRemove('catalog'), cacheRemove('dbStats')]);
      const [catalog, stats] = await Promise.all([getTrackCatalog(), getDatabaseStats()]);
      setTrackCatalog(catalog);
      setDbStats(stats);
    } catch (error) {
      console.error('[DataProvider] Erro ao carregar catálogo:', error);
    }
  }, []);

  const refreshUserProgress = useCallback(async () => {
    if (!user) return;
    try {
      const progress = await fetchUserProgress(user.id);
      setUserProgress(progress);
    } catch (error) {
      console.error('[DataProvider] Erro ao carregar progresso:', error);
    }
  }, [user]);

  // Preload everything when user logs in
  useEffect(() => {
    if (!user) {
      setIsPreloading(false);
      setPreloadProgress(100);
      setUserProgress(null);
      return;
    }

    let cancelled = false;

    (async () => {
      setIsPreloading(true);
      setPreloadProgress(0);

      try {
        // Step 0: Check if server data changed — invalidates cache if needed
        setPreloadProgress(5);
        await syncDataVersion();

        // Step 1: Catalog + Stats + Glossary (independent of user)
        setPreloadProgress(10);
        const [catalog, stats] = await withRetry(() =>
          Promise.all([getTrackCatalog(), getDatabaseStats(), preloadGlossary()])
        );
        if (cancelled) return;
        setTrackCatalog(catalog);
        setDbStats(stats);
        setPreloadProgress(50);

        // Step 2: User progress
        const progress = await withRetry(() => fetchUserProgress(user.id));
        if (cancelled) return;
        setUserProgress(progress);
        setPreloadProgress(100);
      } catch (error) {
        console.error('[DataProvider] Erro no preload:', error);
        // Even on error, let the app load so the user isn't stuck
        setPreloadProgress(100);
      } finally {
        if (!cancelled) {
          setIsPreloading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Re-check data version when app returns to foreground (native) or tab regains focus (web)
  const hasPreloadedRef = useRef(false);
  useEffect(() => {
    if (user && !isPreloading) {
      hasPreloadedRef.current = true;
    }
  }, [user, isPreloading]);

  useEffect(() => {
    if (!user) return;

    const handleFocus = async () => {
      if (!hasPreloadedRef.current) return;
      try {
        const changed = await syncDataVersion();
        if (changed) {
          await refreshCatalog();
        }
      } catch {
        // falha silenciosa
      }
    };

    if (Platform.OS === 'web') {
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void handleFocus();
      }
    });
    return () => subscription.remove();
  }, [user, refreshCatalog]);

  const value = useMemo<DataContextValue>(
    () => ({
      isPreloading,
      preloadProgress,
      trackCatalog,
      dbStats,
      userProgress,
      refreshUserProgress,
      refreshCatalog,
    }),
    [isPreloading, preloadProgress, trackCatalog, dbStats, userProgress, refreshUserProgress, refreshCatalog],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de DataProvider.');
  }
  return context;
}
