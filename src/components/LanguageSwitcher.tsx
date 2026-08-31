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
        type="button"
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        className="flex items-center gap-1.5 px-2 py-2 font-mono text-[10px] font-black uppercase tracking-[0.08em] text-[#171713] transition-colors hover:bg-[#d9ff43] sm:px-3"
        aria-label="Change language"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{current}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-[100] mt-3 w-40 border-2 border-[#171713] bg-[#f1eee5] shadow-[5px_5px_0_#171713]">
          {languages.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              onClick={() => change(code)}
              className={`flex w-full items-center border-b border-[#171713] px-4 py-3 font-mono text-[10px] font-black uppercase tracking-[0.08em] transition-colors last:border-b-0 ${
                current === code
                  ? 'bg-[#ff4d00] text-[#171713]'
                  : 'text-[#171713] hover:bg-[#d9ff43]'
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
