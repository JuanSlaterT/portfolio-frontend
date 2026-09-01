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

describe('ArchitecturePage frontend delivery', () => {
  beforeEach(() => {
    translationState.language = 'en';
  });

  it('documents the public delivery path and its private origin', () => {
    render(<ArchitecturePage />);

    expect(screen.getByRole('heading', { name: 'Frontend delivery' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /https:\/\/juancito\.me/i })).toHaveAttribute(
      'href',
      'https://juancito.me',
    );
    expect(screen.getByRole('heading', { name: 'Amazon CloudFront' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Private S3 origin' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'AWS Certificate Manager' })).toBeInTheDocument();
    expect(screen.getByText(/Origin Access Control signs origin requests/i)).toBeInTheDocument();
  });

  it('provides Spanish fallback copy for the deployment diagram', () => {
    translationState.language = 'es';
    render(<ArchitecturePage />);

    expect(screen.getByRole('heading', { name: 'Entrega del frontend' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Origen S3 privado' })).toBeInTheDocument();
    expect(screen.getByText(/certificado SSL\/TLS administrado por AWS/i)).toBeInTheDocument();
  });
});
