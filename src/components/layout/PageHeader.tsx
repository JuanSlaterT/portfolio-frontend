import type { ReactNode } from 'react';

interface PageHeaderProps {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  compactTitle?: boolean;
  children?: ReactNode;
}

export default function PageHeader({
  index,
  eyebrow,
  title,
  description,
  compactTitle = false,
  children,
}: PageHeaderProps) {
  return (
    <header className="border-b-2 border-[#171713] pb-10 pt-8 sm:pb-14 sm:pt-12">
      <div className="mb-8 flex items-center justify-between gap-4 border-t border-[#171713] pt-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em]">
        <span>{index} / {eyebrow}</span>
        <span className="hidden text-[#6b6961] sm:block">Juan Diego Arévalo — Portfolio index</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.7fr)] lg:items-end">
        <h1 className={`display-type max-w-5xl font-black uppercase text-[#171713] ${
          compactTitle
            ? 'text-[clamp(2.65rem,6.5vw,6.5rem)] leading-[0.84] tracking-[-0.06em]'
            : 'text-[clamp(3.4rem,9vw,8.5rem)] leading-[0.78] tracking-[-0.075em]'
        }`}>
          {title}
        </h1>
        <div className="border-l-4 border-[#ff4d00] pl-5">
          <p className="max-w-xl text-base leading-relaxed text-[#55544e] sm:text-lg">
            {description}
          </p>
          {children && <div className="mt-5">{children}</div>}
        </div>
      </div>
    </header>
  );
}
