import { Monitor, Sun, Moon, Palette } from 'lucide-vue-next';
import type { Component } from 'vue';
import themeData from '../../data/themes.json';

// The theme registry, storage keys, legacy keys, and font options live in
// resources/data/themes.json so the pre-paint script (resources/views/app.blade.php)
// and this module read the exact same source of truth. <html> carries data-theme
// (the resolved theme id), data-scheme (light | dark), and data-font (ibm-plex | system).

export type ThemeGroup = 'system' | 'standard' | 'heritage';
export type ThemeIconName = 'monitor' | 'sun' | 'moon' | 'palette';
export type ColorScheme = 'light' | 'dark';
export type FontPreference = 'ibm-plex' | 'system';

export interface FontOption {
  id: FontPreference;
  label: string;
}

export interface ThemeConfig {
  id: string;
  nameAr: string;
  nameEn: string;
  shortNameAr?: string;
  emoji: string;
  icon: Component;
  iconName: ThemeIconName;
  isDark: boolean;
  /** Swatch background for the theme picker: the theme's --background. */
  bg: string;
  /** Swatch accent for the theme picker: the theme's --primary. */
  primary: string;
  group: ThemeGroup;
}

export const THEME_KEY: string = themeData.theme.key;
export const SYSTEM_THEME: string = themeData.theme.system;
export const FONT_KEY: string = themeData.font.key;
export const DEFAULT_FONT: FontPreference =
  themeData.font.default === 'system' ? 'system' : 'ibm-plex';
export const LEGACY_THEME_KEYS: readonly string[] = themeData.legacyKeys;

export const FONT_OPTIONS: readonly FontOption[] = themeData.font.options.map((opt) => ({
  id: opt.id === 'system' ? 'system' : 'ibm-plex',
  label: opt.label,
}));

const THEME_ICONS: Record<ThemeIconName, Component> = {
  monitor: Monitor,
  sun: Sun,
  moon: Moon,
  palette: Palette,
};

type ThemeEntry = (typeof themeData.themes)[number];

function isThemeGroup(value: string): value is ThemeGroup {
  return value === 'system' || value === 'standard' || value === 'heritage';
}

function isThemeIconName(value: string): value is ThemeIconName {
  return value === 'monitor' || value === 'sun' || value === 'moon' || value === 'palette';
}

function toThemeConfig(entry: ThemeEntry): ThemeConfig {
  if (!isThemeIconName(entry.icon)) {
    throw new Error(`themes.json: theme "${entry.id}" names an unknown icon "${entry.icon}"`);
  }
  if (!isThemeGroup(entry.group)) {
    throw new Error(`themes.json: theme "${entry.id}" names an unknown group "${entry.group}"`);
  }
  return {
    id: entry.id,
    nameAr: entry.nameAr,
    nameEn: entry.nameEn,
    ...('shortNameAr' in entry ? { shortNameAr: entry.shortNameAr } : {}),
    emoji: entry.emoji,
    icon: THEME_ICONS[entry.icon],
    iconName: entry.icon,
    isDark: entry.isDark,
    bg: entry.bg,
    primary: entry.primary,
    group: entry.group,
  };
}

export const THEME_REGISTRY: ThemeConfig[] = themeData.themes.map(toThemeConfig);

const VALID_THEME_ID_SET = new Set<string>(THEME_REGISTRY.map((t) => t.id));
export const VALID_THEME_IDS: ReadonlySet<string> = VALID_THEME_ID_SET;

export function getThemeById(id: string): ThemeConfig | undefined {
  return THEME_REGISTRY.find((t) => t.id === id);
}

export function isValidThemeId(id: string | null | undefined): id is string {
  return typeof id === 'string' && VALID_THEME_ID_SET.has(id);
}

export function isFontPreference(value: string | null | undefined): value is FontPreference {
  return value === 'ibm-plex' || value === 'system';
}

export function colorSchemeOf(themeId: string): ColorScheme {
  return getThemeById(themeId)?.isDark ? 'dark' : 'light';
}

const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

function prefersDarkMode(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(DARK_MEDIA_QUERY).matches;
}

/**
 * Reads the stored theme preference, migrating legacy cooking color-scheme keys
 * ('color-scheme' / 'vueuse-color-scheme') if present.
 */
export function getThemePreference(): string {
  if (typeof window === 'undefined') return SYSTEM_THEME;

  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (isValidThemeId(saved)) {
      return saved;
    }

    for (const legacyKey of LEGACY_THEME_KEYS) {
      const legacy = window.localStorage.getItem(legacyKey);
      if (legacy === 'dark' || legacy === 'light') {
        window.localStorage.setItem(THEME_KEY, legacy);
        for (const k of LEGACY_THEME_KEYS) {
          window.localStorage.removeItem(k);
        }
        return legacy;
      }
      if (legacy === 'auto') {
        window.localStorage.setItem(THEME_KEY, SYSTEM_THEME);
        window.localStorage.removeItem(legacyKey);
        return SYSTEM_THEME;
      }
    }
  } catch {
    // Ignore storage access errors (e.g. restricted or unavailable storage)
  }

  return SYSTEM_THEME;
}

export function resolveTheme(pref: string): string {
  if (!isValidThemeId(pref) || pref === SYSTEM_THEME) {
    return prefersDarkMode() ? 'dark' : 'light';
  }
  return pref;
}

const themeListeners = new Set<() => void>();

function notifyThemeChanged(): void {
  for (const listener of themeListeners) {
    listener();
  }
}

export function subscribeToThemeChanges(listener: () => void): () => void {
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
  };
}

/**
 * Applies data-theme, data-scheme, and <meta name="color-scheme"> together on <html>.
 */
function applyThemeAttributes(themeId: string): void {
  if (typeof document === 'undefined') return;
  const resolvedId = isValidThemeId(themeId) && themeId !== SYSTEM_THEME ? themeId : 'light';
  const scheme = colorSchemeOf(resolvedId);
  const root = document.documentElement;
  root.setAttribute('data-theme', resolvedId);
  root.setAttribute('data-scheme', scheme);

  const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
  if (meta) {
    meta.setAttribute('content', scheme);
  }
}

export function applyResolvedTheme(pref?: string): void {
  const effectivePref = pref ?? getThemePreference();
  applyThemeAttributes(resolveTheme(effectivePref));
  notifyThemeChanged();
}

export function applyTheme(pref: string): void {
  const nextPref = isValidThemeId(pref) ? pref : SYSTEM_THEME;
  try {
    window.localStorage.setItem(THEME_KEY, nextPref);
    for (const legacyKey of LEGACY_THEME_KEYS) {
      window.localStorage.removeItem(legacyKey);
    }
  } catch {
    // Ignore storage access errors
  }
  applyThemeAttributes(resolveTheme(nextPref));
  notifyThemeChanged();
}

export function getThemeId(): string {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') || 'light';
}

export function getColorScheme(): ColorScheme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-scheme') === 'dark' ? 'dark' : 'light';
}

export function getFontPreference(): FontPreference {
  if (typeof window === 'undefined') return DEFAULT_FONT;
  try {
    const saved = window.localStorage.getItem(FONT_KEY);
    if (isFontPreference(saved)) {
      return saved;
    }
  } catch {
    // Ignore storage access errors
  }
  return DEFAULT_FONT;
}

export function applyFontAttribute(font: FontPreference): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-font', font);
}

export function applyFont(font: FontPreference): void {
  const nextFont: FontPreference = isFontPreference(font) ? font : DEFAULT_FONT;
  try {
    window.localStorage.setItem(FONT_KEY, nextFont);
  } catch {
    // Ignore storage access errors
  }
  applyFontAttribute(nextFont);
  notifyThemeChanged();
}

/**
 * Follows OS prefers-color-scheme changes while the preference is 'system'.
 */
export function watchSystemTheme(): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }
  const query = window.matchMedia(DARK_MEDIA_QUERY);
  const onChange = () => {
    if (getThemePreference() === SYSTEM_THEME) {
      applyThemeAttributes(resolveTheme(SYSTEM_THEME));
      notifyThemeChanged();
    }
  };
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** Parses an app.css HSL token value (`203 13.3% 11.8%`, alpha optional) into RGBA channels. */
function parseHslToken(value: string): Rgba | null {
  const match = value
    .trim()
    .match(/^([\d.]+)[\s,]+([\d.]+)%[\s,]+([\d.]+)%(?:\s*\/\s*([\d.]+)%)?$/);
  if (!match) return null;
  const hue = Number(match[1]) / 30;
  const saturation = Number(match[2]) / 100;
  const lightness = Number(match[3]) / 100;
  const a = saturation * Math.min(lightness, 1 - lightness);
  const channel = (n: number) => {
    const k = (n + hue) % 12;
    const val = lightness - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(val * 255);
  };
  return {
    r: channel(0),
    g: channel(8),
    b: channel(4),
    a: match[4] === undefined ? 1 : Number(match[4]) / 100,
  };
}

function readTokenChannels(variable: string, themeId?: string): Rgba | null {
  if (typeof document === 'undefined') return null;
  const root = document.documentElement;
  if (themeId !== undefined && root.getAttribute('data-theme') !== themeId) return null;
  return parseHslToken(getComputedStyle(root).getPropertyValue(variable));
}

export function readThemeColor(variable: string, themeId?: string): string | null {
  const color = readTokenChannels(variable, themeId);
  if (!color) return null;
  return color.a === 1
    ? `rgb(${color.r}, ${color.g}, ${color.b})`
    : `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}

export function readThemeRgb(variable: string, themeId?: string): string | null {
  const color = readTokenChannels(variable, themeId);
  return color ? `${color.r}, ${color.g}, ${color.b}` : null;
}
