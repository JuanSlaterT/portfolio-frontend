import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { persistLanguage, type AppLanguage } from '@/i18n';
import { useLanguages } from '@/hooks/useLanguages';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { languages } = useLanguages();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = (i18n.resolvedLanguage ?? i18n.language) as AppLanguage;

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function change(language: AppLanguage) {
    setOpen(false);
    await i18n.changeLanguage(language);
    persistLanguage(language);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Change language"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{current}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-[100] mt-2 w-36 overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl backdrop-blur-xl">
          {languages.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => change(code)}
              className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors ${
                current === code
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="uppercase">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
