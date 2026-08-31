import { useContext } from 'react';
import { LanguageContext } from '@/contexts/language-context';

export function useLanguages() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguages must be used inside LanguageProvider');
  }

  return context;
}
