const RATE_LIMIT_STORAGE_KEY = 'portfolio:rate-limit-until';
const FALLBACK_BLOCK_DURATION_MS = 60 * 1000;

type Listener = () => void;

const listeners = new Set<Listener>();

function readStoredBlock(): number | null {
  if (typeof window === 'undefined') return null;

  try {
    const storedValue = window.localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    if (!storedValue) return null;

    const timestamp = Number(storedValue);
    if (!Number.isFinite(timestamp) || timestamp <= Date.now()) {
      window.localStorage.removeItem(RATE_LIMIT_STORAGE_KEY);
      return null;
    }

    return timestamp;
  } catch {
    return null;
  }
}

let blockedUntil = readStoredBlock();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function persistBlock(timestamp: number | null) {
  if (typeof window === 'undefined') return;

  try {
    if (timestamp === null) {
      window.localStorage.removeItem(RATE_LIMIT_STORAGE_KEY);
    } else {
      window.localStorage.setItem(RATE_LIMIT_STORAGE_KEY, String(timestamp));
    }
  } catch {
    // The in-memory block remains active if persistent storage is unavailable.
  }
}

export function activateRateLimit(missingTime: string | null) {
  const parsedTimestamp = missingTime ? Date.parse(missingTime) : Number.NaN;
  const now = Date.now();
  const responseBlock = Number.isFinite(parsedTimestamp) && parsedTimestamp > now
    ? parsedTimestamp
    : now + FALLBACK_BLOCK_DURATION_MS;
  const nextBlock = Math.max(blockedUntil ?? 0, responseBlock);

  if (nextBlock === blockedUntil) return;

  blockedUntil = nextBlock;
  persistBlock(blockedUntil);
  emitChange();
}

export function clearRateLimit(expectedTimestamp: number) {
  if (blockedUntil !== expectedTimestamp || Date.now() < expectedTimestamp) return;

  blockedUntil = null;
  persistBlock(null);
  emitChange();
}

export function subscribeToRateLimit(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getRateLimitSnapshot() {
  return blockedUntil;
}

export function getServerRateLimitSnapshot() {
  return null;
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== RATE_LIMIT_STORAGE_KEY) return;

    const nextBlock = readStoredBlock();
    if (nextBlock === blockedUntil) return;

    blockedUntil = nextBlock;
    emitChange();
  });
}
