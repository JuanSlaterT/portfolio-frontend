import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PageId } from '@/lib/routes';
import App from '@/App';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

vi.mock('@/components/NavBar', () => ({
  default: ({ current, onNavigate }: {
    current: PageId;
    onNavigate: (page: PageId) => void;
  }) => (
    <nav>
      <span data-testid="current-page">{current}</span>
      <button type="button" onClick={() => onNavigate('home')}>Home</button>
      <button type="button" onClick={() => onNavigate('hobbies')}>Hobbies</button>
      <button type="button" onClick={() => onNavigate('architecture')}>Architecture</button>
      <button type="button" onClick={() => onNavigate('resume')}>Resume</button>
    </nav>
  ),
}));

vi.mock('@/pages/HomePage', () => ({ default: () => <div>Home page</div> }));
vi.mock('@/pages/HobbiesPage', () => ({ default: () => <div>Hobbies page</div> }));
vi.mock('@/pages/ArchitecturePage', () => ({ default: () => <div>Architecture page</div> }));
vi.mock('@/pages/CvPage', () => ({ default: () => <div>Resume page</div> }));

describe('App URL navigation', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
    vi.stubGlobal('scrollTo', vi.fn());
  });

  it('renders a directly linked page from the current pathname', () => {
    window.history.replaceState({}, '', '/architecture');
    render(<App />);

    expect(screen.getByText('Architecture page')).toBeInTheDocument();
    expect(screen.getByTestId('current-page')).toHaveTextContent('architecture');
  });

  it('pushes a URL entry when navigating and responds to popstate', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Resume' }));
    expect(window.location.pathname).toBe('/resume');
    expect(screen.getByText('Resume page')).toBeInTheDocument();

    window.history.pushState({}, '', '/hobbies');
    fireEvent.popState(window);
    await waitFor(() => expect(screen.getByText('Hobbies page')).toBeInTheDocument());
  });

  it('canonicalizes an unknown path to the home page', () => {
    window.history.replaceState({}, '', '/unknown');
    render(<App />);

    expect(window.location.pathname).toBe('/');
    expect(screen.getByText('Home page')).toBeInTheDocument();
  });
});
