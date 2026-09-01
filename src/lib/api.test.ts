import { beforeEach, describe, expect, it, vi } from 'vitest';

const IPIFY_URL = 'https://api.ipify.org?format=json';
const TEST_API_BASE_URL = 'https://api.example.test/api';
const API_URL = `${TEST_API_BASE_URL}/resume-request`;

describe('portfolio API visitor metadata', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_API_BASE_URL', TEST_API_BASE_URL);
    window.localStorage.clear();
  });

  it('uses one freshly resolved IP hash in the resume header and body', async () => {
    let portfolioRequestInit: RequestInit | undefined;
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url === IPIFY_URL) {
        return new Response(JSON.stringify({ ip: '203.0.113.42' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (url === API_URL) {
        portfolioRequestInit = init;
        return new Response(JSON.stringify({
          statusCode: 202,
          message: 'Accepted',
          data: { result: 'queued', message: 'Accepted' },
        }), {
          status: 202,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      throw new Error(`Unexpected request to ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);
    const { API_BASE_URL, portfolioApi } = await import('@/lib/api');

    await portfolioApi.createResumeRequest({
      email: 'person@example.com',
      language: 'en',
      subscribeToUpdates: true,
    });

    const ipLookups = fetchMock.mock.calls.filter(([input]) => String(input) === IPIFY_URL);
    const headers = new Headers(portfolioRequestInit?.headers);
    const body = JSON.parse(String(portfolioRequestInit?.body)) as Record<string, unknown>;

    expect(API_BASE_URL).toBe(TEST_API_BASE_URL);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(ipLookups).toHaveLength(1);
    expect(headers.get('x-ipHash')).toBeTruthy();
    expect(body.ipHash).toBe(headers.get('x-ipHash'));
    expect(JSON.stringify(body)).not.toContain('203.0.113.42');
    expect(window.localStorage.getItem('visitor-portfolio')).not.toContain('ipHash');
  });

  it.each([
    ['', 'Missing required environment variable: VITE_API_BASE_URL'],
    ['not-a-url', 'VITE_API_BASE_URL must be a valid absolute URL'],
    ['http://api.example.test/api', 'VITE_API_BASE_URL must use HTTPS'],
    ['https://api.example.test/api/', 'VITE_API_BASE_URL must not end with a slash'],
  ])('rejects invalid API configuration %j', async (configuredUrl, expectedMessage) => {
    vi.stubEnv('VITE_API_BASE_URL', configuredUrl);

    await expect(import('@/lib/api')).rejects.toThrow(expectedMessage);
  });
});
