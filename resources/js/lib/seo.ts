export const SITE_URL = 'https://food.syrian.zone';
export const SITE_NAME = 'وصفاتنا';
export const HOME_TITLE = 'وصفاتنا - مجتمع الطبخ السوري';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.webp`;
export const DEFAULT_DESCRIPTION =
  'اكتشف أشهى الوصفات السورية الأصيلة من مختلف المدن والمحافظات. تصفح المكونات وطرق التحضير خطوة بخطوة، وشارك وصفاتك مع مجتمع الطبخ السوري.';

const TITLE_SUFFIX = ` | ${SITE_NAME}`;

/**
 * Truncate text cleanly at a word boundary when exceeding maxLength.
 */
export function truncateAtWord(text: string, maxLength: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const slice = normalized.slice(0, Math.max(1, maxLength - 1));
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > Math.floor(maxLength * 0.5) ? slice.slice(0, lastSpace) : slice;

  return `${cut.trimEnd()}…`;
}

/**
 * Format an Arabic SEO <title> ending with "| وصفاتنا" (except the homepage) within ~60 chars.
 */
export function formatSeoTitle(title?: string | null, isHome = false): string {
  if (isHome) {
    return title?.trim() || HOME_TITLE;
  }

  const raw = (title || SITE_NAME).replace(/\s+/g, ' ').trim();
  const base = raw.endsWith(TITLE_SUFFIX)
    ? raw.slice(0, -TITLE_SUFFIX.length).trim()
    : raw;

  // A title that already names the site ("عن وصفاتنا") needs no "| وصفاتنا" suffix.
  if (base.includes(SITE_NAME)) {
    return truncateAtWord(base, 60);
  }

  const maxBaseLength = 60 - TITLE_SUFFIX.length;
  return `${truncateAtWord(base, maxBaseLength)}${TITLE_SUFFIX}`;
}

/**
 * Normalize and clamp a meta description to <= 160 characters.
 */
export function formatSeoDescription(
  description?: string | null,
  fallback = DEFAULT_DESCRIPTION,
): string {
  const normalized = (description || '').replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return truncateAtWord(fallback, 160);
  }

  return truncateAtWord(normalized, 160);
}

/**
 * Resolve a clean canonical https://food.syrian.zone URL without tracking or pagination query strings.
 */
export function resolveCanonicalUrl(pathOrUrl?: string | null, fallbackLocation?: string | null): string {
  const candidate = pathOrUrl?.trim() || fallbackLocation?.trim();
  if (!candidate) {
    return `${SITE_URL}/`;
  }

  let pathname = '/';
  if (/^https?:\/\//i.test(candidate)) {
    try {
      pathname = new URL(candidate).pathname || '/';
    } catch {
      pathname = '/';
    }
  } else {
    const withoutHash = candidate.split('#')[0] || '/';
    const withoutQuery = withoutHash.split('?')[0] || '/';
    pathname = withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;
  }

  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  return `${SITE_URL}${normalizedPath}`;
}

/**
 * Resolve an og:image / twitter:image URL to an absolute URL, falling back to /og-image.webp.
 */
export function resolveOgImageUrl(image?: string | null): string {
  const value = image?.trim();
  if (!value) {
    return DEFAULT_OG_IMAGE;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const cleanPath = value.startsWith('/') ? value : `/${value}`;
  return `${SITE_URL}${cleanPath}`;
}

export interface BreadcrumbEntry {
  name: string;
  path: string;
}

/**
 * Build a schema.org BreadcrumbList JSON-LD object.
 */
export function buildBreadcrumbSchema(entries: BreadcrumbEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: resolveCanonicalUrl(entry.path),
    })),
  };
}

export interface RecipeListEntry {
  name: string;
  slug: string;
}

/**
 * Build a schema.org ItemList for pages listing recipes.
 */
export function buildRecipeItemList(recipes: RecipeListEntry[]) {
  return {
    '@type': 'ItemList',
    numberOfItems: recipes.length,
    itemListElement: recipes.map((recipe, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: recipe.name,
      url: resolveCanonicalUrl(`/recipes/${recipe.slug}`),
    })),
  };
}
