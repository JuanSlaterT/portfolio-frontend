interface StoredVisitor {
  visitorId: string;
}

const VISITOR_STORAGE_KEY = 'visitor-portfolio';
const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PUBLIC_IPV4_URL = 'https://api.ipify.org?format=json';
const PUBLIC_IPV4_TIMEOUT_MS = 2500;

let inMemoryVisitorId: string | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function createUuidV4() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const randomNibble = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      return crypto.getRandomValues(new Uint8Array(1))[0] & 0x0f;
    }

    return Math.floor(Math.random() * 16);
  };

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const randomValue = randomNibble();
    const value = character === 'x' ? randomValue : (randomValue & 0x03) | 0x08;
    return value.toString(16);
  });
}

function fallbackHash(value: string) {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return `hash-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

async function hashValue(value: string) {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    return fallbackHash(value);
  }

  try {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', bytes);

    return Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, '0'),
    ).join('');
  } catch {
    return fallbackHash(value);
  }
}

export function normalizeIpv4(value: unknown): string | null {
  if (typeof value !== 'string') return null;

  const parts = value.trim().split('.');
  if (parts.length !== 4) return null;

  const octets = parts.map((part) => {
    if (!/^\d{1,3}$/.test(part)) return null;
    const octet = Number(part);
    return Number.isInteger(octet) && octet >= 0 && octet <= 255 ? octet : null;
  });

  if (octets.some((octet) => octet === null)) return null;
  return octets.join('.');
}

export async function fetchPublicIpv4(
  fetcher: typeof fetch = globalThis.fetch,
): Promise<string | null> {
  if (typeof fetcher !== 'function') return null;

  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), PUBLIC_IPV4_TIMEOUT_MS);

  try {
    const response = await fetcher(PUBLIC_IPV4_URL, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) return null;

    const payload: unknown = await response.json();
    if (!isRecord(payload)) return null;
    return normalizeIpv4(payload.ip);
  } catch {
    return null;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

function readStoredVisitorId(): string | null {
  try {
    const storedValue = window.localStorage.getItem(VISITOR_STORAGE_KEY);
    if (!storedValue) return null;

    const parsedValue: unknown = JSON.parse(storedValue);
    if (!isRecord(parsedValue)) return null;

    return typeof parsedValue.visitorId === 'string' && UUID_V4_PATTERN.test(parsedValue.visitorId)
      ? parsedValue.visitorId
      : null;
  } catch {
    return null;
  }
}

function persistVisitorId(visitorId: string) {
  try {
    window.localStorage.setItem(
      VISITOR_STORAGE_KEY,
      JSON.stringify({ visitorId } satisfies StoredVisitor),
    );
  } catch {
    // Keep a stable in-memory identity when persistent storage is unavailable.
  }
}

function getVisitorId() {
  if (inMemoryVisitorId) return inMemoryVisitorId;

  const visitorId = readStoredVisitorId() ?? createUuidV4();
  inMemoryVisitorId = visitorId;
  persistVisitorId(visitorId);
  return visitorId;
}

export async function getVisitorRequestHeaders(): Promise<Record<string, string>> {
  const visitorId = getVisitorId();
  const publicIpv4 = await fetchPublicIpv4();
  const ipHash = await hashValue(publicIpv4 ?? visitorId);
  const userAgent = typeof navigator === 'undefined' ? 'unknown' : navigator.userAgent;

  return {
    'x-visitorId': visitorId,
    'x-ipHash': ipHash,
    'x-userAgent': userAgent,
    'x-lastSeenAt': String(Date.now()),
  };
}
