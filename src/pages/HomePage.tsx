import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowDown,
  ArrowUpRight,
  CheckCircle2,
  CircleDot,
  Cloud,
  Code2,
  Database,
  ExternalLink,
  Gamepad2,
  GitBranch,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Network,
  Server,
  ShieldCheck,
  Smartphone,
  Zap,
} from 'lucide-react';
import SectionHeading from '@/components/layout/SectionHeading';

const SKILL_GROUPS = [
  { key: 'foundations', icon: Code2, items: ['Java 21', 'JavaScript', 'TypeScript', 'Python', 'React 18', 'React Native', 'React Router', 'Material UI', 'Tailwind CSS', 'Module Federation'] },
  { key: 'backend', icon: Server, items: ['Spring Boot', 'Spring Web MVC', 'Spring Cloud Gateway', 'Node.js', 'Express.js', 'REST APIs', 'GraphQL', 'JSON-RPC', 'RestClient', 'Bean Validation'] },
  { key: 'data', icon: Database, items: ['PostgreSQL', 'SQL & JSONB', 'MongoDB', 'DynamoDB', 'Redis', 'Elasticsearch', 'Amazon S3'] },
  { key: 'cloud', icon: Cloud, items: ['AWS', 'EC2', 'Lambda', 'SQS & DLQ', 'S3', 'DynamoDB', 'CloudFront', 'IAM', 'CloudWatch', 'SSM', 'Azure Functions', 'Azure Container Apps', 'Azure AD B2C'] },
  { key: 'devops', icon: GitBranch, items: ['Terraform', 'Docker', 'Docker Compose', 'Nginx', 'Linux', 'GitHub Actions', 'OIDC CI/CD'] },
  { key: 'architecture', icon: Network, items: ['Microservices', 'BFF Pattern', 'Event-Driven', 'Serverless', 'Async Processing', 'Partial Batch Retry', 'Least Privilege'] },
  { key: 'reliability', icon: ShieldCheck, items: ['Resilience4j', 'Retries', 'Circuit Breakers', 'Spring Actuator', 'Structured Logging', 'Correlation IDs'] },
  { key: 'testing', icon: CheckCircle2, items: ['JUnit', 'Mockito', 'Spring MVC Tests', 'Jest', 'Supertest', 'Node Test Runner', 'Terraform Tests'] },
  { key: 'integrations', icon: Zap, items: ['AWS SDK v2', 'OP.GG', 'HenrikDev API', 'Gmail SMTP', 'Nodemailer', 'JSON Contracts'] },
  { key: 'tooling', icon: GitBranch, items: ['Git', 'GitHub', 'Maven', 'npm', 'AWS CLI', 'Terraform CLI', 'Docker CLI', 'Postman', 'Bash', 'PowerShell'] },
] as const;

const PROJECTS = [
  {
    key: 'papibridge' as const,
    url: 'https://github.com/JuanSlaterT/PAPIBridge',
    icon: Network,
    surface: 'bg-[#171713] text-[#f1eee5]',
    secondary: 'text-[#aaa79d]',
    tag: 'border-[#706f68] text-[#d6d1c6]',
  },
  {
    key: 'themightiestplayer' as const,
    url: 'https://github.com/JuanSlaterT/TheMightiestPlayer',
    icon: Gamepad2,
    surface: 'bg-[#d9ff43] text-[#171713]',
    secondary: 'text-[#45453f]',
    tag: 'border-[#171713] text-[#171713]',
  },
  {
    key: 'utelvtapk' as const,
    url: 'https://github.com/JuanSlaterT/UTELVTApk',
    icon: Smartphone,
    surface: 'bg-[#2457ff] text-white',
    secondary: 'text-blue-100',
    tag: 'border-blue-200/60 text-blue-50',
  },
];

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsAtTop(window.scrollY <= 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <section className="relative mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-[90rem] flex-col justify-center border-x border-[#171713] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-[#171713] py-3 font-mono text-[10px] font-black uppercase tracking-[0.14em]">
          <span className="flex items-center gap-2">
            <CircleDot className="h-3.5 w-3.5 fill-[#ff4d00] text-[#171713] [animation:marker-pulse_1.8s_steps(2)_infinite]" />
            {t('intro.available')}
          </span>
          <span className="text-[#6b6961]">Full-stack systems / Ecuador / 2026</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.58fr)] lg:items-stretch">
          <div className="flex flex-col justify-between">
            <div>
              <p className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#ff4d00]">
                {t('hero.greeting')}
              </p>
              <h1 className="display-type max-w-5xl text-[clamp(4.5rem,11vw,10rem)] font-black uppercase leading-[0.72] tracking-[-0.085em] text-[#171713]">
                {t('hero.name')}
              </h1>
              <p className="display-type mt-7 max-w-4xl text-[clamp(1.9rem,4.5vw,4.8rem)] font-black uppercase leading-[0.9] tracking-[-0.045em] text-[#ff4d00]">
                {t('hero.role')}
              </p>
            </div>

            <div className="mt-10 grid gap-7 border-t-2 border-[#171713] pt-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <p className="max-w-2xl text-lg leading-relaxed text-[#55544e] sm:text-xl">
                {t('hero.tagline')}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="ink-button px-6 py-3"
                >
                  {t('hero.cta')}
                  <ArrowDown className="h-4 w-4" />
                </button>
                <a href="https://github.com/JuanSlaterT" target="_blank" rel="noopener noreferrer" className="outline-button h-12 w-12" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://www.linkedin.com/in/juan-diego-ar%C3%A9valo-bernal-219428227/" target="_blank" rel="noopener noreferrer" className="outline-button h-12 w-12" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <aside className="relative flex min-h-[28rem] flex-col justify-between overflow-hidden border-2 border-[#171713] bg-[#171713] p-5 text-[#f1eee5] shadow-[8px_8px_0_#ff4d00] sm:p-7">
            <div className="absolute -right-7 -top-11 select-none font-mono text-[11rem] font-black leading-none text-white/[0.055]">01</div>
            <div className="relative flex items-center justify-between border-b border-[#5e5d57] pb-4 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#aaa79d]">
              <span>Build profile</span>
              <Code2 className="h-5 w-5 text-[#d9ff43]" />
            </div>
            <div className="relative my-10 space-y-6">
              {[
                ['01', 'Java / Spring'],
                ['02', 'React / TypeScript'],
                ['03', 'AWS / Terraform'],
                ['04', 'Distributed systems'],
              ].map(([index, label]) => (
                <div key={index} className="grid grid-cols-[2rem_1fr] items-center gap-3 border-b border-[#3e3e39] pb-3">
                  <span className="font-mono text-[9px] font-bold text-[#ff4d00]">{index}</span>
                  <span className="display-type text-xl font-black uppercase tracking-[-0.02em]">{label}</span>
                </div>
              ))}
            </div>
            <div className="relative border-l-4 border-[#d9ff43] pl-4 text-xs leading-relaxed text-[#c9c5ba]">
              {i18n.language.startsWith('es')
                ? 'La arquitectura no es decoración. Es la forma en que cada decisión sobrevive en producción.'
                : 'Architecture is not decoration. It is how every decision survives production.'}
            </div>
          </aside>
        </div>

        <div className={`pointer-events-none absolute bottom-3 left-4 hidden items-center gap-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#77756d] transition-opacity md:flex ${isAtTop ? 'opacity-100' : 'opacity-0'}`}>
          <ArrowDown className="h-4 w-4 animate-bounce" />
          {t('hero.scroll')}
        </div>
      </section>

      <section className="mx-auto max-w-[90rem] border-x border-[#171713] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading index="01" eyebrow={t('intro.subtitle')} title={t('intro.title')} />
        <div className="grid gap-8 py-6 lg:grid-cols-[minmax(15rem,0.55fr)_minmax(0,1.45fr)]">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#ff4d00]">{t('intro.bioTitle')}</p>
            <div className="mt-5 h-2 w-24 bg-[#171713]" />
          </div>
          <div className="space-y-6 border-l-2 border-[#171713] pl-6 text-lg leading-relaxed text-[#4f4e48] sm:pl-10 sm:text-xl">
            <p>{t('intro.bioParagraph1')}</p>
            <p>{t('intro.bioParagraph2')}</p>
            <p>{t('intro.bioParagraph3')}</p>
          </div>
        </div>
      </section>

      <section className="bg-[#e5e0d4] py-20 lg:py-28">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          <SectionHeading index="02" eyebrow={t('intro.skillsSubtitle')} title={t('intro.skillsTitle')} />
          <div className="border-b-2 border-[#171713]">
            {SKILL_GROUPS.map((group, index) => (
              <article key={group.key} className="group grid gap-4 border-t border-[#171713] py-5 transition-colors hover:bg-[#d9ff43] sm:grid-cols-[4rem_minmax(12rem,0.55fr)_minmax(0,1.45fr)] sm:items-start sm:px-3">
                <div className="flex items-center gap-2 font-mono text-[10px] font-black text-[#ff4d00]">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <group.icon className="h-4 w-4 text-[#171713]" />
                </div>
                <h3 className="display-type text-xl font-black uppercase tracking-[-0.025em] text-[#171713]">
                  {t(`intro.skillGroups.${group.key}`)}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {group.items.map((item) => (
                    <span key={item} className="font-mono text-[10px] font-bold uppercase tracking-[0.05em] text-[#55544e] before:mr-2 before:text-[#ff4d00] before:content-['+']">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="scroll-mt-24 py-20 lg:py-28">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          <SectionHeading index="03" eyebrow={t('projects.subtitle')} title={t('projects.title')} />
          <div className="grid border-2 border-[#171713] lg:grid-cols-3">
            {PROJECTS.map((project, index) => {
              const data = t(`projects.items.${project.key}`, { returnObjects: true }) as { name: string; description: string; tags: string[] };
              return (
                <a key={project.key} href={project.url} target="_blank" rel="noopener noreferrer" className={`group flex min-h-[31rem] flex-col p-6 transition-transform hover:-translate-y-2 lg:border-r-2 lg:border-[#171713] lg:last:border-r-0 ${index > 0 ? 'border-t-2 border-[#171713] lg:border-t-0' : ''} ${project.surface}`}>
                  <div className="flex items-start justify-between border-b border-current pb-5">
                    <span className="display-type text-7xl font-black leading-none tracking-[-0.08em] opacity-20">0{index + 1}</span>
                    <project.icon className="h-8 w-8" strokeWidth={1.7} />
                  </div>
                  <p className="mt-6 font-mono text-[9px] font-black uppercase tracking-[0.2em] opacity-70">Selected build / repository</p>
                  <h3 className="display-type mt-3 break-words text-4xl font-black uppercase leading-[0.9] tracking-[-0.045em]">{data.name}</h3>
                  <p className={`mt-5 flex-1 text-sm leading-relaxed ${project.secondary}`}>{data.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {data.tags.map((tag) => <span key={tag} className={`technical-tag ${project.tag}`}>{tag}</span>)}
                  </div>
                  <div className="mt-7 flex items-center justify-between border-t border-current pt-4 font-mono text-[10px] font-black uppercase tracking-[0.12em]">
                    <span>{t('projects.viewCode')}</span>
                    <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#ff4d00] py-16 text-[#171713] lg:py-20">
        <div className="mx-auto grid max-w-[90rem] gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em]">04 / Contact channel</p>
            <h2 className="display-type mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.82] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
              {t('intro.contactTitle')}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed">{t('intro.contactText')}</p>
          </div>
          <div className="space-y-3 border-l-2 border-[#171713] pl-5 font-mono text-xs font-black uppercase tracking-[0.08em]">
            <div className="flex items-center gap-3"><Mail className="h-5 w-5" />{t('intro.email')}</div>
            <div className="flex items-center gap-3"><MapPin className="h-5 w-5" />{t('intro.location')}</div>
            <a href="https://github.com/JuanSlaterT" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 border-b-2 border-[#171713] pb-1 hover:bg-[#d9ff43]">
              GitHub <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
