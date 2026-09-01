import { beforeEach, describe, expect, it } from 'vitest';
import type { GameStats } from '@/lib/api';
import {
  HOBBIES_STATS_CACHE_KEY,
  HOBBIES_STATS_CACHE_TTL_MS,
  readCachedStats,
  writeCachedStats,
} from '@/lib/statsCache';

const STATS: GameStats = {
  lol: {
    level: 100,
    rank: 'GOLD I',
    lp: 50,
    wins: 20,
    losses: 10,
    winRate: 66.67,
    mostPlayedChampion: 'Morgana',
  },
  valorant: {
    accountLevel: 80,
    rank: 'PLATINUM II',
    rr: 40,
    kd: 1.2,
    headshotPercentage: 25,
    mainAgent: 'Omen',
  },
};

describe('gaming statistics cache', () => {
  beforeEach(() => window.localStorage.clear());

  it('returns schema-valid data before its TTL expires', () => {
    writeCachedStats(STATS, 1_000);
    expect(readCachedStats(1_000 + HOBBIES_STATS_CACHE_TTL_MS - 1)).toEqual(STATS);
  });

  it('rejects tampered data and removes it from storage', () => {
    window.localStorage.setItem(HOBBIES_STATS_CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: { ...STATS, lol: { ...STATS.lol, wins: 'many' } },
    }));

    expect(readCachedStats()).toBeNull();
    expect(window.localStorage.getItem(HOBBIES_STATS_CACHE_KEY)).toBeNull();
  });

  it('rejects expired and future-dated entries', () => {
    writeCachedStats(STATS, 1_000);
    expect(readCachedStats(1_000 + HOBBIES_STATS_CACHE_TTL_MS)).toBeNull();

    writeCachedStats(STATS, 5_000);
    expect(readCachedStats(4_999)).toBeNull();
  });
});
