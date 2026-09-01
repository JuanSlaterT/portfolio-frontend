import { getVisitorRequestHeaders } from '@/lib/visitor';
import { activateRateLimit } from '@/lib/rateLimit';

function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!configuredUrl) {
    throw new Error('Missing required environment variable: VITE_API_BASE_URL');
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(configuredUrl);
  } catch {
    throw new Error('VITE_API_BASE_URL must be a valid absolute URL');
  }

  if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
    throw new Error('VITE_API_BASE_URL must use HTTP or HTTPS');
  }

  return configuredUrl.replace(/\/+$/, '');
}

export const API_BASE_URL = getApiBaseUrl();
export const API_HOSTNAME = new URL(API_BASE_URL).hostname;

interface ApiEnvelope<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface SupportedLanguages {
  count: number;
  languages: string[];
}

export type LanguageDocument = Record<string, unknown>;

export interface GameStats {
  lol: {
    level: number;
    rank: string;
    lp: number;
    wins: number;
    losses: number;
    winRate: number;
    mostPlayedChampion: string;
  };
  valorant: {
    accountLevel: number;
    rank: string;
    rr: number;
    kd: number;
    headshotPercentage: number;
    mainAgent: string;
  };
}

export interface ResumeRequest {
  email: string;
  language: 'en' | 'es';
  subscribeToUpdates: boolean;
}

export interface ResumeRequestResult {
  result: string;
  message: string;
}

export class ApiError extends Error {
  readonly statusCode: number;
  readonly data: unknown;

  constructor(message: string, statusCode: number, data: unknown = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

function isApiEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ApiEnvelope<T>>;
  return (
    typeof candidate.statusCode === 'number' &&
    typeof candidate.message === 'string' &&
    'data' in candidate
  );
}

type RequestInitFactory = (visitorHeaders: Record<string, string>) => RequestInit;

async function request<T>(
  path: string,
  initOrFactory: RequestInit | RequestInitFactory = {},
): Promise<T> {
  let response: Response;

  try {
    const visitorHeaders = await getVisitorRequestHeaders();
    const init = typeof initOrFactory === 'function'
      ? initOrFactory(visitorHeaders)
      : initOrFactory;
    const headers = new Headers(init.headers);
    headers.set('Accept', 'application/json');
    if (init.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    Object.entries(visitorHeaders).forEach(([name, value]) => {
      headers.set(name, value);
    });

    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    });

    if (response.status === 429) {
      activateRateLimit(response.headers.get('x-missingTime'));
    }
  } catch (error) {
    throw new ApiError(
      error instanceof Error ? error.message : 'No se pudo conectar con el backend.',
      0,
    );
  }

  const contentType = response.headers.get('content-type') ?? '';
  const payload: unknown = contentType.includes('application/json')
    ? await response.json()
    : null;

  if (!isApiEnvelope<T>(payload)) {
    throw new ApiError(
      response.ok ? 'El backend devolvi\u00f3 una respuesta inesperada.' : response.statusText,
      response.status,
      payload,
    );
  }

  if (!response.ok || payload.statusCode >= 400) {
    throw new ApiError(payload.message, payload.statusCode, payload.data);
  }

  return payload.data;
}

export const portfolioApi = {
  getLanguages: () => request<SupportedLanguages>('/languages'),

  getLanguage: (language: string) =>
    request<LanguageDocument>(`/languages/${encodeURIComponent(language)}`),

  getStats: () => request<GameStats>('/stats', { cache: 'no-store' }),

  createResumeRequest: (resumeRequest: ResumeRequest) =>
    request<ResumeRequestResult>('/resume-request', (visitorHeaders) => ({
      method: 'POST',
      body: JSON.stringify({
        ...resumeRequest,
        ipHash: visitorHeaders['x-ipHash'],
      }),
    })),
};
