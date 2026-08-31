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
    <div className="min-h-screen text-[#171713]">
      <NavBar current={page} onNavigate={navigate} />

      <main className="pt-[4.5rem]">
        {page === 'home' && <HomePage />}
        {page === 'hobbies' && <HobbiesPage />}
        {page === 'architecture' && <ArchitecturePage />}
        {page === 'cv' && <CvPage />}
      </main>

      <footer className="border-t-2 border-[#171713] bg-[#171713] py-10 text-[#f1eee5]">
        <div className="mx-auto grid max-w-[90rem] gap-8 px-4 sm:px-6 md:grid-cols-[1fr_auto] md:items-end lg:px-8">
          <div>
            <div className="display-type text-5xl font-black tracking-[-0.07em]">JA<span className="text-[#ff4d00]">/</span></div>
            <p className="mt-4 max-w-lg font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-[#aaa79d]">
              {i18n.language === 'es' ? 'construido con React, Vite, Tailwind e i18next. Desplegado con AWS S3 y Cloudfront =)' : 'Designed as a systems notebook, built with React, Vite, Tailwind and i18next.'}
            </p>
          </div>
          <div className="border-l border-[#5e5d57] pl-5 font-mono text-[10px] uppercase leading-6 tracking-[0.14em] text-[#aaa79d]">
            <p>© {new Date().getFullYear()} Juan Diego Arévalo</p>
            <p>Ecuador / UTC−5</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
