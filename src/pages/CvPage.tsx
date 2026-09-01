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
import { useLoading } from '@/hooks/useLoading';
import PageHeader from '@/components/layout/PageHeader';

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
        return portfolioApi.createResumeRequest({
          email: trimmed,
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
    <div className="mx-auto max-w-[90rem] border-x border-[#171713] px-4 pb-24 sm:px-6 lg:px-8">
      <PageHeader
        index="04"
        eyebrow={t('nav.cv')}
        title={t('cv.title')}
        description={t('cv.subtitle')}
      >
        <span className="inline-flex items-center gap-2 bg-[#2457ff] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-white">
          <Languages className="h-4 w-4" /> PDF / ES + EN
        </span>
      </PageHeader>

      <section className="grid border-x-2 border-b-2 border-[#171713] lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="flex min-h-[34rem] flex-col justify-between bg-[#171713] p-6 text-[#f1eee5] sm:p-10">
          <div>
            <div className="flex items-center justify-between border-b border-[#5f5e58] pb-4 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#aaa79d]">
              <span>Document request</span>
              <span>REF. CV-04</span>
            </div>
            <FileDown className="mt-10 h-16 w-16 text-[#d9ff43]" strokeWidth={1.4} />
            <h2 className="display-type mt-8 text-5xl font-black uppercase leading-[0.85] tracking-[-0.05em]">
              {t('cv.formTitle')}
            </h2>
          </div>

          <div className="space-y-5">
            <div className="border-l-4 border-[#2457ff] pl-4 text-sm leading-relaxed text-[#c9c5ba]">
              {t('cv.languageNote')}
            </div>
            <p className="flex items-start gap-3 border-t border-[#5f5e58] pt-5 font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-[#aaa79d]">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#ff4d00]" />
              {t('cv.privacyNote')}
            </p>
          </div>
        </aside>

        <div className="paper-grid flex min-h-[34rem] items-center bg-[#f8f5ec] p-6 sm:p-10 lg:p-14">
        {status === 'success' && (
          <div className="w-full border-2 border-[#171713] bg-[#d9ff43] p-8 shadow-[8px_8px_0_#171713] sm:p-12">
            <div className="flex h-16 w-16 items-center justify-center border-2 border-[#171713] bg-[#171713] text-[#d9ff43]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="display-type mt-8 max-w-xl text-3xl font-black uppercase leading-tight tracking-[-0.035em] text-[#171713]">
              {t(restoredRequest ? 'cv.alreadyRequested' : 'cv.success')}
            </p>
            <div className="mt-8 border-t border-[#171713] pt-3 font-mono text-[9px] font-black uppercase tracking-[0.16em]">Request accepted / Status 202</div>
          </div>
        )}

        {status !== 'success' && (
          <div className="w-full">
            <div className="mb-8 flex items-end justify-between gap-4 border-b-2 border-[#171713] pb-4">
              <div>
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#ff4d00]">Delivery endpoint</p>
                <h2 className="display-type mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-[#171713]">{t('cv.formTitle')}</h2>
              </div>
              <Mail className="h-7 w-7 text-[#2457ff]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="cv-email" className="mb-2 flex items-center justify-between font-mono text-[10px] font-black uppercase tracking-[0.12em] text-[#171713]">
                  <span>{t('cv.emailLabel')}</span>
                  <span className="text-[#ff4d00]">Required *</span>
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
                  className={`w-full border-2 bg-[#f8f5ec] px-4 py-4 font-mono text-sm text-[#171713] placeholder:text-[#97948a] focus:outline-none disabled:opacity-50 ${
                    validationError || status === 'error'
                      ? 'border-[#ff4d00]'
                      : 'border-[#171713] focus:bg-[#d9ff43]/30'
                  }`}
                />
                {validationError && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-[#b52e00]">
                    <AlertCircle className="h-4 w-4" />
                    {validationError}
                  </p>
                )}
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 border-2 border-[#171713] bg-[#ff4d00] px-4 py-3 text-sm font-semibold text-[#171713]">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {t('cv.error')}
                </div>
              )}

              <label className="flex cursor-pointer items-start gap-3 border border-[#171713] bg-[#e5e0d4] px-4 py-4 text-sm text-[#55544e] transition-colors hover:bg-[#d9ff43]">
                <input
                  type="checkbox"
                  checked={subscribeToUpdates}
                  onChange={(event) => setSubscribeToUpdates(event.target.checked)}
                  disabled={status === 'submitting'}
                  className="mt-0.5 h-4 w-4 rounded-none border-[#171713] accent-[#ff4d00]"
                />
                <span>{t('cv.subscribeToUpdates')}</span>
              </label>

              <button
                type="submit"
                disabled={status === 'submitting' || !email.trim()}
                className="ink-button w-full px-6 py-4 disabled:cursor-not-allowed disabled:opacity-40"
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
          </div>
        )}
        </div>
      </section>
      </div>
  );
}
