import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ArchitecturePage from '@/pages/ArchitecturePage';

const translationState = vi.hoisted(() => ({ language: 'en' }));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue ?? key,
    i18n: { resolvedLanguage: translationState.language },
  }),
}));

vi.mock('@/lib/api', () => ({
  API_HOSTNAME: 'api.example.test',
}));

describe('ArchitecturePage repositories', () => {
  beforeEach(() => {
    translationState.language = 'en';
  });

  it('links to the frontend repository with English fallback copy', () => {
    render(<ArchitecturePage />);

    expect(screen.getByRole('link', { name: /Portfolio Frontend/i })).toHaveAttribute(
      'href',
      'https://github.com/JuanSlaterT/portfolio-frontend',
    );
  });

  it('uses Spanish fallback copy when Spanish is active', () => {
    translationState.language = 'es';
    render(<ArchitecturePage />);

    expect(screen.getByRole('link', { name: /Frontend del portafolio/i })).toHaveAttribute(
      'href',
      'https://github.com/JuanSlaterT/portfolio-frontend',
    );
  });
});
