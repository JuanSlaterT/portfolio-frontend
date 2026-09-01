import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('rate-limit persistence', () => {
  beforeEach(() => {
    vi.resetModules();
    window.localStorage.clear();
  });

  it('persists the server deadline and clears it only after expiration', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-31T12:00:00Z'));
    const rateLimit = await import('@/lib/rateLimit');
    const deadline = Date.parse('2026-08-31T12:05:00Z');

    rateLimit.activateRateLimit('2026-08-31T12:05:00Z');

    expect(rateLimit.getRateLimitSnapshot()).toBe(deadline);
    expect(window.localStorage.getItem('portfolio:rate-limit-until')).toBe(String(deadline));

    rateLimit.clearRateLimit(deadline);
    expect(rateLimit.getRateLimitSnapshot()).toBe(deadline);

    vi.setSystemTime(deadline);
    rateLimit.clearRateLimit(deadline);
    expect(rateLimit.getRateLimitSnapshot()).toBeNull();
    expect(window.localStorage.getItem('portfolio:rate-limit-until')).toBeNull();
  });

  it('rejects malformed persisted deadlines', async () => {
    window.localStorage.setItem('portfolio:rate-limit-until', 'tampered-value');

    const rateLimit = await import('@/lib/rateLimit');

    expect(rateLimit.getRateLimitSnapshot()).toBeNull();
    expect(window.localStorage.getItem('portfolio:rate-limit-until')).toBeNull();
  });
});
