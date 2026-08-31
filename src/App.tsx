import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import NavBar, { type PageId } from '@/components/NavBar';
import HomePage from '@/pages/HomePage';
import HobbiesPage from '@/pages/HobbiesPage';
import ArchitecturePage from '@/pages/ArchitecturePage';
import CvPage from '@/pages/CvPage';

function App() {
  const { i18n } = useTranslation();
  const [page, setPage] = useState<PageId>('home');

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  function navigate(p: PageId) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[150px]" />
      </div>

      <NavBar current={page} onNavigate={navigate} />

      <main>
        {page === 'home' && <HomePage />}
        {page === 'hobbies' && <HobbiesPage />}
        {page === 'architecture' && <ArchitecturePage />}
        {page === 'cv' && <CvPage />}
      </main>

      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-sm text-slate-500 sm:flex-row sm:px-6">
          <p>{i18n.language === 'es' ? 'Hecho con React, Vite, Tailwind e i18next' : 'Built with React, Vite, Tailwind & i18next'}</p>
          <p>© {new Date().getFullYear()} Full Stack Dev</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
