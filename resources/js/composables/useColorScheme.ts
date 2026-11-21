import { computed, ref } from 'vue';

export type ColorScheme = 'light' | 'dark' | 'light dark';
export type ResolvedColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'color-scheme';
const LEGACY_STORAGE_KEY = 'vueuse-color-scheme';
const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

const colorScheme = ref<ColorScheme>('light dark');
const systemScheme = ref<ResolvedColorScheme>('light');

const isDark = computed<boolean>(() => {
  if (colorScheme.value === 'dark') return true;
  if (colorScheme.value === 'light') return false;
  return systemScheme.value === 'dark';
});

const toasterTheme = computed<ResolvedColorScheme>(() => (isDark.value ? 'dark' : 'light'));

let initialized = false;

function getSystemScheme(): ResolvedColorScheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }
  return window.matchMedia(DARK_MEDIA_QUERY).matches ? 'dark' : 'light';
}

function readStoredScheme(): ResolvedColorScheme | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy === 'light' || legacy === 'dark') {
      window.localStorage.setItem(STORAGE_KEY, legacy);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      return legacy;
    }

    if (legacy === 'auto') {
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  } catch {
    // Ignore storage access errors (e.g. restricted storage)
  }

  return null;
}

function ensureMetaColorScheme(): HTMLMetaElement | null {
  if (typeof document === 'undefined' || !document.head) return null;

  let meta = document.head.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'color-scheme';
    meta.content = 'light dark';
    document.head.appendChild(meta);
  }
  return meta;
}

function applyToDom(): void {
  if (typeof document === 'undefined') return;

  const meta = ensureMetaColorScheme();
  if (meta && meta.content !== colorScheme.value) {
    meta.content = colorScheme.value;
  }

  document.documentElement.classList.toggle('dark', isDark.value);
}

function initColorScheme(): void {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  const mediaQuery =
    typeof window.matchMedia === 'function' ? window.matchMedia(DARK_MEDIA_QUERY) : null;

  systemScheme.value = mediaQuery?.matches ? 'dark' : 'light';
  colorScheme.value = readStoredScheme() ?? 'light dark';
  applyToDom();

  if (mediaQuery) {
    mediaQuery.addEventListener('change', (event: MediaQueryListEvent) => {
      systemScheme.value = event.matches ? 'dark' : 'light';
      if (colorScheme.value === 'light dark') {
        applyToDom();
      }
    });
  }

  window.addEventListener('storage', (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== LEGACY_STORAGE_KEY && event.key !== null) {
      return;
    }
    colorScheme.value = readStoredScheme() ?? 'light dark';
    applyToDom();
  });
}

function toggleColorScheme(): void {
  if (typeof window === 'undefined') return;
  initColorScheme();

  const currentSystem = getSystemScheme();
  systemScheme.value = currentSystem;

  const target: ResolvedColorScheme = isDark.value ? 'light' : 'dark';

  if (target === currentSystem) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Ignore storage access errors
    }
    colorScheme.value = 'light dark';
  } else {
    try {
      window.localStorage.setItem(STORAGE_KEY, target);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Ignore storage access errors
    }
    colorScheme.value = target;
  }

  applyToDom();
}

export function useColorScheme() {
  if (typeof window !== 'undefined') {
    initColorScheme();
  }

  return {
    isDark,
    colorScheme,
    toasterTheme,
    toggleColorScheme,
  };
}
