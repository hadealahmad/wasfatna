import { computed } from 'vue';
import { SYSTEM_THEME, type ColorScheme as ResolvedScheme } from '@/lib/theme';
import { useTheme } from '@/composables/useTheme';

export type ColorScheme = 'light' | 'dark' | 'light dark';
export type ResolvedColorScheme = ResolvedScheme;

export function useColorScheme() {
  const { themePreference, scheme, isDark, toasterTheme, setTheme } = useTheme();

  const colorScheme = computed<ColorScheme>(() =>
    themePreference.value === SYSTEM_THEME ? 'light dark' : scheme.value,
  );

  function toggleColorScheme(): void {
    setTheme(isDark.value ? 'light' : 'dark');
  }

  return {
    isDark,
    colorScheme,
    toasterTheme,
    toggleColorScheme,
  };
}
