export interface RandomizerRecipe {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  difficulty?: string | null;
  time_needed?: any;
  servings?: string | number | null;
  city?: { id?: number; name: string; slug?: string } | null;
  author?: { name: string } | null;
  tags?: Array<{ id: number; name: string; slug: string }>;
}

export type RarityKey = 'common' | 'rare' | 'epic' | 'legendary';

export interface RarityTier {
  key: RarityKey;
  label: string;
  subtitle: string;
  topBarClass: string;
  borderClass: string;
  badgeClass: string;
  glowClass: string;
  dotClass: string;
}

export const RARITY_TIERS: Record<RarityKey, RarityTier> = {
  common: {
    key: 'common',
    label: 'يومي سريع',
    subtitle: 'سهلة التحضير',
    topBarClass: 'bg-success',
    borderClass: 'border-success/50',
    badgeClass: 'bg-success/15 text-success border-success/30',
    glowClass: 'shadow-[0_0_32px_-8px_hsl(var(--success)/0.45)]',
    dotClass: 'bg-success',
  },
  rare: {
    key: 'rare',
    label: 'شامي أصيل',
    subtitle: 'متوسطة الصعوبة',
    topBarClass: 'bg-info',
    borderClass: 'border-info/50',
    badgeClass: 'bg-info/15 text-info border-info/30',
    glowClass: 'shadow-[0_0_32px_-8px_hsl(var(--info)/0.45)]',
    dotClass: 'bg-info',
  },
  epic: {
    key: 'epic',
    label: 'تراثي نادر',
    subtitle: 'وصفة متقنة',
    topBarClass: 'bg-chart-3',
    borderClass: 'border-chart-3/50',
    badgeClass: 'bg-chart-3/15 text-chart-3 border-chart-3/30',
    glowClass: 'shadow-[0_0_36px_-8px_hsl(var(--chart-3)/0.5)]',
    dotClass: 'bg-chart-3',
  },
  legendary: {
    key: 'legendary',
    label: 'أسطوري للعزائم',
    subtitle: 'أطباق المناسبات',
    topBarClass: 'bg-warning',
    borderClass: 'border-warning/60',
    badgeClass: 'bg-warning/15 text-warning border-warning/35',
    glowClass: 'shadow-[0_0_40px_-6px_hsl(var(--warning)/0.55)]',
    dotClass: 'bg-warning',
  },
};

export function getRecipeRarity(difficulty?: string | null): RarityTier {
  switch (difficulty) {
    case 'سهلة جداً':
    case 'سهلة':
      return RARITY_TIERS.common;
    case 'متوسطة':
      return RARITY_TIERS.rare;
    case 'صعبة':
      return RARITY_TIERS.epic;
    case 'صعبة جداً':
      return RARITY_TIERS.legendary;
    default:
      return RARITY_TIERS.rare;
  }
}

export function formatRandomizerTime(time: any): string | null {
  if (!time) return null;
  if (typeof time === 'string') {
    if (time.startsWith('{') || time.startsWith('[')) {
      try {
        return formatRandomizerTime(JSON.parse(time));
      } catch {
        return time;
      }
    }
    return time;
  }
  if (typeof time === 'number') return `${time} دقيقة`;
  if (Array.isArray(time)) return time.filter(Boolean).join('، ') || null;
  if (typeof time === 'object') {
    if (time.raw) return String(time.raw);
    const prep = parseInt(time.prep) || 0;
    const cook = parseInt(time.cook) || 0;
    const total = prep + cook;
    if (total > 0) return `${total} دقيقة`;
    const vals = Object.values(time).filter(Boolean);
    if (vals.length > 0) return vals.join(' + ');
  }
  return null;
}
