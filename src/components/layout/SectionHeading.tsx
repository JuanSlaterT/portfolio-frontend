interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
}

export default function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  id,
}: SectionHeadingProps) {
  return (
    <div className="mb-8 grid gap-4 border-t-2 border-[#171713] pt-4 md:grid-cols-[8rem_minmax(0,1fr)_minmax(16rem,0.8fr)] md:items-start">
      <div className="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#ff4d00]">
        [{index}]
      </div>
      <div>
        <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#6b6961]">
          {eyebrow}
        </p>
        <h2 id={id} className="display-type text-3xl font-black uppercase leading-none tracking-[-0.035em] text-[#171713] sm:text-5xl">
          {title}
        </h2>
      </div>
      {description && (
        <p className="text-sm leading-relaxed text-[#65635c] md:border-l md:border-[#aaa79d] md:pl-5">
          {description}
        </p>
      )}
    </div>
  );
}
