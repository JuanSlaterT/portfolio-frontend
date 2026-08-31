import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Gamepad2,
  Trophy,
  TrendingUp,
  Target,
  Swords,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { portfolioApi, type GameStats } from '@/lib/api';
import { useLoading } from '@/hooks/useLoading';

type LoadState = 'idle' | 'loading' | 'error' | 'success';

const HOBBIES_STATS_CACHE_KEY = 'portfolio:my-hobbies:stats:v1';
const HOBBIES_STATS_CACHE_TTL_MS = 5 * 60 * 1000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isGameStats(value: unknown): value is GameStats {
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

function readCachedStats(): GameStats | null {
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

    const cacheAge = Date.now() - cachedValue.timestamp;
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

function writeCachedStats(stats: GameStats) {
  try {
    window.localStorage.setItem(
      HOBBIES_STATS_CACHE_KEY,
      JSON.stringify({
        data: stats,
        timestamp: Date.now(),
      }),
    );
  } catch {
    // The page still works when storage is blocked or its quota is exhausted.
  }
}

const HOBBY_ITEMS = [
  { key: 'gaming', emoji: '\ud83c\udfae' },
  { key: 'personalProjects', emoji: '\ud83d\udcbb' },
  { key: 'cloud', emoji: '\u2601\ufe0f' },
  { key: 'tinkering', emoji: '\ud83d\udee0\ufe0f' },
  { key: 'music', emoji: '\ud83c\udfb5' },
  { key: 'anime', emoji: '\ud83d\udcfa' },
  { key: 'visualDesign', emoji: '\ud83d\uddbc\ufe0f' },
  { key: 'gadgets', emoji: '\ud83d\udcf1' },
  { key: 'travel', emoji: '\ud83c\udf0e' },
  { key: 'research', emoji: '\ud83d\udd0e' },
] as const;

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: typeof Trophy;
  accent: string;
}) {
  const displayValue = String(value);

  return (
    <div className="grid h-full min-h-[7.5rem] min-w-0 grid-rows-[2.75rem_minmax(0,1fr)] rounded-xl border border-white/5 bg-slate-900/40 p-4">
      <div className="flex min-w-0 items-start gap-2 text-[11px] font-medium uppercase leading-4 tracking-[0.12em] text-slate-500">
        <Icon className={`mt-px h-3.5 w-3.5 shrink-0 ${accent}`} />
        <span className="min-w-0 break-words">{label}</span>
      </div>
      <div className="flex min-w-0 items-end pt-2">
        <p
          className="w-full min-w-0 break-words text-xl font-bold leading-tight tracking-tight text-white"
          title={displayValue}
        >
          {displayValue}
        </p>
      </div>
    </div>
  );
}

function formatRank(rank: string) {
  const titleCase = rank
    .toLowerCase()
    .replace(/(^|\s)([a-z])/g, (_, space: string, letter: string) =>
      `${space}${letter.toUpperCase()}`,
    );

  return titleCase.replace(/\b(i|ii|iii|iv|v)\b/gi, (roman) => roman.toUpperCase());
}

function formatNumber(value: number, language: string, maximumFractionDigits = 2) {
  return new Intl.NumberFormat(language.startsWith('es') ? 'es-CO' : 'en-US', {
    maximumFractionDigits,
  }).format(value);
}

function GamingPanel({
  title,
  icon: Icon,
  accentColor,
  loadState,
  onLoad,
  onRetry,
  loadingText,
  errorText,
  notConfiguredText,
  loadButtonText,
  children,
}: {
  title: string;
  icon: typeof Trophy;
  accentColor: string;
  loadState: LoadState;
  onLoad: () => void;
  onRetry: () => void;
  loadingText: string;
  errorText: string;
  notConfiguredText: string;
  loadButtonText: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentColor}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>

      {loadState === 'idle' && (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <p className="max-w-md text-sm text-slate-400">{notConfiguredText}</p>
          <button
            onClick={onLoad}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-emerald-500/30 hover:bg-emerald-500/10"
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            {loadButtonText}
          </button>
        </div>
      )}

      {loadState === 'loading' && (
        <div className="flex items-center justify-center gap-3 py-12 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
          <span className="text-sm">{loadingText}</span>
        </div>
      )}

      {loadState === 'error' && (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex items-center gap-2 text-sm text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span>{errorText}</span>
          </div>
          <button
            onClick={onRetry}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {loadState === 'success' && (
        <div className="grid flex-1 auto-rows-fr grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-2">
          {children}
        </div>
      )}
    </div>
  );
}

export default function HobbiesPage() {
  const { t, i18n } = useTranslation();
  const { runWithLoading } = useLoading();
  const [initialStats] = useState<GameStats | null>(() => readCachedStats());
  const [statsState, setStatsState] = useState<LoadState>(
    initialStats ? 'success' : 'idle',
  );
  const [stats, setStats] = useState<GameStats | null>(initialStats);
  const requestedStats = useRef(false);

  const fetchStats = useCallback(async () => {
    setStatsState('loading');
    try {
      const response = await runWithLoading(
        () => portfolioApi.getStats(),
        t('common.loadingStats'),
      );
      setStats(response);
      writeCachedStats(response);
      setStatsState('success');
    } catch {
      setStatsState('error');
    }
  }, [runWithLoading, t]);

  useEffect(() => {
    if (requestedStats.current) return;
    requestedStats.current = true;
    if (initialStats) return;
    void fetchStats();
  }, [fetchStats, initialStats]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm text-emerald-400">
          <Gamepad2 className="h-4 w-4" />
          {t('hobbies.gaming.title')}
        </div>
        <h1 className="text-4xl font-bold text-white sm:text-5xl">{t('hobbies.title')}</h1>
        <p className="mt-3 text-slate-400">{t('hobbies.subtitle')}</p>
      </div>

      {/* Gaming Stats */}
      <div className="mb-16">
        <h2 className="mb-6 text-2xl font-bold text-white">{t('hobbies.gaming.title')}</h2>
        <p className="mb-6 text-sm text-slate-500">{t('hobbies.gaming.subtitle')}</p>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LoL */}
          <GamingPanel
            title={t('hobbies.gaming.lol.title')}
            icon={Swords}
            accentColor="bg-blue-500/15 text-blue-400"
            loadState={statsState}
            onLoad={fetchStats}
            onRetry={fetchStats}
            loadingText={t('hobbies.gaming.lol.loading')}
            errorText={t('hobbies.gaming.lol.error')}
            notConfiguredText={t('hobbies.gaming.lol.notConfigured')}
            loadButtonText={t('hobbies.gaming.lol.loadMore')}
          >
            {stats && (
              <>
                <StatCard label={t('hobbies.gaming.lol.rank')} value={formatRank(stats.lol.rank)} icon={Trophy} accent="text-blue-400" />
                <StatCard label={t('hobbies.gaming.lol.lp')} value={formatNumber(stats.lol.lp, i18n.language, 0)} icon={TrendingUp} accent="text-blue-400" />
                <StatCard label={t('hobbies.gaming.lol.level')} value={formatNumber(stats.lol.level, i18n.language, 0)} icon={Trophy} accent="text-blue-400" />
                <StatCard label={t('hobbies.gaming.lol.wins')} value={formatNumber(stats.lol.wins, i18n.language, 0)} icon={TrendingUp} accent="text-emerald-400" />
                <StatCard label={t('hobbies.gaming.lol.losses')} value={formatNumber(stats.lol.losses, i18n.language, 0)} icon={TrendingUp} accent="text-red-400" />
                <StatCard label={t('hobbies.gaming.lol.winrate')} value={`${formatNumber(stats.lol.winRate, i18n.language)}%`} icon={Target} accent="text-emerald-400" />
                <div className="col-span-1 min-[420px]:col-span-2 sm:col-span-3 lg:col-span-2">
                  <StatCard label={t('hobbies.gaming.lol.main')} value={stats.lol.mostPlayedChampion} icon={Sparkles} accent="text-blue-400" />
                </div>
              </>
            )}
          </GamingPanel>

          {/* Valorant */}
          <GamingPanel
            title={t('hobbies.gaming.valorant.title')}
            icon={Target}
            accentColor="bg-red-500/15 text-red-400"
            loadState={statsState}
            onLoad={fetchStats}
            onRetry={fetchStats}
            loadingText={t('hobbies.gaming.valorant.loading')}
            errorText={t('hobbies.gaming.valorant.error')}
            notConfiguredText={t('hobbies.gaming.valorant.notConfigured')}
            loadButtonText={t('hobbies.gaming.valorant.loadMore')}
          >
            {stats && (
              <>
                <StatCard label={t('hobbies.gaming.valorant.rank')} value={formatRank(stats.valorant.rank)} icon={Trophy} accent="text-red-400" />
                <StatCard label={t('hobbies.gaming.valorant.rr')} value={formatNumber(stats.valorant.rr, i18n.language, 0)} icon={TrendingUp} accent="text-red-400" />
                <StatCard label={t('hobbies.gaming.valorant.level')} value={formatNumber(stats.valorant.accountLevel, i18n.language, 0)} icon={Trophy} accent="text-red-400" />
                <StatCard label={t('hobbies.gaming.valorant.kd')} value={formatNumber(stats.valorant.kd, i18n.language)} icon={TrendingUp} accent="text-emerald-400" />
                <StatCard label={t('hobbies.gaming.valorant.headshot')} value={`${formatNumber(stats.valorant.headshotPercentage, i18n.language)}%`} icon={Target} accent="text-emerald-400" />
                <StatCard label={t('hobbies.gaming.valorant.mainAgent')} value={stats.valorant.mainAgent} icon={Sparkles} accent="text-red-400" />
              </>
            )}
          </GamingPanel>
        </div>

      </div>

      {/* Other Hobbies */}
      <div>
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-bold text-white">{t('hobbies.other.title')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            {t('hobbies.other.subtitle')}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {HOBBY_ITEMS.map(({ key, emoji }) => (
            <article
              key={key}
              className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-500/20 hover:bg-emerald-500/[0.03]"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-slate-900/60 text-2xl transition-transform group-hover:scale-105"
                aria-hidden="true"
              >
                {emoji}
              </span>
              <div>
                <h3 className="font-semibold text-slate-100">
                  {t(`hobbies.other.items.${key}.title`)}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                  {t(`hobbies.other.items.${key}.description`)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
