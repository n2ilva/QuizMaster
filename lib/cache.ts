import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// ---------------------------------------------------------------------------
// Cache configuration — TTLs in milliseconds
// ---------------------------------------------------------------------------

/** Dados estáticos (catálogo de tracks, contagens) — cache longo */
const STATIC_TTL = 24 * 60 * 60 * 1000; // 24 horas

/** Dados do usuário (progresso, stats) — cache curto */
const USER_TTL = 5 * 60 * 1000; // 5 minutos

/** Dados de comunidade (ranking) — cache médio */
const COMMUNITY_TTL = 10 * 60 * 1000; // 10 minutos

// ---------------------------------------------------------------------------
// Prefix for cache keys
// ---------------------------------------------------------------------------

const CACHE_PREFIX = "@qm_cache:";

/** Chave especial para armazenar a versão dos dados do servidor */
const DATA_VERSION_KEY = "@qm_data_version";

function buildKey(key: string): string {
  return `${CACHE_PREFIX}${key}`;
}

// ---------------------------------------------------------------------------
// Storage abstraction (AsyncStorage for native, localStorage for web)
// ---------------------------------------------------------------------------

async function storageGet(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return AsyncStorage.getItem(key);
}

async function storageSet(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      localStorage.setItem(key, value);
    } catch {
      // quota exceeded — ignore silently
    }
    return;
  }
  return AsyncStorage.setItem(key, value);
}

async function storageRemove(key: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    return;
  }
  return AsyncStorage.removeItem(key);
}

async function storageGetAllKeys(): Promise<string[]> {
  if (Platform.OS === "web") {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith(CACHE_PREFIX)) keys.push(k);
      }
      return keys;
    } catch {
      return [];
    }
  }
  const allKeys = await AsyncStorage.getAllKeys();
  return allKeys.filter((k) => k.startsWith(CACHE_PREFIX));
}

// ---------------------------------------------------------------------------
// Core cache operations
// ---------------------------------------------------------------------------

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  ttl: number;
};

/**
 * Recupera dados do cache. Retorna null se não existir ou estiver expirado.
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const raw = await storageGet(buildKey(key));
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    const age = Date.now() - entry.timestamp;

    if (age > entry.ttl) {
      // Expirado — remove em background, mas não bloqueia
      void storageRemove(buildKey(key));
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

/**
 * Recupera dados do cache mesmo se estiverem expirados (stale).
 * Retorna { data, isStale } ou null se não existir.
 */
export async function cacheGetStale<T>(
  key: string,
): Promise<{ data: T; isStale: boolean } | null> {
  try {
    const raw = await storageGet(buildKey(key));
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    const age = Date.now() - entry.timestamp;

    return {
      data: entry.data,
      isStale: age > entry.ttl,
    };
  } catch {
    return null;
  }
}

/**
 * Salva dados no cache com o TTL especificado.
 */
export async function cacheSet<T>(
  key: string,
  data: T,
  ttl: number,
): Promise<void> {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    await storageSet(buildKey(key), JSON.stringify(entry));
  } catch {
    // Falha silenciosa — cache é best-effort
  }
}

/**
 * Remove uma entrada específica do cache.
 */
export async function cacheRemove(key: string): Promise<void> {
  try {
    await storageRemove(buildKey(key));
  } catch {
    // ignore
  }
}

/**
 * Remove todas as entradas de cache que começam com o prefixo dado.
 */
export async function cacheInvalidatePrefix(prefix: string): Promise<void> {
  try {
    const keys = await storageGetAllKeys();
    const fullPrefix = buildKey(prefix);
    const toRemove = keys.filter((k) => k.startsWith(fullPrefix));

    if (Platform.OS === "web") {
      for (const k of toRemove) {
        localStorage.removeItem(k);
      }
    } else {
      if (toRemove.length > 0) {
        await AsyncStorage.multiRemove(toRemove);
      }
    }
  } catch {
    // ignore
  }
}

/**
 * Limpa todo o cache do app.
 */
export async function cacheClearAll(): Promise<void> {
  try {
    const keys = await storageGetAllKeys();
    if (keys.length === 0) return;

    if (Platform.OS === "web") {
      for (const k of keys) {
        localStorage.removeItem(k);
      }
    } else {
      await AsyncStorage.multiRemove(keys);
    }
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// High-level helper: fetch with cache (stale-while-revalidate)
// ---------------------------------------------------------------------------

/**
 * Busca dados usando cache stale-while-revalidate:
 * 1. Se existe cache válido → retorna imediatamente
 * 2. Se existe cache stale → retorna stale + revalida em background
 * 3. Se não existe cache → busca do servidor
 *
 * @param key Chave do cache
 * @param fetcher Função que busca dados frescos do servidor
 * @param ttl Time-to-live em ms
 */
export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number,
): Promise<T> {
  // 1. Tenta o cache
  const cached = await cacheGetStale<T>(key);

  if (cached && !cached.isStale) {
    // Cache válido — retorna direto
    return cached.data;
  }

  if (cached && cached.isStale) {
    // Cache stale — revalida em background e retorna stale
    void fetcher()
      .then((fresh) => cacheSet(key, fresh, ttl))
      .catch(() => {
        /* falha silenciosa na revalidação */
      });
    return cached.data;
  }

  // 3. Sem cache — busca do servidor
  const fresh = await fetcher();
  await cacheSet(key, fresh, ttl);
  return fresh;
}

// ---------------------------------------------------------------------------
// Remote data version check — auto-invalidates cache when server data changes
// ---------------------------------------------------------------------------

/**
 * Compara a versão dos dados no Firestore com a versão salva localmente.
 * Se a versão mudou, limpa todo o cache para forçar dados frescos.
 * Chamado no startup do app (DataProvider).
 */
export async function checkAndInvalidateIfNewVersion(
  fetchRemoteVersion: () => Promise<string | null>,
): Promise<boolean> {
  try {
    const remoteVersion = await fetchRemoteVersion();
    if (!remoteVersion) return false;

    const localVersion = await storageGet(DATA_VERSION_KEY);

    if (localVersion !== remoteVersion) {
      // Versão mudou — limpa todo o cache
      await cacheClearAll();
      await storageSet(DATA_VERSION_KEY, remoteVersion);
      return true; // cache foi invalidado
    }

    return false; // cache continua válido
  } catch {
    return false; // falha silenciosa — não bloqueia o app
  }
}

// ---------------------------------------------------------------------------
// Exported TTL constants for use in api.ts
// ---------------------------------------------------------------------------

export { COMMUNITY_TTL, STATIC_TTL, USER_TTL };
