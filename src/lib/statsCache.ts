import type { GameStats } from '@/lib/api';

export const HOBBIES_STATS_CACHE_KEY = 'portfolio:my-hobbies:stats:v1';
export const HOBBIES_STATS_CACHE_TTL_MS = 5 * 60 * 1000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function isGameStats(value: unknown): value is GameStats {
  if (!isRecord(value) || !isRecord(value.lol) || !isRecord(value.valorant)) {
    return false;
  }

  const { lol, valorant } = value;

  return (
    isFiniteNumber(lol.level) &&
    typeof lol.rank === 'string' &&
    isFiniteNumber(lol.lp) &&
    isFiniteNumber(lol.wins) &&
    isFiniteNumber(lol.losses) &&
    isFiniteNumber(lol.winRate) &&
    typeof lol.mostPlayedChampion === 'string' &&
    isFiniteNumber(valorant.accountLevel) &&
    typeof valorant.rank === 'string' &&
    isFiniteNumber(valorant.rr) &&
    isFiniteNumber(valorant.kd) &&
    isFiniteNumber(valorant.headshotPercentage) &&
    typeof valorant.mainAgent === 'string'
  );
}

function clearCachedStats() {
  try {
    window.localStorage.removeItem(HOBBIES_STATS_CACHE_KEY);
  } catch {
    // localStorage may be unavailable in privacy-restricted browsers.
  }
}

export function readCachedStats(now = Date.now()): GameStats | null {
  try {
    const storedValue = window.localStorage.getItem(HOBBIES_STATS_CACHE_KEY);
    if (!storedValue) return null;

    const cachedValue: unknown = JSON.parse(storedValue);
    if (
      !isRecord(cachedValue) ||
      !isFiniteNumber(cachedValue.timestamp) ||
      !isGameStats(cachedValue.data)
    ) {
      clearCachedStats();
      return null;
    }

    const cacheAge = now - cachedValue.timestamp;
    if (cacheAge < 0 || cacheAge >= HOBBIES_STATS_CACHE_TTL_MS) {
      clearCachedStats();
      return null;
    }

    return cachedValue.data;
  } catch {
    clearCachedStats();
    return null;
  }
}

export function writeCachedStats(stats: GameStats, now = Date.now()) {
  try {
    window.localStorage.setItem(
      HOBBIES_STATS_CACHE_KEY,
      JSON.stringify({ data: stats, timestamp: now }),
    );
  } catch {
    // The page still works when storage is blocked or its quota is exhausted.
  }
}
