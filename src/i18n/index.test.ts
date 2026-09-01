import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_LANGUAGE, getPreferredLanguage, persistLanguage } from '@/i18n';

describe('language preference', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('uses English when the visitor has not selected a language', () => {
    expect(DEFAULT_LANGUAGE).toBe('en');
    expect(getPreferredLanguage()).toBe('en');
  });

  it('continues to respect an explicitly saved language', () => {
    persistLanguage('es');

    expect(getPreferredLanguage()).toBe('es');
  });
});
