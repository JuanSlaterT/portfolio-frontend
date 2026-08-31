import { useTranslation } from 'react-i18next';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  Box,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  ExternalLink,
  GitBranch,
  Github,
  Globe,
  Lock,
  Mail,
  Network,
  Server,
  ShieldCheck,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react';

type Tone = 'cyan' | 'emerald' | 'amber' | 'purple' | 'blue' | 'rose';

const TONES: Record<Tone, { card: string; icon: string; badge: string; label: string }> = {
  cyan: {
    card: 'border-cyan-500/20 bg-cyan-500/[0.05]',
    icon: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300',
    badge: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300',
    label: 'text-cyan-300',
  },
  emerald: {
    card: 'border-emerald-500/20 bg-emerald-500/[0.05]',
    icon: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    badge: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    label: 'text-emerald-300',
  },
  amber: {
    card: 'border-amber-500/20 bg-amber-500/[0.05]',
    icon: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    badge: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    label: 'text-amber-300',
  },
  purple: {
    card: 'border-purple-500/20 bg-purple-500/[0.05]',
    icon: 'border-purple-500/20 bg-purple-500/10 text-purple-300',
    badge: 'border-purple-500/20 bg-purple-500/10 text-purple-300',
    label: 'text-purple-300',
  },
  blue: {
    card: 'border-blue-500/20 bg-blue-500/[0.05]',
    icon: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
    badge: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
    label: 'text-blue-300',
  },
  rose: {
    card: 'border-rose-500/20 bg-rose-500/[0.05]',
    icon: 'border-rose-500/20 bg-rose-500/10 text-rose-300',
    badge: 'border-rose-500/20 bg-rose-500/10 text-rose-300',
    label: 'text-rose-300',
  },
};

interface DiagramNodeProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  meta?: string;
  tone: Tone;
  compact?: boolean;
}

function DiagramNode({ icon: Icon, title, subtitle, meta, tone, compact = false }: DiagramNodeProps) {
  const colors = TONES[tone];

  return (
    <div className={`min-w-0 rounded-2xl border ${colors.card} ${compact ? 'p-4' : 'p-5'}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${colors.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold leading-tight text-white">{title}</h3>
            {meta && (
              <span className={`rounded-md border px-2 py-0.5 font-mono text-[10px] ${colors.badge}`}>
                {meta}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function FlowArrow({ label }: { label?: string }) {
  return (
    <div className="flex shrink-0 flex-col items-center justify-center gap-1 py-2 lg:px-2 lg:py-0">
      {label && <span className="text-center font-mono text-[9px] uppercase tracking-wider text-slate-600">{label}</span>}
      <ArrowRight className="hidden h-5 w-5 text-slate-600 lg:block" />
      <ArrowDown className="h-5 w-5 text-slate-600 lg:hidden" />
    </div>
  );
}

function DownConnector({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-3">
      <div className="h-5 w-px bg-slate-700" />
      {label && <span className="my-1 font-mono text-[9px] uppercase tracking-wider text-slate-600">{label}</span>}
      <ArrowDown className="h-5 w-5 text-slate-600" />
    </div>
  );
}

const REPOSITORIES: Array<{
  id: string;
  url: string;
  icon: LucideIcon;
  tone: Tone;
  tags: string[];
}> = [
  {
    id: 'terraform',
    url: 'https://github.com/JuanSlaterT/portfolio-arch-terraform',
    icon: GitBranch,
    tone: 'purple',
    tags: ['Terraform', 'AWS', 'HCL', 'SSM', 'GitHub OIDC'],
  },
  {
    id: 'bff',
    url: 'https://github.com/JuanSlaterT/portfolio-backend',
    icon: Network,
    tone: 'cyan',
    tags: ['Java 21', 'Spring Boot', 'Gateway MVC', 'Docker'],
  },
  {
    id: 'language',
    url: 'https://github.com/JuanSlaterT/portfolio-microservices-language_service',
    icon: Globe,
    tone: 'emerald',
    tags: ['Java 21', 'Spring Boot', 'AWS SDK v2', 'Amazon S3'],
  },
  {
    id: 'stats',
    url: 'https://github.com/JuanSlaterT/portfolio-microservices-stats_service',
    icon: Activity,
    tone: 'amber',
    tags: ['Java 21', 'RestClient', 'Resilience4j', 'OP.GG', 'HenrikDev'],
  },
  {
    id: 'resume',
    url: 'https://github.com/JuanSlaterT/portfolio-microservices-resume_request_service',
    icon: Mail,
    tone: 'blue',
    tags: ['Java 21', 'Spring MVC', 'Validation', 'Amazon SQS'],
  },
  {
    id: 'consumer',
    url: 'https://github.com/JuanSlaterT/portfolio-consumer-resume_request',
    icon: Zap,
    tone: 'rose',
    tags: ['Node.js 24', 'AWS Lambda', 'DynamoDB', 'Nodemailer'],
  },
];

const TERRAFORM_MODULES: Array<{ file: string; key: string; icon: LucideIcon; tone: Tone }> = [
  { file: 'network.tf', key: 'network', icon: Network, tone: 'cyan' },
  { file: 'security.tf', key: 'security', icon: ShieldCheck, tone: 'emerald' },
  { file: 'ec2.tf', key: 'compute', icon: Server, tone: 'amber' },
  { file: 'iam.tf', key: 'iam', icon: Lock, tone: 'purple' },
  { file: 's3.tf', key: 'languages', icon: Box, tone: 'emerald' },
  { file: 'downloads.tf', key: 'downloads', icon: Cloud, tone: 'cyan' },
  { file: 'resume_requests.tf', key: 'resume', icon: Workflow, tone: 'rose' },
  { file: 'deployments.tf', key: 'deployments', icon: Github, tone: 'blue' },
  { file: 'lambda_deployments.tf', key: 'lambdaDeploy', icon: Zap, tone: 'amber' },
  { file: 'cloudwatch.tf', key: 'observability', icon: Activity, tone: 'purple' },
];

const OPERATIONS: Array<{ key: string; icon: LucideIcon; tone: Tone }> = [
  { key: 'edge', icon: ShieldCheck, tone: 'emerald' },
  { key: 'identity', icon: Lock, tone: 'purple' },
  { key: 'delivery', icon: GitBranch, tone: 'blue' },
  { key: 'storage', icon: Cloud, tone: 'cyan' },
  { key: 'resilience', icon: Activity, tone: 'amber' },
  { key: 'failures', icon: Workflow, tone: 'rose' },
];

const SYNC_STEPS = ['client', 'nginx', 'bff', 'service', 'provider', 'response'];
const ASYNC_STEPS = ['request', 'producer', 'queue', 'worker', 'persist', 'notify', 'deliver', 'retry'];

export default function ArchitecturePage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <header className="mx-auto mb-14 max-w-4xl text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm text-emerald-300">
          <Network className="h-4 w-4" />
          {t('architecture.badge')}
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {t('architecture.title')}
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-400 sm:text-lg">
          {t('architecture.subtitle')}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {['bff', 'services', 'worker', 'iac'].map((item) => (
            <span
              key={item}
              className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300"
            >
              {t(`architecture.summary.${item}`)}
            </span>
          ))}
        </div>
      </header>

      <section className="mb-20" aria-labelledby="architecture-diagram-title">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              {t('architecture.diagram.eyebrow')}
            </p>
            <h2 id="architecture-diagram-title" className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              {t('architecture.diagram.title')}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-slate-500">{t('architecture.diagram.description')}</p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/5 bg-slate-900/35 p-4 shadow-2xl shadow-black/10 sm:p-6 lg:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <Globe className="h-4 w-4 text-cyan-400" />
              {t('architecture.diagram.ingressLabel')}
            </span>
            <span className="rounded-full border border-emerald-500/15 bg-emerald-500/5 px-3 py-1 font-mono text-[10px] text-emerald-300">
              api-portfolio.zapto.org
            </span>
          </div>

          <div className="grid items-stretch lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <DiagramNode
              icon={Globe}
              title={t('architecture.diagram.client.title')}
              subtitle={t('architecture.diagram.client.description')}
              tone="cyan"
              compact
            />
            <FlowArrow label="HTTPS" />
            <DiagramNode
              icon={Network}
              title={t('architecture.diagram.dns.title')}
              subtitle={t('architecture.diagram.dns.description')}
              tone="emerald"
              compact
            />
            <FlowArrow label="A record" />
            <DiagramNode
              icon={ShieldCheck}
              title={t('architecture.diagram.edge.title')}
              subtitle={t('architecture.diagram.edge.description')}
              meta="80 / 443"
              tone="emerald"
              compact
            />
          </div>

          <DownConnector label="TCP 80 / 443" />

          <div className="relative rounded-3xl border border-amber-500/20 bg-amber-500/[0.025] p-4 sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_32%)]" />
            <div className="relative mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
                  AWS · VPC · Public subnet
                </p>
                <h3 className="mt-1 text-lg font-bold text-white">Amazon EC2 · Amazon Linux 2023</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg border border-white/5 bg-slate-950/50 px-2.5 py-1 font-mono text-[10px] text-slate-400">
                  Docker Compose
                </span>
                <span className="rounded-lg border border-white/5 bg-slate-950/50 px-2.5 py-1 font-mono text-[10px] text-slate-400">
                  Internal network
                </span>
              </div>
            </div>

            <div className="relative mx-auto grid max-w-4xl items-stretch lg:grid-cols-[1fr_auto_1fr]">
              <DiagramNode
                icon={Lock}
                title="Nginx + Certbot"
                subtitle={t('architecture.diagram.nginx.description')}
                meta="public :80/:443"
                tone="emerald"
              />
              <FlowArrow label="proxy_pass" />
              <DiagramNode
                icon={Network}
                title={t('architecture.diagram.bff.title')}
                subtitle={t('architecture.diagram.bff.description')}
                meta=":8080"
                tone="cyan"
              />
            </div>

            <DownConnector label={t('architecture.diagram.internalTraffic')} />

            <div className="relative grid gap-4 lg:grid-cols-3">
              <div className="flex min-w-0 flex-col rounded-2xl border border-emerald-500/20 bg-slate-950/35 p-4">
                <DiagramNode
                  icon={Globe}
                  title={t('architecture.diagram.language.title')}
                  subtitle={t('architecture.diagram.language.description')}
                  meta=":8081"
                  tone="emerald"
                  compact
                />
                <div className="mx-5 h-4 w-px bg-emerald-500/30" />
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.05] px-3 py-2 text-xs text-slate-300">
                  <Box className="h-4 w-4 shrink-0 text-emerald-300" />
                  <span>{t('architecture.diagram.language.provider')}</span>
                </div>
              </div>

              <div className="flex min-w-0 flex-col rounded-2xl border border-amber-500/20 bg-slate-950/35 p-4">
                <DiagramNode
                  icon={Activity}
                  title={t('architecture.diagram.stats.title')}
                  subtitle={t('architecture.diagram.stats.description')}
                  meta=":8082"
                  tone="amber"
                  compact
                />
                <div className="mx-5 h-4 w-px bg-amber-500/30" />
                <div className="flex items-center gap-2 rounded-xl border border-amber-500/15 bg-amber-500/[0.05] px-3 py-2 text-xs text-slate-300">
                  <Cloud className="h-4 w-4 shrink-0 text-amber-300" />
                  <span>OP.GG · HenrikDev</span>
                </div>
              </div>

              <div className="flex min-w-0 flex-col rounded-2xl border border-blue-500/20 bg-slate-950/35 p-4">
                <DiagramNode
                  icon={Mail}
                  title={t('architecture.diagram.resume.title')}
                  subtitle={t('architecture.diagram.resume.description')}
                  meta=":8083"
                  tone="blue"
                  compact
                />
                <div className="mx-5 h-4 w-px bg-blue-500/30" />
                <div className="flex items-center gap-2 rounded-xl border border-blue-500/15 bg-blue-500/[0.05] px-3 py-2 text-xs text-slate-300">
                  <Workflow className="h-4 w-4 shrink-0 text-blue-300" />
                  <span>{t('architecture.diagram.resume.provider')}</span>
                </div>
              </div>
            </div>
          </div>

          <DownConnector label={t('architecture.diagram.eventLabel')} />

          <div className="rounded-3xl border border-purple-500/20 bg-purple-500/[0.025] p-4 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-purple-300">
                  {t('architecture.diagram.asyncEyebrow')}
                </p>
                <h3 className="mt-1 text-lg font-bold text-white">{t('architecture.diagram.asyncTitle')}</h3>
              </div>
              <span className="rounded-lg border border-rose-500/15 bg-rose-500/5 px-2.5 py-1 text-[10px] font-medium text-rose-300">
                {t('architecture.diagram.dlqBadge')}
              </span>
            </div>

            <div className="grid items-stretch lg:grid-cols-[1fr_auto_1fr_auto_1.35fr]">
              <DiagramNode
                icon={Workflow}
                title="Amazon SQS"
                subtitle={t('architecture.diagram.sqs.description')}
                meta="standard + DLQ"
                tone="purple"
                compact
              />
              <FlowArrow label="trigger" />
              <DiagramNode
                icon={Zap}
                title={t('architecture.diagram.lambda.title')}
                subtitle={t('architecture.diagram.lambda.description')}
                meta="Node.js 24"
                tone="amber"
                compact
              />
              <FlowArrow label="fan-out" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <DiagramNode
                  icon={Database}
                  title="Amazon DynamoDB"
                  subtitle={t('architecture.diagram.dynamo.description')}
                  tone="blue"
                  compact
                />
                <DiagramNode
                  icon={Mail}
                  title={t('architecture.diagram.email.title')}
                  subtitle={t('architecture.diagram.email.description')}
                  tone="rose"
                  compact
                />
                <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
                  <DiagramNode
                    icon={Cloud}
                    title="CloudFront + private S3"
                    subtitle={t('architecture.diagram.downloads.description')}
                    tone="cyan"
                    compact
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/5 pt-5 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" />{t('architecture.diagram.legend.public')}</span>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-400" />{t('architecture.diagram.legend.internal')}</span>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-purple-400" />{t('architecture.diagram.legend.async')}</span>
          </div>
        </div>
      </section>

      <section className="mb-20" aria-labelledby="request-paths-title">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">{t('architecture.paths.eyebrow')}</p>
          <h2 id="request-paths-title" className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            {t('architecture.paths.title')}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">{t('architecture.paths.description')}</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.03] p-5 sm:p-6">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
                <ArrowRight className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">HTTP request / response</p>
                <h3 className="mt-1 text-lg font-bold text-white">{t('architecture.paths.sync.title')}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{t('architecture.paths.sync.description')}</p>
              </div>
            </div>
            <ol className="grid gap-2 sm:grid-cols-2">
              {SYNC_STEPS.map((step, index) => (
                <li key={step} className="flex items-start gap-3 rounded-xl border border-white/5 bg-slate-950/35 p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 font-mono text-[10px] font-bold text-cyan-300">
                    {index + 1}
                  </span>
                  <span className="text-xs leading-relaxed text-slate-300">{t(`architecture.paths.sync.steps.${step}`)}</span>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-2xl border border-purple-500/15 bg-purple-500/[0.03] p-5 sm:p-6">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-300">
                <Workflow className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-300">Event-driven workflow</p>
                <h3 className="mt-1 text-lg font-bold text-white">{t('architecture.paths.async.title')}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{t('architecture.paths.async.description')}</p>
              </div>
            </div>
            <ol className="grid gap-2 sm:grid-cols-2">
              {ASYNC_STEPS.map((step, index) => (
                <li key={step} className="flex items-start gap-3 rounded-xl border border-white/5 bg-slate-950/35 p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/10 font-mono text-[10px] font-bold text-purple-300">
                    {index + 1}
                  </span>
                  <span className="text-xs leading-relaxed text-slate-300">{t(`architecture.paths.async.steps.${step}`)}</span>
                </li>
              ))}
            </ol>
          </article>
        </div>
      </section>

      <section className="mb-20" aria-labelledby="repositories-title">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">{t('architecture.repositories.eyebrow')}</p>
          <h2 id="repositories-title" className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            {t('architecture.repositories.title')}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">{t('architecture.repositories.description')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {REPOSITORIES.map((repository) => {
            const colors = TONES[repository.tone];
            const Icon = repository.icon;

            return (
              <a
                key={repository.id}
                href={repository.url}
                target="_blank"
                rel="noreferrer"
                className={`group flex min-h-[250px] flex-col rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 ${colors.card}`}
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${colors.icon}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-600 transition-colors group-hover:text-white" />
                </div>
                <p className={`text-xs font-semibold uppercase tracking-wider ${colors.label}`}>
                  {t(`architecture.repositories.items.${repository.id}.role`)}
                </p>
                <h3 className="mt-2 break-words font-mono text-sm font-bold leading-snug text-white">
                  {t(`architecture.repositories.items.${repository.id}.name`)}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                  {t(`architecture.repositories.items.${repository.id}.description`)}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {repository.tags.map((tag) => (
                    <span key={tag} className="rounded-md border border-white/5 bg-slate-950/40 px-2 py-1 text-[10px] font-medium text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="mb-20" aria-labelledby="terraform-title">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">Infrastructure as Code</p>
          <h2 id="terraform-title" className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            {t('architecture.terraform.title')}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">{t('architecture.terraform.description')}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {TERRAFORM_MODULES.map((module) => {
            const colors = TONES[module.tone];
            const Icon = module.icon;
            return (
              <div key={module.file} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-white/10">
                <div className={`mb-4 flex h-9 w-9 items-center justify-center rounded-lg border ${colors.icon}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="font-mono text-xs font-semibold text-white">{module.file}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{t(`architecture.terraform.modules.${module.key}`)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="operations-title">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">{t('architecture.operations.eyebrow')}</p>
          <h2 id="operations-title" className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            {t('architecture.operations.title')}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">{t('architecture.operations.description')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {OPERATIONS.map((item) => {
            const colors = TONES[item.tone];
            const Icon = item.icon;
            return (
              <article key={item.key} className="flex gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${colors.icon}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{t(`architecture.operations.items.${item.key}.title`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{t(`architecture.operations.items.${item.key}.description`)}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-500/15 bg-gradient-to-r from-emerald-500/[0.05] to-cyan-500/[0.03] p-5 sm:items-center">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400 sm:mt-0" />
          <p className="text-sm leading-relaxed text-slate-300">{t('architecture.operations.footer')}</p>
          <Code2 className="ml-auto hidden h-5 w-5 shrink-0 text-cyan-400 sm:block" />
        </div>
      </section>
    </div>
  );
}
