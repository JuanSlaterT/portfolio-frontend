import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export type AppLanguage = string;

const STORAGE_KEY = 'portfolio-lang';

function getStoredLanguage(): AppLanguage | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored?.trim() || null;
  } catch {
    return null;
  }
}

function getSystemLanguage(): AppLanguage {
  const preferredLanguage = navigator.languages?.[0] ?? navigator.language;
  return preferredLanguage.toLowerCase();
}

export function getPreferredLanguage(): AppLanguage {
  if (typeof window === 'undefined') return 'en';
  return getStoredLanguage() ?? getSystemLanguage();
}

i18n.use(initReactI18next).init({
  resources: {},
  lng: getPreferredLanguage(),
  fallbackLng: false,
  load: 'languageOnly',
  interpolation: { escapeValue: false },
});

export function persistLanguage(lang: AppLanguage) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // The selected language remains active for the current session.
  }
}

export default i18n;
