import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import NavBar from '@/components/NavBar';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@/components/LanguageSwitcher', () => ({
  default: () => <div>Language switcher</div>,
}));

describe('NavBar links', () => {
  it('exposes crawlable links for every application view', () => {
    render(<NavBar current="home" onNavigate={vi.fn()} />);

    expect(screen.getByText('nav.hobbies').closest('a')).toHaveAttribute('href', '/hobbies');
    expect(screen.getByText('nav.architecture').closest('a')).toHaveAttribute('href', '/architecture');
    expect(screen.getByText('nav.cv').closest('a')).toHaveAttribute('href', '/resume');
  });

  it('uses client-side navigation for a regular click', async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<NavBar current="home" onNavigate={onNavigate} />);

    await user.click(screen.getByText('nav.architecture'));

    expect(onNavigate).toHaveBeenCalledWith('architecture');
    expect(window.location.pathname).toBe('/');
  });
});
