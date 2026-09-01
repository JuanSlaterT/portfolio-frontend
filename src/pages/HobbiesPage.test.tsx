import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HobbiesPage from '@/pages/HobbiesPage';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue ?? key,
    i18n: { language: 'en', resolvedLanguage: 'en' },
  }),
}));

vi.mock('@/hooks/useLoading', () => ({
  useLoading: () => ({
    runWithLoading: vi.fn((request: () => Promise<unknown>) => request()),
  }),
}));

vi.mock('@/lib/api', () => ({
  portfolioApi: {
    getStats: vi.fn(() => new Promise(() => undefined)),
  },
}));

vi.mock('@/lib/statsCache', () => ({
  readCachedStats: vi.fn(() => null),
  writeCachedStats: vi.fn(),
}));

describe('HobbiesPage gaming providers', () => {
  it('attributes each game to its external data source', () => {
    render(<HobbiesPage />);

    expect(screen.getByLabelText('Data source: OP.GG')).toBeInTheDocument();
    expect(screen.getByLabelText('Data source: HenrikDev')).toBeInTheDocument();
  });
});
