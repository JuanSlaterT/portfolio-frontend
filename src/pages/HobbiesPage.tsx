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
import PageHeader from '@/components/layout/PageHeader';
import SectionHeading from '@/components/layout/SectionHeading';

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
    <div className="grid min-h-[7.5rem] min-w-0 grid-rows-[2.75rem_minmax(0,1fr)] border border-[#171713] bg-[#f8f5ec] p-4">
      <div className="flex min-w-0 items-start gap-2 font-mono text-[9px] font-black uppercase leading-4 tracking-[0.12em] text-[#68665f]">
        <Icon className={`mt-px h-3.5 w-3.5 shrink-0 ${accent}`} />
        <span className="min-w-0 break-words">{label}</span>
      </div>
      <div className="flex min-w-0 items-end pt-2">
        <p
          className="display-type w-full min-w-0 break-words text-2xl font-black uppercase leading-none tracking-[-0.04em] text-[#171713]"
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
    <article className="flex h-full flex-col border-2 border-[#171713] bg-[#f8f5ec] shadow-[6px_6px_0_#171713]">
      <div className="flex items-center gap-3 border-b-2 border-[#171713] bg-[#171713] p-4 text-[#f1eee5] sm:px-6">
        <div className={`flex h-10 w-10 items-center justify-center ${accentColor}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#aaa79d]">Live data sheet</p>
          <h3 className="display-type text-xl font-black uppercase tracking-[-0.02em]">{title}</h3>
        </div>
      </div>

      {loadState === 'idle' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 p-8 text-center">
          <p className="max-w-md text-sm leading-relaxed text-[#65635c]">{notConfiguredText}</p>
          <button
            type="button"
            onClick={onLoad}
            className="ink-button px-5 py-2.5"
          >
            <Sparkles className="h-4 w-4 text-[#d9ff43]" />
            {loadButtonText}
          </button>
        </div>
      )}

      {loadState === 'loading' && (
        <div className="flex flex-1 items-center justify-center gap-3 p-12 text-[#65635c]">
          <Loader2 className="h-5 w-5 animate-spin text-[#ff4d00]" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.08em]">{loadingText}</span>
        </div>
      )}

      {loadState === 'error' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-[#ff4d00]/10 p-8 text-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#b52e00]">
            <AlertCircle className="h-5 w-5" />
            <span>{errorText}</span>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="outline-button px-4 py-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {loadState === 'success' && (
        <div className="grid flex-1 auto-rows-fr grid-cols-1 gap-px bg-[#171713] p-px min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-2">
          {children}
        </div>
      )}
    </article>
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
    <div className="mx-auto max-w-[90rem] border-x border-[#171713] px-4 pb-24 sm:px-6 lg:px-8">
      <PageHeader
        index="02"
        eyebrow={t('hobbies.gaming.title')}
        title={t('hobbies.title')}
        description={t('hobbies.subtitle')}
      >
        <span className="inline-flex items-center gap-2 bg-[#d9ff43] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.12em]">
          <Gamepad2 className="h-4 w-4" /> Personal telemetry
        </span>
      </PageHeader>

      <section className="py-20" aria-labelledby="gaming-stats-title">
        <SectionHeading
          index="01"
          eyebrow="Competitive systems"
          title={t('hobbies.gaming.title')}
          description={t('hobbies.gaming.subtitle')}
          id="gaming-stats-title"
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <GamingPanel
            title={t('hobbies.gaming.lol.title')}
            icon={Swords}
            accentColor="bg-[#2457ff] text-white"
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
                <StatCard label={t('hobbies.gaming.lol.rank')} value={formatRank(stats.lol.rank)} icon={Trophy} accent="text-[#2457ff]" />
                <StatCard label={t('hobbies.gaming.lol.lp')} value={formatNumber(stats.lol.lp, i18n.language, 0)} icon={TrendingUp} accent="text-[#2457ff]" />
                <StatCard label={t('hobbies.gaming.lol.level')} value={formatNumber(stats.lol.level, i18n.language, 0)} icon={Trophy} accent="text-[#2457ff]" />
                <StatCard label={t('hobbies.gaming.lol.wins')} value={formatNumber(stats.lol.wins, i18n.language, 0)} icon={TrendingUp} accent="text-[#26834f]" />
                <StatCard label={t('hobbies.gaming.lol.losses')} value={formatNumber(stats.lol.losses, i18n.language, 0)} icon={TrendingUp} accent="text-[#ff4d00]" />
                <StatCard label={t('hobbies.gaming.lol.winrate')} value={`${formatNumber(stats.lol.winRate, i18n.language)}%`} icon={Target} accent="text-[#26834f]" />
                <div className="col-span-1 min-[420px]:col-span-2 sm:col-span-3 lg:col-span-2">
                  <StatCard label={t('hobbies.gaming.lol.main')} value={stats.lol.mostPlayedChampion} icon={Sparkles} accent="text-[#2457ff]" />
                </div>
              </>
            )}
          </GamingPanel>

          <GamingPanel
            title={t('hobbies.gaming.valorant.title')}
            icon={Target}
            accentColor="bg-[#ff4d00] text-[#171713]"
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
                <StatCard label={t('hobbies.gaming.valorant.rank')} value={formatRank(stats.valorant.rank)} icon={Trophy} accent="text-[#ff4d00]" />
                <StatCard label={t('hobbies.gaming.valorant.rr')} value={formatNumber(stats.valorant.rr, i18n.language, 0)} icon={TrendingUp} accent="text-[#ff4d00]" />
                <StatCard label={t('hobbies.gaming.valorant.level')} value={formatNumber(stats.valorant.accountLevel, i18n.language, 0)} icon={Trophy} accent="text-[#ff4d00]" />
                <StatCard label={t('hobbies.gaming.valorant.kd')} value={formatNumber(stats.valorant.kd, i18n.language)} icon={TrendingUp} accent="text-[#26834f]" />
                <StatCard label={t('hobbies.gaming.valorant.headshot')} value={`${formatNumber(stats.valorant.headshotPercentage, i18n.language)}%`} icon={Target} accent="text-[#26834f]" />
                <StatCard label={t('hobbies.gaming.valorant.mainAgent')} value={stats.valorant.mainAgent} icon={Sparkles} accent="text-[#ff4d00]" />
              </>
            )}
          </GamingPanel>
        </div>
      </section>

      <section className="pb-8" aria-labelledby="interests-title">
        <SectionHeading
          index="02"
          eyebrow="Outside the request cycle"
          title={t('hobbies.other.title')}
          description={t('hobbies.other.subtitle')}
          id="interests-title"
        />

        <div className="grid border-b-2 border-[#171713] md:grid-cols-2">
          {HOBBY_ITEMS.map(({ key, emoji }, index) => (
            <article
              key={key}
              className={`group grid min-h-[12rem] grid-cols-[3rem_1fr_auto] gap-4 border-t-2 border-[#171713] p-5 transition-colors hover:bg-[#d9ff43] sm:p-7 ${index % 2 === 1 ? 'md:border-l-2' : ''}`}
            >
              <span className="font-mono text-[10px] font-black text-[#ff4d00]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="display-type text-2xl font-black uppercase leading-none tracking-[-0.03em] text-[#171713]">
                  {t(`hobbies.other.items.${key}.title`)}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#65635c]">
                  {t(`hobbies.other.items.${key}.description`)}
                </p>
              </div>
              <span className="text-3xl grayscale transition-all group-hover:grayscale-0" aria-hidden="true">{emoji}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
