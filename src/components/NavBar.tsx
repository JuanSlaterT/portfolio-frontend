import { useTranslation } from 'react-i18next';
import { Home, Gamepad2, Network, FileDown } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getPathForPage, type PageId } from '@/lib/routes';

interface NavBarProps {
  current: PageId;
  onNavigate: (page: PageId) => void;
}

export default function NavBar({ current, onNavigate }: NavBarProps) {
  const { t } = useTranslation();

  const items: { id: PageId; label: string; icon: typeof Home; index: string }[] = [
    { id: 'home', label: t('nav.home'), icon: Home, index: '01' },
    { id: 'hobbies', label: t('nav.hobbies'), icon: Gamepad2, index: '02' },
    { id: 'architecture', label: t('nav.architecture'), icon: Network, index: '03' },
    { id: 'resume', label: t('nav.cv'), icon: FileDown, index: '04' },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b-2 border-[#171713] bg-[#f1eee5]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[4.5rem] max-w-[90rem] items-stretch justify-between px-3 sm:px-5 lg:px-8">
        <a
          href={getPathForPage('home')}
          onClick={(event) => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            onNavigate('home');
          }}
          className="group flex shrink-0 items-center border-x-2 border-[#171713] bg-[#171713] text-[#f1eee5]"
          aria-label={t('nav.home')}
        >
          <span className="display-type flex h-full items-center px-3 text-xl font-black tracking-[-0.06em] sm:px-4 sm:text-2xl">
            JA
          </span>
          <span className="flex h-full w-9 items-center justify-center bg-[#ff4d00] font-mono text-[10px] font-black text-[#171713] transition-colors group-hover:bg-[#d9ff43]">
            /01
          </span>
          <span className="hidden flex-col items-start px-4 leading-none xl:flex">
            <span className="text-sm font-bold">{t('brand.name')}</span>
            <span className="mt-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#b7b3a8]">
              {t('brand.aspiration')}
            </span>
          </span>
        </a>

        <div className="flex min-w-0 items-stretch">
          <div className="flex min-w-0 items-stretch">
            {items.map(({ id, label, icon: Icon, index }) => (
              <a
                key={id}
                href={getPathForPage(id)}
                onClick={(event) => {
                  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  event.preventDefault();
                  onNavigate(id);
                }}
                aria-current={current === id ? 'page' : undefined}
                className={`group relative flex shrink-0 items-center gap-2 border-l border-[#171713] px-3 font-mono text-[10px] font-black uppercase tracking-[0.08em] transition-colors sm:px-4 lg:px-5 ${
                  current === id
                    ? 'bg-[#171713] text-[#f1eee5]'
                    : 'text-[#171713] hover:bg-[#d9ff43]'
                }`}
              >
                <span className={`absolute left-1.5 top-1.5 text-[7px] ${current === id ? 'text-[#ff4d00]' : 'text-[#8b887f]'}`}>
                  {index}
                </span>
                <Icon className="h-4 w-4 sm:hidden" strokeWidth={2.4} />
                <span className="hidden sm:inline">{label}</span>
              </a>
            ))}
          </div>
          <div className="flex shrink-0 items-center border-x border-[#171713] px-1 sm:px-2">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
