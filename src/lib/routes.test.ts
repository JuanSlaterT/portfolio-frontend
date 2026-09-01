import { describe, expect, it } from 'vitest';
import { getPageFromPathname, getPathForPage, PAGE_PATHS } from '@/lib/routes';

describe('portfolio routes', () => {
  it('maps every page to its public path', () => {
    expect(PAGE_PATHS).toEqual({
      home: '/',
      hobbies: '/hobbies',
      architecture: '/architecture',
      resume: '/resume',
    });
  });

  it.each([
    ['/', 'home'],
    ['/hobbies', 'hobbies'],
    ['/hobbies/', 'hobbies'],
    ['/architecture', 'architecture'],
    ['/architecture/', 'architecture'],
    ['/resume', 'resume'],
  ] as const)('resolves %s to %s', (pathname, page) => {
    expect(getPageFromPathname(pathname)).toBe(page);
  });

  it('rejects unknown paths and returns paths for known pages', () => {
    expect(getPageFromPathname('/missing')).toBeNull();
    expect(getPathForPage('architecture')).toBe('/architecture');
  });
});
