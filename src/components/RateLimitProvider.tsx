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
        title: 'Solicitud limitada',
        message: 'Has sido bloqueado temporalmente por hacer demasiadas peticiones.',
        countdown: 'Podrás volver a usar el sitio en',
        automatic: 'El acceso se restablecerá automáticamente cuando termine el contador.',
      }
    : {
        badge: 'Temporary block · HTTP 429',
        title: 'Request throttled',
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
    <main className="paper-grid flex min-h-screen items-center justify-center bg-[#f1eee5] px-4 py-16 text-[#171713]">
      <section
        role="alert"
        className="w-full max-w-2xl border-2 border-[#171713] bg-[#f8f5ec] p-6 shadow-[12px_12px_0_#ff4d00] sm:p-10"
      >
        <div className="mb-8 flex items-center justify-between gap-4 border-b-2 border-[#171713] pb-4 font-mono text-[9px] font-black uppercase tracking-[0.16em]">
          <span>{copy.badge}</span>
          <span className="bg-[#ff4d00] px-2 py-1">System guard</span>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-end">
          <div>
            <div className="mb-7 flex h-16 w-16 items-center justify-center border-2 border-[#171713] bg-[#171713] text-[#ff4d00]">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h1 className="display-type text-5xl font-black uppercase leading-[0.82] tracking-[-0.055em] sm:text-6xl">{copy.title}</h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-[#65635c] sm:text-base">{copy.message}</p>
          </div>

          <div className="border-2 border-[#171713] bg-[#d9ff43] p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[0.12em]">
              <Clock3 className="h-4 w-4 text-[#2457ff]" />
              {copy.countdown}
            </div>
            <time
              dateTime={new Date(blockedUntil).toISOString()}
              aria-live="polite"
              className="display-type block text-6xl font-black tabular-nums tracking-[-0.06em]"
            >
              {formatCountdown(remainingSeconds)}
            </time>
            <p className="mt-4 border-t border-[#171713] pt-3 text-xs leading-relaxed text-[#55544e]">{copy.automatic}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
