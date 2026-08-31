import { useTranslation } from 'react-i18next';
import { Home, Gamepad2, Network, FileDown } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export type PageId = 'home' | 'hobbies' | 'architecture' | 'cv';

interface NavBarProps {
  current: PageId;
  onNavigate: (page: PageId) => void;
}

export default function NavBar({ current, onNavigate }: NavBarProps) {
  const { t } = useTranslation();

  const items: { id: PageId; label: string; icon: typeof Home }[] = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'hobbies', label: t('nav.hobbies'), icon: Gamepad2 },
    { id: 'architecture', label: t('nav.architecture'), icon: Network },
    { id: 'cv', label: t('nav.cv'), icon: FileDown },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full overflow-visible border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between overflow-visible px-4 sm:px-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-black text-slate-950">
            JA
          </span>
          <span className="hidden flex-col items-start leading-none lg:flex">
            <span className="text-base">{t('brand.name')}</span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
              {t('brand.aspiration')}
            </span>
          </span>
        </button>

        <div className="flex items-center gap-1 overflow-visible sm:gap-2">
          <div className="flex items-center gap-1 overflow-x-auto sm:gap-2">
            {items.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4 ${
                  current === id
                    ? id === 'cv'
                      ? 'bg-amber-500/15 text-amber-400'
                      : 'bg-emerald-500/15 text-emerald-400'
                    : id === 'cv'
                      ? 'text-amber-400/70 hover:bg-amber-500/10 hover:text-amber-400'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
          <div className="ml-2 shrink-0 border-l border-white/10 pl-2 sm:ml-3 sm:pl-3">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
