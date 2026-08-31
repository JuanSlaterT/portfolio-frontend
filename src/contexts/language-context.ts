import { createContext } from 'react';

export interface AvailableLanguage {
  code: string;
  label: string;
}

export interface LanguageContextValue {
  languages: AvailableLanguage[];
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
