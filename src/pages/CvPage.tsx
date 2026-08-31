import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  FileDown,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Languages,
} from 'lucide-react';
import { portfolioApi } from '@/lib/api';
import { getClientHash } from '@/lib/clientHash';
import { useLoading } from '@/hooks/useLoading';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CV_REQUEST_STORAGE_KEY = 'portfolio:cv-request:v1';
const CV_REQUEST_RETRY_WINDOW_MS = 10 * 60 * 1000;

interface StoredCvRequest {
  requested: boolean;
  timestamp: number;
}

function writeCvRequestStatus(requested: boolean, timestamp: number) {
  try {
    window.localStorage.setItem(
      CV_REQUEST_STORAGE_KEY,
      JSON.stringify({ requested, timestamp } satisfies StoredCvRequest),
    );
  } catch {
    // Keep the form operational when localStorage is unavailable.
  }
}

function clearCvRequestStatus() {
  try {
    window.localStorage.removeItem(CV_REQUEST_STORAGE_KEY);
  } catch {
    // localStorage can be blocked by browser privacy settings.
  }
}

function readRecentCvRequestTimestamp(): number | null {
  try {
    const storedValue = window.localStorage.getItem(CV_REQUEST_STORAGE_KEY);
    if (!storedValue) return null;

    const parsedValue: unknown = JSON.parse(storedValue);
    if (
      !parsedValue ||
      typeof parsedValue !== 'object' ||
      Array.isArray(parsedValue) ||
      typeof (parsedValue as Partial<StoredCvRequest>).requested !== 'boolean' ||
      typeof (parsedValue as Partial<StoredCvRequest>).timestamp !== 'number' ||
      !Number.isFinite((parsedValue as Partial<StoredCvRequest>).timestamp)
    ) {
      clearCvRequestStatus();
      return null;
    }

    const { requested, timestamp } = parsedValue as StoredCvRequest;
    if (!requested) return null;

    const now = Date.now();
    const requestAge = now - timestamp;

    if (requestAge < 0) {
      writeCvRequestStatus(true, now);
      return now;
    }

    if (requestAge >= CV_REQUEST_RETRY_WINDOW_MS) {
      writeCvRequestStatus(false, timestamp);
      return null;
    }

    return timestamp;
  } catch {
    clearCvRequestStatus();
    return null;
  }
}

export default function CvPage() {
  const { t, i18n } = useTranslation();
  const { runWithLoading } = useLoading();
  const [initialRequestTimestamp] = useState<number | null>(() =>
    readRecentCvRequestTimestamp(),
  );
  const [email, setEmail] = useState('');
  const [subscribeToUpdates, setSubscribeToUpdates] = useState(false);
  const [status, setStatus] = useState<Status>(
    initialRequestTimestamp === null ? 'idle' : 'success',
  );
  const [recentRequestTimestamp, setRecentRequestTimestamp] = useState<number | null>(
    initialRequestTimestamp,
  );
  const [restoredRequest, setRestoredRequest] = useState(initialRequestTimestamp !== null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (recentRequestTimestamp === null) return;

    const remainingTime = Math.max(
      0,
      CV_REQUEST_RETRY_WINDOW_MS - (Date.now() - recentRequestTimestamp),
    );

    const unlockForm = () => {
      writeCvRequestStatus(false, recentRequestTimestamp);
      setRecentRequestTimestamp(null);
      setRestoredRequest(false);
      setStatus('idle');
    };

    if (remainingTime === 0) {
      unlockForm();
      return;
    }

    const timer = window.setTimeout(unlockForm, remainingTime);
    return () => window.clearTimeout(timer);
  }, [recentRequestTimestamp]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const storedRequestTimestamp = readRecentCvRequestTimestamp();
    if (storedRequestTimestamp !== null) {
      setRecentRequestTimestamp(storedRequestTimestamp);
      setRestoredRequest(true);
      setStatus('success');
      return;
    }

    const trimmed = email.trim();

    if (!EMAIL_REGEX.test(trimmed)) {
      setValidationError(t('cv.invalidEmail'));
      return;
    }

    setValidationError('');
    setStatus('submitting');

    try {
      await runWithLoading(async () => {
        const ipHash = await getClientHash();
        return portfolioApi.createResumeRequest({
          email: trimmed,
          ipHash,
          language: i18n.language.toLowerCase().startsWith('es') ? 'es' : 'en',
          subscribeToUpdates,
        });
      }, t('cv.submitting'));

      const requestTimestamp = Date.now();
      writeCvRequestStatus(true, requestTimestamp);
      setRecentRequestTimestamp(requestTimestamp);
      setRestoredRequest(false);
      setStatus('success');
      setEmail('');
      setSubscribeToUpdates(false);
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-sm text-amber-400">
          <FileDown className="h-4 w-4" />
          {t('nav.cv')}
        </div>
        <h1 className="text-4xl font-bold text-white sm:text-5xl">{t('cv.title')}</h1>
        <p className="mt-3 text-slate-400">{t('cv.subtitle')}</p>
        <div className="mx-auto mt-5 flex max-w-lg items-start gap-2.5 rounded-xl border border-cyan-500/15 bg-cyan-500/[0.05] px-4 py-3 text-left text-sm leading-relaxed text-cyan-100/80">
          <Languages className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
          <span>{t('cv.languageNote')}</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-amber-500/5 to-emerald-500/5 p-6 sm:p-10">
        {/* Success state */}
        {status === 'success' && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <p className="max-w-sm text-lg text-slate-200">
              {t(restoredRequest ? 'cv.alreadyRequested' : 'cv.success')}
            </p>
          </div>
        )}

        {/* Form / idle / error */}
        {status !== 'success' && (
          <>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
                <Mail className="h-5 w-5 text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-white">{t('cv.formTitle')}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="cv-email" className="mb-2 block text-sm font-medium text-slate-300">
                  {t('cv.emailLabel')}
                </label>
                <input
                  id="cv-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationError) setValidationError('');
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder={t('cv.emailPlaceholder')}
                  disabled={status === 'submitting'}
                  className={`w-full rounded-xl border bg-slate-900/50 px-4 py-3 text-slate-200 placeholder:text-slate-600 transition-colors focus:outline-none focus:ring-2 ${
                    validationError || status === 'error'
                      ? 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20'
                      : 'border-white/10 focus:border-amber-500/50 focus:ring-amber-500/20'
                  } disabled:opacity-50`}
                />
                {validationError && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {validationError}
                  </p>
                )}
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {t('cv.error')}
                </div>
              )}

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-slate-400 transition-colors hover:border-amber-500/20">
                <input
                  type="checkbox"
                  checked={subscribeToUpdates}
                  onChange={(event) => setSubscribeToUpdates(event.target.checked)}
                  disabled={status === 'submitting'}
                  className="mt-0.5 h-4 w-4 rounded border-white/20 bg-slate-900 accent-amber-500"
                />
                <span>{t('cv.subscribeToUpdates')}</span>
              </label>

              <button
                type="submit"
                disabled={status === 'submitting' || !email.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3.5 font-semibold text-slate-950 transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t('cv.submitting')}
                  </>
                ) : (
                  <>
                    <FileDown className="h-5 w-5" />
                    {t('cv.submit')}
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t('cv.privacyNote')}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
