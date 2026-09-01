export const PAGE_PATHS = {
  home: '/',
  hobbies: '/hobbies',
  architecture: '/architecture',
  resume: '/resume',
} as const;

export type PageId = keyof typeof PAGE_PATHS;

const PATH_PAGES = new Map<string, PageId>(
  Object.entries(PAGE_PATHS).map(([page, path]) => [path, page as PageId]),
);

function normalizePathname(pathname: string) {
  const path = pathname.split(/[?#]/, 1)[0] || '/';
  return path === '/' ? path : path.replace(/\/+$/, '') || '/';
}

export function getPageFromPathname(pathname: string): PageId | null {
  return PATH_PAGES.get(normalizePathname(pathname)) ?? null;
}

export function getPathForPage(page: PageId) {
  return PAGE_PATHS[page];
}
