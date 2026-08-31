import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { Clock3, ShieldAlert } from 'lucide-react';
import { getPreferredLanguage } from '@/i18n';
import {
  clearRateLimit,
  getRateLimitSnapshot,
  getServerRateLimitSnapshot,
  subscribeToRateLimit,
} from '@/lib/rateLimit';

interface RateLimitProviderProps {
  children: ReactNode;
}

function getBlockCopy() {
  const spanish = getPreferredLanguage().toLowerCase().startsWith('es');

  return spanish
    ? {
        badge: 'Bloqueo temporal · HTTP 429',
        message: 'Has sido bloqueado temporalmente por hacer demasiadas peticiones.',
        countdown: 'Podrás volver a usar el sitio en',
        automatic: 'El acceso se restablecerá automáticamente cuando termine el contador.',
      }
    : {
        badge: 'Temporary block · HTTP 429',
        message: 'You have been temporarily blocked for making too many requests.',
        countdown: 'You will be able to use the site again in',
        automatic: 'Access will be restored automatically when the countdown ends.',
      };
}

function formatCountdown(remainingSeconds: number) {
  const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
  const seconds = (remainingSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function RateLimitProvider({ children }: RateLimitProviderProps) {
  const blockedUntil = useSyncExternalStore(
    subscribeToRateLimit,
    getRateLimitSnapshot,
    getServerRateLimitSnapshot,
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (blockedUntil === null) return;

    const updateCountdown = () => {
      const currentTime = Date.now();
      setNow(currentTime);

      if (currentTime >= blockedUntil) {
        clearRateLimit(blockedUntil);
      }
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 250);
    return () => window.clearInterval(interval);
  }, [blockedUntil]);

  if (blockedUntil === null) return children;

  const remainingSeconds = Math.max(0, Math.ceil((blockedUntil - now) / 1000));
  const copy = getBlockCopy();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-16 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-red-500/10 blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-amber-500/5 blur-[110px]" />
      </div>

      <section
        role="alert"
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-red-500/15 bg-slate-900/80 p-6 text-center shadow-2xl shadow-red-950/20 backdrop-blur-xl sm:p-10"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/15 bg-red-500/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-300">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
          {copy.badge}
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Oops, whoops!</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
          {copy.message}
        </p>

        <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-white/5 bg-slate-950/55 p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            <Clock3 className="h-4 w-4 text-amber-400" />
            {copy.countdown}
          </div>
          <time
            dateTime={new Date(blockedUntil).toISOString()}
            aria-live="polite"
            className="block font-mono text-5xl font-bold tabular-nums tracking-tight text-white sm:text-6xl"
          >
            {formatCountdown(remainingSeconds)}
          </time>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">{copy.automatic}</p>
        </div>
      </section>
    </main>
  );
}
