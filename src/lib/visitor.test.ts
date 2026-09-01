import { beforeEach, describe, expect, it, vi } from 'vitest';

const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function ipResponse(ip: unknown) {
  return {
    ok: true,
    json: vi.fn().mockResolvedValue({ ip }),
  } as unknown as Response;
}

describe('visitor identity', () => {
  beforeEach(() => {
    vi.resetModules();
    window.localStorage.clear();
  });

  it('validates and normalizes IPv4 addresses', async () => {
    const { normalizeIpv4 } = await import('@/lib/visitor');

    expect(normalizeIpv4(' 203.0.113.42 ')).toBe('203.0.113.42');
    expect(normalizeIpv4('203.0.113.999')).toBeNull();
    expect(normalizeIpv4('2001:db8::1')).toBeNull();
    expect(normalizeIpv4({ ip: '203.0.113.42' })).toBeNull();
  });

  it('hashes a public IPv4 without persisting or sending the raw address', async () => {
    const fetchMock = vi.fn().mockResolvedValue(ipResponse('203.0.113.42'));
    vi.stubGlobal('fetch', fetchMock);
    const { getVisitorRequestHeaders } = await import('@/lib/visitor');

    const firstHeaders = await getVisitorRequestHeaders();
    const secondHeaders = await getVisitorRequestHeaders();
    const stored = JSON.parse(window.localStorage.getItem('visitor-portfolio') ?? '{}');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(firstHeaders['x-visitorId']).toMatch(UUID_V4_PATTERN);
    expect(firstHeaders['x-ipHash']).toBe(secondHeaders['x-ipHash']);
    expect(firstHeaders['x-ipHash']).not.toContain('203.0.113.42');
    expect(stored.ipHashSource).toBe('public-ipv4');
    expect(JSON.stringify(stored)).not.toContain('203.0.113.42');
  });

  it('falls back to hashing the visitor UUID when IPv4 lookup fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const { getVisitorRequestHeaders } = await import('@/lib/visitor');

    const headers = await getVisitorRequestHeaders();
    const stored = JSON.parse(window.localStorage.getItem('visitor-portfolio') ?? '{}');

    expect(headers['x-visitorId']).toMatch(UUID_V4_PATTERN);
    expect(headers['x-ipHash']).toBeTruthy();
    expect(stored.ipHashSource).toBe('visitor-id');
  });

  it('rejects an invalid lookup response and upgrades legacy stored visitors', async () => {
    window.localStorage.setItem('visitor-portfolio', JSON.stringify({
      visitorId: '3d594650-3436-4f38-8d58-e91f0e1c43ed',
      ipHash: 'legacy-hash',
      userAgent: 'legacy-agent',
      lastSeenAt: 1,
    }));
    const fetchMock = vi.fn().mockResolvedValue(ipResponse('not-an-ip'));
    vi.stubGlobal('fetch', fetchMock);
    const { getVisitorRequestHeaders } = await import('@/lib/visitor');

    const headers = await getVisitorRequestHeaders();
    const stored = JSON.parse(window.localStorage.getItem('visitor-portfolio') ?? '{}');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(headers['x-ipHash']).not.toBe('legacy-hash');
    expect(stored.ipHashSource).toBe('visitor-id');
    expect(stored.ipHashResolvedAt).toEqual(expect.any(Number));
  });
});
