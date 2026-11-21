import { computed, ref } from 'vue';
import {
  DEFAULT_FONT,
  DEFAULT_THEME,
  FONT_KEY,
  LEGACY_THEME_KEYS,
  THEME_KEY,
  applyFont,
  applyFontAttribute,
  applyResolvedTheme,
  applyTheme,
  colorSchemeOf,
  getFontPreference,
  getThemePreference,
  resolveTheme,
  subscribeToThemeChanges,
  watchSystemTheme,
  type ColorScheme,
  type FontPreference,
} from '@/lib/theme';

const themePreference = ref<string>(DEFAULT_THEME);
const theme = ref<string>(DEFAULT_THEME);
const scheme = ref<ColorScheme>(colorSchemeOf(DEFAULT_THEME));
const font = ref<FontPreference>(DEFAULT_FONT);

const isDark = computed<boolean>(() => scheme.value === 'dark');
const toasterTheme = computed<ColorScheme>(() => scheme.value);

let initialized = false;

function syncFromEnvironment(): void {
  const pref = getThemePreference();
  const resolved = resolveTheme(pref);
  const nextScheme = colorSchemeOf(resolved);
  const nextFont = getFontPreference();

  themePreference.value = pref;
  theme.value = resolved;
  scheme.value = nextScheme;
  font.value = nextFont;
}

function initTheme(): void {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  syncFromEnvironment();
  applyResolvedTheme(themePreference.value);
  applyFontAttribute(font.value);

  subscribeToThemeChanges(syncFromEnvironment);
  watchSystemTheme();

  window.addEventListener('storage', (event: StorageEvent) => {
    const watchedKeys = new Set<string>([THEME_KEY, FONT_KEY, ...LEGACY_THEME_KEYS]);
    if (event.key !== null && !watchedKeys.has(event.key)) {
      return;
    }
    const nextPref = getThemePreference();
    const nextFont = getFontPreference();
    applyResolvedTheme(nextPref);
    applyFontAttribute(nextFont);
    syncFromEnvironment();
  });
}

function setTheme(pref: string): void {
  if (typeof window === 'undefined') return;
  initTheme();
  applyTheme(pref);
  syncFromEnvironment();
}

function setFont(nextFont: FontPreference): void {
  if (typeof window === 'undefined') return;
  initTheme();
  applyFont(nextFont);
  syncFromEnvironment();
}

export function useTheme() {
  if (typeof window !== 'undefined') {
    initTheme();
  }

  return {
    theme,
    themePreference,
    scheme,
    font,
    isDark,
    toasterTheme,
    setTheme,
    setFont,
  };
}
