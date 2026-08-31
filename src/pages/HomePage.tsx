import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  MapPin,
  CircleDot,
  Code2,
  Database,
  Server,
  Cloud,
  Github,
  Linkedin,
  ArrowDown,
  ExternalLink,
  Gamepad2,
  Smartphone,
  Network,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';

const SKILL_GROUPS = [
  {
    key: 'foundations',
    icon: Code2,
    accent: 'bg-cyan-500/10 text-cyan-400',
    border: 'hover:border-cyan-500/20',
    items: ['Java 21', 'JavaScript', 'TypeScript', 'Python', 'React 18', 'React Native', 'React Router', 'Material UI', 'Tailwind CSS', 'Module Federation'],
  },
  {
    key: 'backend',
    icon: Server,
    accent: 'bg-emerald-500/10 text-emerald-400',
    border: 'hover:border-emerald-500/20',
    items: ['Spring Boot', 'Spring Web MVC', 'Spring Cloud Gateway', 'Node.js', 'Express.js', 'REST APIs', 'GraphQL', 'JSON-RPC', 'RestClient', 'Bean Validation'],
  },
  {
    key: 'data',
    icon: Database,
    accent: 'bg-blue-500/10 text-blue-400',
    border: 'hover:border-blue-500/20',
    items: ['PostgreSQL', 'SQL & JSONB', 'MongoDB', 'DynamoDB', 'Redis', 'Elasticsearch', 'Amazon S3'],
  },
  {
    key: 'cloud',
    icon: Cloud,
    accent: 'bg-amber-500/10 text-amber-400',
    border: 'hover:border-amber-500/20',
    items: ['AWS', 'EC2', 'Lambda', 'SQS & DLQ', 'S3', 'DynamoDB', 'CloudFront', 'IAM', 'CloudWatch', 'SSM', 'Azure Functions', 'Azure Container Apps', 'Azure AD B2C'],
  },
  {
    key: 'devops',
    icon: GitBranch,
    accent: 'bg-purple-500/10 text-purple-400',
    border: 'hover:border-purple-500/20',
    items: ['Terraform', 'Docker', 'Docker Compose', 'Nginx', 'Linux', 'GitHub Actions', 'OIDC CI/CD'],
  },
  {
    key: 'architecture',
    icon: Network,
    accent: 'bg-blue-500/10 text-blue-400',
    border: 'hover:border-blue-500/20',
    items: ['Microservices', 'BFF Pattern', 'Event-Driven', 'Serverless', 'Async Processing', 'Partial Batch Retry', 'Least Privilege'],
  },
  {
    key: 'reliability',
    icon: ShieldCheck,
    accent: 'bg-red-500/10 text-red-400',
    border: 'hover:border-red-500/20',
    items: ['Resilience4j', 'Retries', 'Circuit Breakers', 'Spring Actuator', 'Structured Logging', 'Correlation IDs'],
  },
  {
    key: 'testing',
    icon: CheckCircle2,
    accent: 'bg-emerald-500/10 text-emerald-400',
    border: 'hover:border-emerald-500/20',
    items: ['JUnit', 'Mockito', 'Spring MVC Tests', 'Jest', 'Supertest', 'Node Test Runner', 'Terraform Tests'],
  },
  {
    key: 'integrations',
    icon: Zap,
    accent: 'bg-cyan-500/10 text-cyan-400',
    border: 'hover:border-cyan-500/20',
    items: ['AWS SDK v2', 'OP.GG', 'HenrikDev API', 'Gmail SMTP', 'Nodemailer', 'JSON Contracts'],
  },
  {
    key: 'tooling',
    icon: GitBranch,
    accent: 'bg-slate-500/10 text-slate-300',
    border: 'hover:border-white/15',
    items: ['Git', 'GitHub', 'Maven', 'npm', 'AWS CLI', 'Terraform CLI', 'Docker CLI', 'Postman', 'Bash', 'PowerShell'],
  },
] as const;

const PROJECTS = [
  {
    key: 'papibridge' as const,
    url: 'https://github.com/JuanSlaterT/PAPIBridge',
    icon: Network,
    accent: 'from-emerald-500/15 to-cyan-500/15 text-emerald-400',
    border: 'hover:border-emerald-500/30',
  },
  {
    key: 'themightiestplayer' as const,
    url: 'https://github.com/JuanSlaterT/TheMightiestPlayer',
    icon: Gamepad2,
    accent: 'from-amber-500/15 to-orange-500/15 text-amber-400',
    border: 'hover:border-amber-500/30',
  },
  {
    key: 'utelvtapk' as const,
    url: 'https://github.com/JuanSlaterT/UTELVTApk',
    icon: Smartphone,
    accent: 'from-blue-500/15 to-indigo-500/15 text-blue-400',
    border: 'hover:border-blue-500/30',
  },
];

export default function HomePage() {
  const { t } = useTranslation();
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsAtTop(window.scrollY <= 0);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm text-emerald-400">
            <CircleDot className="h-3 w-3 animate-pulse" />
            {t('intro.available')}
          </div>

          <p className="mb-2 text-lg text-slate-400">{t('hero.greeting')}</p>
          <h1 className="bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
            {t('hero.name')}
          </h1>
          <p className="mt-4 text-xl font-medium text-emerald-400 sm:text-2xl">
            {t('hero.role')}
          </p>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-400">
            {t('hero.tagline')}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() =>
                document.getElementById('projects')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              }
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3 font-semibold text-slate-950 transition-transform hover:scale-105"
            >
              {t('hero.cta')}
            </button>
            <div className="flex gap-3">
              <a
                href="https://github.com/JuanSlaterT"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition-colors hover:border-white/20 hover:text-white"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/juan-diego-ar%C3%A9valo-bernal-219428227/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition-colors hover:border-white/20 hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div
            aria-hidden={!isAtTop}
            className={`mt-16 flex flex-col items-center gap-2 text-slate-500 transition-opacity duration-300 ease-out ${
              isAtTop ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="text-xs uppercase tracking-widest">{t('hero.scroll')}</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </div>
        </div>
      </section>

      {/* About / Intro */}
      <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white">{t('intro.title')}</h2>
          <p className="mt-3 text-slate-400">{t('intro.subtitle')}</p>
        </div>

        {/* Bio */}
        <div className="mb-12 rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:p-8">
          <h3 className="mb-4 text-lg font-semibold text-emerald-400">{t('intro.bioTitle')}</h3>
          <div className="space-y-4 text-slate-400 leading-relaxed">
            <p>{t('intro.bioParagraph1')}</p>
            <p>{t('intro.bioParagraph2')}</p>
            <p>{t('intro.bioParagraph3')}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-12">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-emerald-400">{t('intro.skillsTitle')}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              {t('intro.skillsSubtitle')}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {SKILL_GROUPS.map((group) => (
              <div
                key={group.key}
                className={`group rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:-translate-y-0.5 hover:bg-white/[0.035] ${group.border}`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${group.accent}`}>
                    <group.icon className="h-5 w-5" />
                  </span>
                  <h4 className="font-semibold text-white">
                    {t(`intro.skillGroups.${group.key}`)}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-white/5 bg-slate-900/50 px-2.5 py-1.5 text-xs font-medium text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div id="projects" className="mb-12 scroll-mt-24">
          <h3 className="mb-2 text-2xl font-bold text-white">{t('projects.title')}</h3>
          <p className="mb-6 text-slate-400">{t('projects.subtitle')}</p>
          <div className="grid gap-5 lg:grid-cols-3">
            {PROJECTS.map((project) => {
              const data = t(`projects.items.${project.key}`, { returnObjects: true }) as {
                name: string;
                description: string;
                tags: string[];
              };
              return (
                <a
                  key={project.key}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all ${project.border} hover:bg-white/[0.04]`}
                >
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${project.accent}`}>
                    <project.icon className="h-6 w-6" />
                  </div>
                  <h4 className="mb-2 text-lg font-bold text-white">{data.name}</h4>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-400">{data.description}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {data.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/5 bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors group-hover:text-white">
                    <Github className="h-4 w-4" />
                    {t('projects.viewCode')}
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 p-6 sm:p-8">
          <h3 className="mb-2 text-lg font-semibold text-emerald-400">{t('intro.contactTitle')}</h3>
          <p className="mb-6 text-slate-400">{t('intro.contactText')}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3">
              <Mail className="h-5 w-5 text-emerald-400" />
              <span className="text-slate-300">{t('intro.email')}</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3">
              <MapPin className="h-5 w-5 text-emerald-400" />
              <span className="text-slate-300">{t('intro.location')}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
