import { onMounted, onUnmounted, readonly, ref } from 'vue';

// App-wide singleton state for global search and inline-search shortcut handoff.
// Mirrors syrianzone's `Lib/appShell.ts` + `MainLayout.tsx` shortcut ownership.
const isOpenState = ref(false);
const inlineSearchFocus = ref<(() => void) | null>(null);
const activeDialogHostId = ref<symbol | null>(null);

let activeShortcutListeners = 0;
let shortcutHandler: ((e: KeyboardEvent) => void) | null = null;

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName;
  if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
    return true;
  }
  if (target.isContentEditable) return true;
  return Boolean(target.closest('[contenteditable="true"], [role="textbox"]'));
}

export function openGlobalSearch(): void {
  isOpenState.value = true;
}

export function closeGlobalSearch(): void {
  isOpenState.value = false;
}

export function toggleGlobalSearch(): void {
  isOpenState.value = !isOpenState.value;
}

export function setGlobalSearchOpen(open: boolean): void {
  isOpenState.value = open;
}

/**
 * Register the active page's inline search focus callback so Ctrl/Cmd+K and "/"
 * focus it instead of opening the command palette. Returns an unregister helper.
 */
export function registerInlineSearch(fn: (() => void) | null): () => void {
  inlineSearchFocus.value = fn;

  return () => {
    if (fn && inlineSearchFocus.value === fn) {
      inlineSearchFocus.value = null;
    }
  };
}

export function unregisterInlineSearch(fn?: () => void): void {
  if (!fn || inlineSearchFocus.value === fn) {
    inlineSearchFocus.value = null;
  }
}

export function focusInlineSearch(): boolean {
  const focus = inlineSearchFocus.value;
  if (!focus) return false;
  focus();
  return true;
}

/**
 * Ensures only one `<GlobalSearch />` instance mounts the teleported dialog
 * when multiple triggers exist on the page.
 */
export function claimGlobalSearchDialogHost(id: symbol): void {
  if (activeDialogHostId.value === null) {
    activeDialogHostId.value = id;
  }
}

export function releaseGlobalSearchDialogHost(id: symbol): void {
  if (activeDialogHostId.value === id) {
    activeDialogHostId.value = null;
  }
}

export function isGlobalSearchDialogHost(id: symbol): boolean {
  return activeDialogHostId.value === id;
}

/**
 * Composable exposing the singleton global search state and actions.
 */
export function useGlobalSearch() {
  return {
    isOpen: readonly(isOpenState),
    open: openGlobalSearch,
    close: closeGlobalSearch,
    toggle: toggleGlobalSearch,
    setOpen: setGlobalSearchOpen,
    registerInlineSearch,
    unregisterInlineSearch,
    focusInlineSearch,
  };
}

/**
 * SSR-safe macOS detection for displaying `⌘ K` vs `Ctrl K`.
 */
export function useIsMac() {
  const isMac = ref(false);

  onMounted(() => {
    isMac.value =
      typeof navigator !== 'undefined' &&
      /Mac/i.test(navigator.platform || navigator.userAgent || '');
  });

  return readonly(isMac);
}

/**
 * Layout-level keyboard shortcut installer (Ctrl/Cmd+K and "/").
 * Call ONCE from the root layout; pages must NOT call this directly.
 */
export function useGlobalSearchShortcut(): void {
  onMounted(() => {
    if (typeof window === 'undefined') return;

    if (!shortcutHandler) {
      shortcutHandler = (e: KeyboardEvent) => {
        if (e.isComposing) return;

        const isCmdK =
          (e.metaKey || e.ctrlKey) &&
          !e.altKey &&
          (e.key.toLowerCase() === 'k' || e.code === 'KeyK');

        if (isCmdK) {
          e.preventDefault();
          if (focusInlineSearch()) return;
          toggleGlobalSearch();
          return;
        }

        const isSlash =
          e.key === '/' &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.altKey &&
          !e.shiftKey;

        if (isSlash && !isOpenState.value) {
          if (isEditableTarget(e.target)) return;
          if (document.querySelector('[role="dialog"][data-state="open"]')) return;
          e.preventDefault();
          if (focusInlineSearch()) return;
          openGlobalSearch();
        }
      };
    }

    if (activeShortcutListeners === 0) {
      window.addEventListener('keydown', shortcutHandler);
    }
    activeShortcutListeners += 1;
  });

  onUnmounted(() => {
    if (typeof window === 'undefined') return;
    activeShortcutListeners = Math.max(0, activeShortcutListeners - 1);
    if (activeShortcutListeners === 0 && shortcutHandler) {
      window.removeEventListener('keydown', shortcutHandler);
    }
  });
}
