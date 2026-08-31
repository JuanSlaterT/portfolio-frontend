import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AlertCircle, Languages, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  LanguageContext,
  type AvailableLanguage,
} from '@/contexts/language-context';
import { getPreferredLanguage } from '@/i18n';
import { portfolioApi, type LanguageDocument } from '@/lib/api';
import { useLoading } from '@/hooks/useLoading';

interface LanguageProviderProps {
  children: ReactNode;
}

interface LoadedLanguage extends AvailableLanguage {
  translations: Record<string, unknown>;
}

type LoadState = 'loading' | 'ready' | 'error';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeLanguageCode(catalogName: string, document: LanguageDocument) {
  const explicitCode = document.code;
  const source = typeof explicitCode === 'string' && explicitCode.trim()
    ? explicitCode
    : catalogName;

  return source.trim().toLowerCase().replace('_', '-');
}

function extractTranslations(document: LanguageDocument) {
  if (isRecord(document.translations)) return document.translations;
  if (isRecord(document.translation)) return document.translation;

  const directTranslations = Object.fromEntries(
    Object.entries(document).filter(([key]) => key !== 'code' && key !== 'name'),
  );

  if (Object.keys(directTranslations).length === 0) {
    throw new Error('The language document does not contain translations.');
  }

  return directTranslations;
}

function normalizeLanguage(catalogName: string, document: LanguageDocument): LoadedLanguage {
  const code = normalizeLanguageCode(catalogName, document);
  const documentName = document.name;

  if (!code) throw new Error(`The language ${catalogName} does not define a valid code.`);

  return {
    code,
    label: typeof documentName === 'string' && documentName.trim()
      ? documentName
      : catalogName,
    translations: extractTranslations(document),
  };
}

function selectInitialLanguage(preferredLanguage: string, languages: LoadedLanguage[]) {
  const normalizedPreference = preferredLanguage.toLowerCase().replace('_', '-');
  const preferredBase = normalizedPreference.split('-')[0];

  return (
    languages.find((language) => language.code === normalizedPreference) ??
    languages.find((language) => language.code.split('-')[0] === preferredBase) ??
    languages.find((language) => language.code === 'en') ??
    languages[0]
  );
}

function getBootstrapCopy(language: string) {
  const spanish = language.toLowerCase().startsWith('es');

  return spanish
    ? {
        loading: 'Cargando todos los idiomas...',
        title: 'No se pudieron cargar los idiomas',
        description: 'El contenido del sitio depende del servicio de idiomas. Revisa el servicio e inténtalo nuevamente.',
        retry: 'Reintentar',
      }
    : {
        loading: 'Loading all languages...',
        title: 'Languages could not be loaded',
        description: 'The site content depends on the language service. Check the service and try again.',
        retry: 'Try again',
      };
}

export default function LanguageProvider({ children }: LanguageProviderProps) {
  const { i18n } = useTranslation();
  const { runWithLoading } = useLoading();
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [languages, setLanguages] = useState<AvailableLanguage[]>([]);
  const started = useRef(false);
  const bootstrapCopy = getBootstrapCopy(getPreferredLanguage());

  const loadAllLanguages = useCallback(async () => {
    setLoadState('loading');

    try {
      const loadedLanguages = await runWithLoading(async () => {
        const catalog = await portfolioApi.getLanguages();
        const catalogNames = [...new Set(
          catalog.languages.map((language) => language.trim()).filter(Boolean),
        )];

        if (catalogNames.length === 0) {
          throw new Error('The language catalog is empty.');
        }

        const documents = await Promise.all(
          catalogNames.map(async (catalogName) =>
            normalizeLanguage(catalogName, await portfolioApi.getLanguage(catalogName)),
          ),
        );

        const uniqueCodes = new Set(documents.map((language) => language.code));
        if (uniqueCodes.size !== documents.length) {
          throw new Error('The language catalog contains duplicate language codes.');
        }

        return documents;
      }, bootstrapCopy.loading);

      loadedLanguages.forEach(({ code, translations }) => {
        i18n.addResourceBundle(code, 'translation', translations, true, true);
      });

      const selectedLanguage = selectInitialLanguage(
        getPreferredLanguage(),
        loadedLanguages,
      );

      if (!selectedLanguage) {
        throw new Error('No language could be selected.');
      }

      await i18n.changeLanguage(selectedLanguage.code);
      setLanguages(
        loadedLanguages.map(({ code, label }) => ({ code, label })),
      );
      setLoadState('ready');
    } catch (error) {
      console.error('Language bootstrap failed', error);
      setLoadState('error');
    }
  }, [bootstrapCopy.loading, i18n, runWithLoading]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void loadAllLanguages();
  }, [loadAllLanguages]);

  const contextValue = useMemo(() => ({ languages }), [languages]);

  if (loadState === 'loading') return null;

  if (loadState === 'error') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
        <div className="w-full max-w-md rounded-2xl border border-red-500/15 bg-slate-900/70 p-8 text-center shadow-2xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
            <AlertCircle className="h-7 w-7" />
          </div>
          <div className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <Languages className="h-4 w-4" />
            Language Service
          </div>
          <h1 className="text-xl font-bold text-white">{bootstrapCopy.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{bootstrapCopy.description}</p>
          <button
            type="button"
            onClick={() => void loadAllLanguages()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-transform hover:scale-[1.02]"
          >
            <RefreshCw className="h-4 w-4" />
            {bootstrapCopy.retry}
          </button>
        </div>
      </main>
    );
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}
