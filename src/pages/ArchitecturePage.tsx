import { useTranslation } from 'react-i18next';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  Box,
  Check,
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
import PageHeader from '@/components/layout/PageHeader';
import SectionHeading from '@/components/layout/SectionHeading';
import { API_HOSTNAME } from '@/lib/api';

type NodeVariant = 'paper' | 'signal' | 'blue' | 'acid' | 'ink';

const NODE_STYLES: Record<NodeVariant, string> = {
  paper: 'border-[#171713] bg-[#f8f5ec] text-[#171713]',
  signal: 'border-[#171713] bg-[#ff4d00] text-[#171713]',
  blue: 'border-[#171713] bg-[#2457ff] text-white',
  acid: 'border-[#171713] bg-[#d9ff43] text-[#171713]',
  ink: 'border-[#f1eee5] bg-[#171713] text-[#f1eee5]',
};

interface DiagramNodeProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  meta?: string;
  variant?: NodeVariant;
}

function DiagramNode({ icon: Icon, title, subtitle, meta, variant = 'paper' }: DiagramNodeProps) {
  return (
    <div className={`min-w-0 border-2 p-4 ${NODE_STYLES[variant]}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <Icon className="h-5 w-5 shrink-0" strokeWidth={1.8} />
        {meta && (
          <span className="border border-current px-2 py-0.5 font-mono text-[8px] font-black uppercase tracking-[0.08em]">
            {meta}
          </span>
        )}
      </div>
      <h3 className="display-type text-lg font-black uppercase leading-none tracking-[-0.025em]">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed opacity-70">{subtitle}</p>
    </div>
  );
}

function FlowArrow({ label, light = false }: { label?: string; light?: boolean }) {
  return (
    <div className={`flex shrink-0 flex-col items-center justify-center gap-1 py-2 ${light ? 'text-[#aaa79d]' : 'text-[#65635c]'} lg:px-3 lg:py-0`}>
      {label && <span className="text-center font-mono text-[8px] font-black uppercase tracking-[0.12em]">{label}</span>}
      <ArrowRight className="hidden h-5 w-5 lg:block" />
      <ArrowDown className="h-5 w-5 lg:hidden" />
    </div>
  );
}

function DownConnector({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-3 text-[#65635c]">
      <div className="h-5 w-px bg-[#171713]" />
      {label && <span className="my-1 font-mono text-[8px] font-black uppercase tracking-[0.12em]">{label}</span>}
      <ArrowDown className="h-5 w-5" />
    </div>
  );
}

const REPOSITORIES: Array<{ id: string; url: string; icon: LucideIcon; tags: string[] }> = [
  { id: 'terraform', url: 'https://github.com/JuanSlaterT/portfolio-arch-terraform', icon: GitBranch, tags: ['Terraform', 'AWS', 'HCL', 'SSM', 'GitHub OIDC'] },
  { id: 'bff', url: 'https://github.com/JuanSlaterT/portfolio-backend', icon: Network, tags: ['Java 21', 'Spring Boot', 'Gateway MVC', 'Docker'] },
  { id: 'language', url: 'https://github.com/JuanSlaterT/portfolio-microservices-language_service', icon: Globe, tags: ['Java 21', 'Spring Boot', 'AWS SDK v2', 'Amazon S3'] },
  { id: 'stats', url: 'https://github.com/JuanSlaterT/portfolio-microservices-stats_service', icon: Activity, tags: ['Java 21', 'RestClient', 'Resilience4j', 'OP.GG', 'HenrikDev'] },
  { id: 'resume', url: 'https://github.com/JuanSlaterT/portfolio-microservices-resume_request_service', icon: Mail, tags: ['Java 21', 'Spring MVC', 'Validation', 'Amazon SQS'] },
  { id: 'consumer', url: 'https://github.com/JuanSlaterT/portfolio-consumer-resume_request', icon: Zap, tags: ['Node.js 24', 'AWS Lambda', 'DynamoDB', 'Nodemailer'] },
];

const TERRAFORM_MODULES: Array<{ file: string; key: string; icon: LucideIcon }> = [
  { file: 'network.tf', key: 'network', icon: Network },
  { file: 'security.tf', key: 'security', icon: ShieldCheck },
  { file: 'ec2.tf', key: 'compute', icon: Server },
  { file: 'iam.tf', key: 'iam', icon: Lock },
  { file: 's3.tf', key: 'languages', icon: Box },
  { file: 'downloads.tf', key: 'downloads', icon: Cloud },
  { file: 'resume_requests.tf', key: 'resume', icon: Workflow },
  { file: 'deployments.tf', key: 'deployments', icon: Github },
  { file: 'lambda_deployments.tf', key: 'lambdaDeploy', icon: Zap },
  { file: 'cloudwatch.tf', key: 'observability', icon: Activity },
];

const OPERATIONS: Array<{ key: string; icon: LucideIcon }> = [
  { key: 'edge', icon: ShieldCheck },
  { key: 'identity', icon: Lock },
  { key: 'delivery', icon: GitBranch },
  { key: 'storage', icon: Cloud },
  { key: 'resilience', icon: Activity },
  { key: 'failures', icon: Workflow },
];

const SYNC_STEPS = ['client', 'nginx', 'bff', 'service', 'provider', 'response'];
const ASYNC_STEPS = ['request', 'producer', 'queue', 'worker', 'persist', 'notify', 'deliver', 'retry'];

export default function ArchitecturePage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-[90rem] border-x border-[#171713] px-4 pb-24 sm:px-6 lg:px-8">
      <PageHeader
        index="03"
        eyebrow={t('architecture.badge')}
        title={t('architecture.title')}
        description={t('architecture.subtitle')}
        compactTitle
      >
        <div className="flex flex-wrap gap-2">
          {['bff', 'services', 'worker', 'iac'].map((item) => (
            <span key={item} className="technical-tag text-[#171713]">{t(`architecture.summary.${item}`)}</span>
          ))}
        </div>
      </PageHeader>

      <section className="py-20" aria-labelledby="architecture-diagram-title">
        <SectionHeading
          index="01"
          eyebrow={t('architecture.diagram.eyebrow')}
          title={t('architecture.diagram.title')}
          description={t('architecture.diagram.description')}
          id="architecture-diagram-title"
        />

        <div className="paper-grid border-2 border-[#171713] bg-[#e5e0d4] shadow-[8px_8px_0_#171713]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#171713] bg-[#171713] px-5 py-4 text-[#f1eee5]">
            <span className="flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[0.18em]">
              <Globe className="h-4 w-4 text-[#ff4d00]" /> {t('architecture.diagram.ingressLabel')}
            </span>
            <span className="font-mono text-[9px] font-bold text-[#aaa79d]">{API_HOSTNAME} / HTTPS</span>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid items-stretch lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
              <DiagramNode icon={Globe} title={t('architecture.diagram.client.title')} subtitle={t('architecture.diagram.client.description')} variant="blue" />
              <FlowArrow label="HTTPS" />
              <DiagramNode icon={Network} title={t('architecture.diagram.dns.title')} subtitle={t('architecture.diagram.dns.description')} />
              <FlowArrow label="A record" />
              <DiagramNode icon={ShieldCheck} title={t('architecture.diagram.edge.title')} subtitle={t('architecture.diagram.edge.description')} meta="80 / 443" variant="acid" />
            </div>

            <DownConnector label="TCP 80 / 443" />

            <div className="border-2 border-dashed border-[#171713] bg-[#f8f5ec]/80 p-4 sm:p-6">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b-2 border-[#171713] pb-4">
                <div>
                  <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#ff4d00]">AWS / VPC / Public subnet</p>
                  <h3 className="display-type mt-2 text-2xl font-black uppercase tracking-[-0.035em]">Amazon EC2 / Linux 2023</h3>
                </div>
                <span className="bg-[#171713] px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#f1eee5]">Docker Compose</span>
              </div>

              <div className="mx-auto grid max-w-4xl items-stretch lg:grid-cols-[1fr_auto_1fr]">
                <DiagramNode icon={Lock} title="Nginx + Certbot" subtitle={t('architecture.diagram.nginx.description')} meta="public :80/:443" variant="ink" />
                <FlowArrow label="proxy_pass" />
                <DiagramNode icon={Network} title={t('architecture.diagram.bff.title')} subtitle={t('architecture.diagram.bff.description')} meta=":8080" variant="signal" />
              </div>

              <DownConnector label={t('architecture.diagram.internalTraffic')} />

              <div className="grid gap-4 lg:grid-cols-3">
                <div className="flex flex-col gap-2 border-l-4 border-[#2457ff] pl-3">
                  <DiagramNode icon={Globe} title={t('architecture.diagram.language.title')} subtitle={t('architecture.diagram.language.description')} meta=":8081" />
                  <p className="flex items-center gap-2 bg-[#e5e0d4] p-3 text-xs"><Box className="h-4 w-4" />{t('architecture.diagram.language.provider')}</p>
                </div>
                <div className="flex flex-col gap-2 border-l-4 border-[#ff4d00] pl-3">
                  <DiagramNode icon={Activity} title={t('architecture.diagram.stats.title')} subtitle={t('architecture.diagram.stats.description')} meta=":8082" />
                  <p className="flex items-center gap-2 bg-[#e5e0d4] p-3 text-xs"><Cloud className="h-4 w-4" />OP.GG / HenrikDev</p>
                </div>
                <div className="flex flex-col gap-2 border-l-4 border-[#d9ff43] pl-3">
                  <DiagramNode icon={Mail} title={t('architecture.diagram.resume.title')} subtitle={t('architecture.diagram.resume.description')} meta=":8083" />
                  <p className="flex items-center gap-2 bg-[#e5e0d4] p-3 text-xs"><Workflow className="h-4 w-4" />{t('architecture.diagram.resume.provider')}</p>
                </div>
              </div>
            </div>

            <DownConnector label={t('architecture.diagram.eventLabel')} />

            <div className="border-2 border-[#171713] bg-[#171713] p-4 text-[#f1eee5] sm:p-6">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[#5e5d57] pb-4">
                <div>
                  <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#ff4d00]">{t('architecture.diagram.asyncEyebrow')}</p>
                  <h3 className="display-type mt-2 text-2xl font-black uppercase tracking-[-0.035em]">{t('architecture.diagram.asyncTitle')}</h3>
                </div>
                <span className="bg-[#ff4d00] px-3 py-2 font-mono text-[9px] font-black uppercase text-[#171713]">{t('architecture.diagram.dlqBadge')}</span>
              </div>
              <div className="grid items-stretch lg:grid-cols-[1fr_auto_1fr_auto_1.35fr]">
                <DiagramNode icon={Workflow} title="Amazon SQS" subtitle={t('architecture.diagram.sqs.description')} meta="standard + DLQ" variant="ink" />
                <FlowArrow label="trigger" light />
                <DiagramNode icon={Zap} title={t('architecture.diagram.lambda.title')} subtitle={t('architecture.diagram.lambda.description')} meta="Node.js 24" variant="signal" />
                <FlowArrow label="fan-out" light />
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <DiagramNode icon={Database} title="Amazon DynamoDB" subtitle={t('architecture.diagram.dynamo.description')} variant="blue" />
                  <DiagramNode icon={Mail} title={t('architecture.diagram.email.title')} subtitle={t('architecture.diagram.email.description')} variant="acid" />
                  <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
                    <DiagramNode icon={Cloud} title="CloudFront + private S3" subtitle={t('architecture.diagram.downloads.description')} variant="ink" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-[#171713] pt-5 font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-[#65635c]">
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 bg-[#d9ff43] outline outline-1 outline-[#171713]" />{t('architecture.diagram.legend.public')}</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 bg-[#2457ff]" />{t('architecture.diagram.legend.internal')}</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 bg-[#ff4d00]" />{t('architecture.diagram.legend.async')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10" aria-labelledby="request-paths-title">
        <SectionHeading index="02" eyebrow={t('architecture.paths.eyebrow')} title={t('architecture.paths.title')} description={t('architecture.paths.description')} id="request-paths-title" />
        <div className="grid border-2 border-[#171713] lg:grid-cols-2">
          {[
            { type: 'sync', label: 'HTTP request / response', steps: SYNC_STEPS, icon: ArrowRight, surface: 'bg-[#d9ff43] text-[#171713]' },
            { type: 'async', label: 'Event-driven workflow', steps: ASYNC_STEPS, icon: Workflow, surface: 'bg-[#2457ff] text-white' },
          ].map((flow, flowIndex) => (
            <article key={flow.type} className={`p-5 sm:p-7 ${flow.surface} ${flowIndex === 1 ? 'border-t-2 border-[#171713] lg:border-l-2 lg:border-t-0' : ''}`}>
              <div className="mb-6 flex items-start gap-4 border-b-2 border-current pb-5">
                <flow.icon className="h-7 w-7 shrink-0" />
                <div>
                  <p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] opacity-70">{flow.label}</p>
                  <h3 className="display-type mt-2 text-3xl font-black uppercase tracking-[-0.04em]">{t(`architecture.paths.${flow.type}.title`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed opacity-75">{t(`architecture.paths.${flow.type}.description`)}</p>
                </div>
              </div>
              <ol className="grid gap-px bg-current sm:grid-cols-2">
                {flow.steps.map((step, index) => (
                  <li key={step} className={`flex items-start gap-3 p-3 ${flow.type === 'sync' ? 'bg-[#d9ff43]' : 'bg-[#2457ff]'}`}>
                    <span className="font-mono text-[9px] font-black opacity-60">{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-xs leading-relaxed">{t(`architecture.paths.${flow.type}.steps.${step}`)}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16" aria-labelledby="repositories-title">
        <SectionHeading index="03" eyebrow={t('architecture.repositories.eyebrow')} title={t('architecture.repositories.title')} description={t('architecture.repositories.description')} id="repositories-title" />
        <div className="grid border-b-2 border-[#171713] md:grid-cols-2 xl:grid-cols-3">
          {REPOSITORIES.map((repository, index) => {
            const Icon = repository.icon;
            return (
              <a key={repository.id} href={repository.url} target="_blank" rel="noreferrer" className={`group flex min-h-[25rem] flex-col border-t-2 border-[#171713] p-5 transition-colors hover:bg-[#d9ff43] sm:p-6 ${index % 3 !== 0 ? 'xl:border-l-2' : ''} ${index % 2 !== 0 ? 'md:border-l-2 xl:border-l-0' : ''}`}>
                <div className="flex items-start justify-between">
                  <span className="display-type text-6xl font-black tracking-[-0.08em] text-[#d0cbc0]">{String(index + 1).padStart(2, '0')}</span>
                  <Icon className="h-7 w-7" />
                </div>
                <p className="mt-6 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-[#ff4d00]">{t(`architecture.repositories.items.${repository.id}.role`)}</p>
                <h3 className="display-type mt-2 break-words text-2xl font-black uppercase leading-none tracking-[-0.03em]">{t(`architecture.repositories.items.${repository.id}.name`)}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-[#65635c]">{t(`architecture.repositories.items.${repository.id}.description`)}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {repository.tags.map((tag) => <span key={tag} className="technical-tag text-[#55544e]">{tag}</span>)}
                </div>
                <div className="mt-6 flex justify-end border-t border-[#171713] pt-3"><ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="py-10" aria-labelledby="terraform-title">
        <SectionHeading index="04" eyebrow="Infrastructure as Code" title={t('architecture.terraform.title')} description={t('architecture.terraform.description')} id="terraform-title" />
        <div className="grid border-2 border-[#171713] sm:grid-cols-2 xl:grid-cols-5">
          {TERRAFORM_MODULES.map((module, index) => {
            const Icon = module.icon;
            return (
              <div key={module.file} className={`min-h-[12rem] p-4 transition-colors hover:bg-[#ff4d00] ${index > 0 ? 'border-t border-[#171713] sm:border-t-0' : ''} ${index % 2 === 1 ? 'sm:border-l' : ''} ${index > 1 ? 'sm:border-t xl:border-t-0' : ''} ${index > 0 ? 'xl:border-l' : ''}`}>
                <div className="flex items-start justify-between"><Icon className="h-5 w-5" /><span className="font-mono text-[8px] font-black text-[#77756d]">TF/{String(index + 1).padStart(2, '0')}</span></div>
                <p className="mt-7 font-mono text-xs font-black">{module.file}</p>
                <p className="mt-3 text-xs leading-relaxed text-[#65635c]">{t(`architecture.terraform.modules.${module.key}`)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="pt-16" aria-labelledby="operations-title">
        <SectionHeading index="05" eyebrow={t('architecture.operations.eyebrow')} title={t('architecture.operations.title')} description={t('architecture.operations.description')} id="operations-title" />
        <div className="grid border-b-2 border-[#171713] md:grid-cols-2 xl:grid-cols-3">
          {OPERATIONS.map((item, index) => {
            const Icon = item.icon;
            return (
              <article key={item.key} className={`grid min-h-[12rem] grid-cols-[2rem_1fr] gap-4 border-t-2 border-[#171713] p-5 ${index % 3 !== 0 ? 'xl:border-l-2' : ''} ${index % 2 !== 0 ? 'md:border-l-2 xl:border-l-0' : ''}`}>
                <div><Icon className="h-5 w-5 text-[#2457ff]" /><Check className="mt-3 h-4 w-4 text-[#ff4d00]" /></div>
                <div><h3 className="display-type text-xl font-black uppercase tracking-[-0.025em]">{t(`architecture.operations.items.${item.key}.title`)}</h3><p className="mt-3 text-sm leading-relaxed text-[#65635c]">{t(`architecture.operations.items.${item.key}.description`)}</p></div>
              </article>
            );
          })}
        </div>
        <div className="mt-6 flex items-start gap-4 border-2 border-[#171713] bg-[#d9ff43] p-5 shadow-[5px_5px_0_#171713] sm:items-center">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 sm:mt-0" />
          <p className="text-sm font-semibold leading-relaxed">{t('architecture.operations.footer')}</p>
          <Code2 className="ml-auto hidden h-6 w-6 shrink-0 sm:block" />
        </div>
      </section>
    </div>
  );
}
