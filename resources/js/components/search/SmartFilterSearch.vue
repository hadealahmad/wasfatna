<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useId, watch } from 'vue';
import { Check, ChevronLeft, ChevronRight, Loader2, Search, SlidersHorizontal, X } from 'lucide-vue-next';
import { PopoverAnchor, PopoverContent, PopoverPortal } from 'radix-vue';
import { Button, Input, Popover } from '@/components/ui';
import { cn } from '@/lib/utils';
import { registerInlineSearch } from '@/composables/useGlobalSearch';
import FilterChipGroup from './FilterChipGroup.vue';
import {
  matchesFilterText,
  parseFilterDraft,
  toggleFilterValue,
  type SmartFilterFacet,
  type SmartFilterOption,
  type SmartFilterValue,
} from './smartFilter';

interface Props {
  facets: readonly SmartFilterFacet[];
  modelValue: SmartFilterValue;
  placeholder?: string;
  ariaLabel?: string;
  resultCount?: number;
  resultLabel?: string;
  loading?: boolean;
  embedded?: boolean;
  mobileFiltersScroll?: boolean;
  registerShortcut?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'ابحث أو اختر تصفية…',
  ariaLabel: 'البحث والتصفية',
  resultLabel: 'نتيجة',
  loading: false,
  embedded: false,
  mobileFiltersScroll: false,
  registerShortcut: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: SmartFilterValue): void;
}>();

type Suggestion =
  | { kind: 'search'; id: string; label: string }
  | { kind: 'facet'; id: string; label: string; facet: SmartFilterFacet }
  | { kind: 'option'; id: string; label: string; facet: SmartFilterFacet; option: SmartFilterOption };

function sameValue(a: SmartFilterValue, b: SmartFilterValue, facets: readonly SmartFilterFacet[]): boolean {
  if (a.search !== b.search || (a.sort ?? '') !== (b.sort ?? '')) return false;
  return facets.every(({ key }) => {
    const left = a.filters[key] ?? [];
    const right = b.filters[key] ?? [];
    return left.length === right.length && left.every((val) => right.includes(val));
  });
}

const uid = useId();
const listId = `${uid}-suggestions`;
const headingId = `${uid}-heading`;
const hintId = `${uid}-hint`;

const inputRef = ref<HTMLInputElement | null>(null);
const fieldRef = ref<HTMLDivElement | null>(null);
const facetInputRefs = new Map<string, HTMLInputElement>();

const lastValue = ref<SmartFilterValue>(props.modelValue);
const draft = ref(props.modelValue.search);
const editingKey = ref<string | null>(null);
const filterQuery = ref('');
const open = ref(false);
const dismissed = ref(false);
const browse = ref(false);
const active = ref(-1);
const announcement = ref('');

let unregisterShortcut: (() => void) | null = null;

function focusMainInput() {
  const el = fieldRef.value?.querySelector<HTMLInputElement>('input[data-smart-search-input="true"]');
  el?.focus();
}

onMounted(() => {
  if (props.registerShortcut) {
    unregisterShortcut = registerInlineSearch(() => {
      focusMainInput();
    });
  }
});

onUnmounted(() => {
  unregisterShortcut?.();
  unregisterShortcut = null;
});

watch(
  () => props.modelValue,
  (next) => {
    if (sameValue(lastValue.value, next, props.facets)) return;
    lastValue.value = next;
    draft.value = next.search;
    editingKey.value = null;
    filterQuery.value = '';
    open.value = false;
    active.value = -1;
  },
  { deep: true },
);

watch(editingKey, async (key) => {
  if (!key) return;
  await nextTick();
  facetInputRefs.get(key)?.focus();
});

const parsed = computed(() => parseFilterDraft(draft.value, props.facets));
const editingFacet = computed(() => props.facets.find((f) => f.key === editingKey.value));
const chosenCount = computed(() =>
  props.facets.reduce((sum, facet) => sum + (props.modelValue.filters[facet.key]?.length ?? 0), 0),
);
const hasChips = computed(() =>
  props.facets.some(
    (facet) =>
      facet.key === editingKey.value ||
      facet.options.some((opt) => props.modelValue.filters[facet.key]?.includes(opt.value)),
  ),
);

function selectedOptionsForFacet(facet: SmartFilterFacet): SmartFilterOption[] {
  const chosen = props.modelValue.filters[facet.key] ?? [];
  return facet.options.filter((o) => chosen.includes(o.value));
}

const rows = computed<Suggestion[]>(() => {
  const items: Suggestion[] = [];
  const facet = editingFacet.value;
  if (facet && !browse.value) {
    return facet.options
      .filter((o) => matchesFilterText(o.label, filterQuery.value))
      .map((option) => ({
        kind: 'option' as const,
        id: JSON.stringify([facet.key, option.value]),
        label: option.label,
        facet,
        option,
      }));
  }

  if (draft.value.trim() && !browse.value) {
    items.push({ kind: 'search', id: 'search', label: draft.value.trim() });
  }

  const query = browse.value ? '' : parsed.value.query || draft.value.trim();
  for (const f of props.facets) {
    if (!query || [f.label, ...(f.aliases ?? [])].some((name) => matchesFilterText(name, query))) {
      items.push({ kind: 'facet', id: `facet-${f.key}`, label: f.label, facet: f });
    }
  }

  if (query) {
    for (const f of props.facets) {
      for (const option of f.options) {
        if (matchesFilterText(option.label, query)) {
          items.push({
            kind: 'option',
            id: JSON.stringify([f.key, option.value]),
            label: option.label,
            facet: f,
            option,
          });
        }
      }
    }
  }

  return items.length === 1 && items[0].kind === 'search' ? [] : items;
});

const activeRow = computed(() => rows.value[active.value]);
const menuOpen = computed(() => !dismissed.value && open.value && rows.value.length > 0);
const heading = computed(() =>
  !browse.value && editingFacet.value ? editingFacet.value.label : 'البحث والتصفيات',
);

function optionId(row: Suggestion): string {
  return `${listId}-${encodeURIComponent(row.id)}`;
}

watch([menuOpen, activeRow], () => {
  if (!menuOpen.value || !activeRow.value) return;
  document.getElementById(optionId(activeRow.value))?.scrollIntoView({ block: 'nearest' });
});

function emitValue(next: SmartFilterValue) {
  lastValue.value = next;
  emit('update:modelValue', next);
}

function editDraft(next: string) {
  dismissed.value = false;
  const expression = parseFilterDraft(next, props.facets);
  draft.value = expression.search;
  editingKey.value = expression.facet?.key ?? null;
  filterQuery.value = expression.facet ? expression.query : '';
  browse.value = false;
  open.value = true;
  active.value = 0;
  emitValue({ ...props.modelValue, search: expression.search });
}

function showGroups() {
  dismissed.value = false;
  focusMainInput();
  editingKey.value = null;
  filterQuery.value = '';
  browse.value = true;
  active.value = -1;
  open.value = true;
}

function chips(): HTMLElement[] {
  return Array.from(fieldRef.value?.querySelectorAll<HTMLElement>('[data-filter-key]') ?? []);
}

function focusSearch() {
  focusMainInput();
  editingKey.value = null;
  filterQuery.value = '';
  open.value = false;
  active.value = -1;
}

function focusChip(key: string) {
  const chip = chips().find((element) => element.dataset.filterKey === key);
  if (!chip || !props.modelValue.filters[key]?.length) {
    focusSearch();
    return;
  }
  chip.focus();
  chip.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

// Facets follow DOM order; ArrowLeft moves forward in this RTL field.
function focusSibling(key: string | null, step: -1 | 1) {
  const elements = chips();
  const index = key === null ? elements.length : elements.findIndex((el) => el.dataset.filterKey === key);
  const next = elements[index + step];
  if (next?.dataset.filterKey) {
    focusChip(next.dataset.filterKey);
  } else if (step === 1) {
    focusSearch();
  }
}

function openFacet(facet: SmartFilterFacet, activeIndex = -1) {
  dismissed.value = false;
  editingKey.value = facet.key;
  filterQuery.value = '';
  browse.value = false;
  open.value = true;
  active.value = activeIndex;
  nextTick(() => {
    facetInputRefs.get(facet.key)?.focus();
  });
}

function leaveEditor() {
  if (editingKey.value) {
    focusChip(editingKey.value);
  } else {
    focusSearch();
  }
}

function choose(row: Suggestion) {
  if (row.kind === 'facet') {
    const leading = browse.value ? draft.value.trimEnd() : parsed.value.leading;
    draft.value = leading;
    editingKey.value = row.facet.key;
    filterQuery.value = '';
    emitValue({ ...props.modelValue, search: leading });
    browse.value = false;
    active.value = 0;
    return;
  }

  if (row.kind === 'search') {
    emitValue({ ...props.modelValue, search: draft.value });
    focusMainInput();
    open.value = false;
    return;
  }

  const selected = props.modelValue.filters[row.facet.key]?.includes(row.option.value);
  const search = editingFacet.value
    ? draft.value
    : matchesFilterText(row.option.label, draft.value.trim())
      ? ''
      : parsed.value.leading;

  draft.value = search;
  emitValue({ ...toggleFilterValue(props.modelValue, row.facet, row.option.value), search });
  announcement.value = `${selected ? 'أُزيلت' : 'أُضيفت'} تصفية ${row.facet.label}: ${row.label}`;

  if (row.facet.selectionMode === 'multiple') {
    editingKey.value = row.facet.key;
    filterQuery.value = '';
    browse.value = false;
    active.value = row.facet.options.findIndex((o) => o.value === row.option.value);
  } else {
    editingKey.value = null;
    filterQuery.value = '';
    focusMainInput();
    open.value = false;
  }
}

function removeOption(facet: SmartFilterFacet, option: SmartFilterOption, keyboard = false) {
  if (keyboard) {
    const chip = chips().find((element) => element.dataset.filterKey === facet.key);
    const buttons = Array.from(chip?.querySelectorAll<HTMLButtonElement>('[data-filter-value]') ?? []);
    const index = buttons.findIndex((button) => button.dataset.filterValue === option.value);
    const next = buttons[index + 1] ?? buttons[index - 1];
    if (next) next.focus();
    else focusSibling(facet.key, 1);
  }

  emitValue(toggleFilterValue(props.modelValue, facet, option.value));
  announcement.value = `أُزيلت تصفية ${facet.label}: ${option.label}`;

  if (keyboard) return;
  openFacet(facet, -1);
}

function removeFacet(facet: SmartFilterFacet) {
  focusSibling(facet.key, 1);
  const filters = { ...props.modelValue.filters };
  delete filters[facet.key];
  emitValue({ ...props.modelValue, filters });
  editingKey.value = null;
  filterQuery.value = '';
  announcement.value = `أُزيلت تصفية ${facet.label} بالكامل`;
  open.value = false;
}

function clearAll() {
  const own = new Set(props.facets.map((facet) => facet.key));
  const filters = Object.fromEntries(
    Object.entries(props.modelValue.filters).filter(([key]) => !own.has(key)),
  );
  draft.value = '';
  editingKey.value = null;
  filterQuery.value = '';
  emitValue({ ...props.modelValue, search: '', filters });
  announcement.value = 'مُسح البحث والتصفيات';
  focusMainInput();
  open.value = false;
}

function chipKeyDown(event: KeyboardEvent, facet: SmartFilterFacet) {
  if (
    event.target instanceof HTMLInputElement ||
    event.isComposing ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  ) {
    return;
  }

  const target = event.target as HTMLElement;
  const option = facet.options.find((item) => item.value === target.dataset.filterValue);

  if (event.key === 'Delete' || event.key === 'Backspace') {
    event.preventDefault();
    if (option) removeOption(facet, option, true);
    else removeFacet(facet);
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    const step = event.key === 'ArrowLeft' ? 1 : -1;
    if (option) {
      const chipEl = event.currentTarget as HTMLElement;
      const buttons = Array.from(chipEl.querySelectorAll<HTMLButtonElement>('[data-filter-value]'));
      const next = buttons[buttons.indexOf(target as HTMLButtonElement) + step];
      if (next) next.focus();
      else if (step === 1) openFacet(facet);
      else focusChip(facet.key);
    } else {
      focusSibling(facet.key, step);
    }
  } else if (
    event.key === 'ArrowDown' ||
    event.key === 'ArrowUp' ||
    (target === event.currentTarget && (event.key === 'Enter' || event.key === ' '))
  ) {
    event.preventDefault();
    openFacet(
      facet,
      event.key === 'ArrowUp' ? facet.options.length - 1 : event.key === 'ArrowDown' ? 0 : -1,
    );
  } else if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    if (target === event.currentTarget) focusSearch();
    else focusChip(facet.key);
  }
}

function chipFocus(event: FocusEvent, facet: SmartFilterFacet) {
  if (event.target instanceof HTMLInputElement) return;
  if (!selectedOptionsForFacet(facet).length) {
    focusSearch();
    return;
  }
  editingKey.value = null;
  filterQuery.value = '';
  browse.value = false;
  open.value = false;
  active.value = -1;
}

function onInputKeyDown(event: KeyboardEvent) {
  if (event.isComposing) return;
  if (event.key !== 'Tab' && (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)) return;

  const input = event.currentTarget as HTMLInputElement;
  const collapsed = input.selectionStart === input.selectionEnd;

  if (collapsed && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
    if (!input.value && menuOpen.value && activeRow.value?.kind === 'facet' && event.key === 'ArrowLeft') {
      event.preventDefault();
      choose(activeRow.value);
      return;
    }

    if (event.key === 'ArrowRight' && input.selectionStart === 0) {
      if (editingFacet.value) {
        event.preventDefault();
        const chip = chips().find((element) => element.dataset.filterKey === editingFacet.value?.key);
        const buttons = chip?.querySelectorAll<HTMLButtonElement>('[data-filter-value]');
        if (buttons?.length) buttons[buttons.length - 1].focus();
        else showGroups();
      } else if (hasChips.value) {
        event.preventDefault();
        focusSibling(null, -1);
      }
      return;
    }

    if (editingFacet.value && event.key === 'ArrowLeft' && input.selectionEnd === input.value.length) {
      event.preventDefault();
      focusSibling(editingFacet.value.key, 1);
      return;
    }
  }

  if (event.key === 'Backspace' && !input.value && collapsed) {
    if (editingFacet.value) {
      const chip = chips().find((element) => element.dataset.filterKey === editingFacet.value?.key);
      const buttons = chip?.querySelectorAll<HTMLButtonElement>('[data-filter-value]');
      if (buttons?.length) {
        event.preventDefault();
        buttons[buttons.length - 1].focus();
      } else {
        event.preventDefault();
        leaveEditor();
      }
    } else if (hasChips.value) {
      event.preventDefault();
      focusSibling(null, -1);
    }
    return;
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    dismissed.value = false;
    open.value = true;
    const step = event.key === 'ArrowDown' ? 1 : -1;
    if (!rows.value.length) {
      active.value = -1;
    } else if (!menuOpen.value || active.value < 0) {
      active.value = step > 0 ? 0 : rows.value.length - 1;
    } else {
      active.value = (active.value + step + rows.value.length) % rows.value.length;
    }
  } else if (event.key === 'Enter') {
    event.preventDefault();
    if (menuOpen.value && activeRow.value) {
      choose(activeRow.value);
    } else {
      open.value = false;
    }
  } else if (event.key === 'Escape' && (open.value || editingFacet.value)) {
    event.preventDefault();
    event.stopPropagation();
    leaveEditor();
  } else if (event.key === 'Tab') {
    open.value = false;
    if (editingFacet.value && !props.modelValue.filters[editingFacet.value.key]?.length) {
      event.preventDefault();
      focusSearch();
    }
  }
}

function setFacetInputRef(key: string, el: unknown) {
  const node = el instanceof HTMLInputElement
    ? el
    : (el as { $el?: unknown } | null)?.$el instanceof HTMLInputElement
      ? ((el as { $el: HTMLInputElement }).$el)
      : null;

  if (node) {
    facetInputRefs.set(key, node);
  } else {
    facetInputRefs.delete(key);
  }
}

function toggleBrowseMenu() {
  dismissed.value = false;
  if (menuOpen.value && browse.value) {
    open.value = false;
  } else {
    showGroups();
  }
}

function handleInteractOutside(e: Event) {
  const target = e.target as Node | null;
  if (target && fieldRef.value?.contains(target)) {
    e.preventDefault();
  }
}
</script>

<template>
  <div :class="$props.class">
    <Popover :open="menuOpen" @update:open="open = $event">
      <PopoverAnchor as-child>
        <div
          ref="fieldRef"
          :class="cn(
            'flex min-w-0 flex-wrap items-center gap-1.5 rounded-xl border border-input bg-card p-2 shadow-sm transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 sm:gap-2 sm:p-2.5',
            embedded && 'rounded-none border-0 bg-transparent shadow-none focus-within:ring-0',
          )"
        >
          <Loader2
            v-if="loading"
            class="ms-1 h-4 w-4 shrink-0 animate-spin text-primary"
            aria-hidden="true"
          />
          <Search
            v-else
            class="ms-1 hidden h-4 w-4 shrink-0 text-muted-foreground sm:block"
            aria-hidden="true"
          />

          <div
            v-if="hasChips"
            role="group"
            aria-label="التصفيات المطبقة"
            :class="mobileFiltersScroll
              ? 'flex min-w-0 max-w-full basis-full flex-nowrap items-center gap-1.5 overflow-x-auto overflow-y-hidden overscroll-x-contain p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:contents'
              : 'contents'"
          >
            <template v-for="facet in facets" :key="facet.key">
              <FilterChipGroup
                v-if="selectedOptionsForFacet(facet).length > 0 || editingKey === facet.key"
                :label="facet.label"
                :options="selectedOptionsForFacet(facet)"
                :input-id="`${uid}-facet-${encodeURIComponent(facet.key)}`"
                :data-filter-key="facet.key"
                :hint-id="hintId"
                :class="mobileFiltersScroll ? 'max-sm:max-w-none max-sm:shrink-0 max-sm:whitespace-nowrap' : undefined"
                @keydown="chipKeyDown($event, facet)"
                @focus="chipFocus($event, facet)"
                @remove="removeOption(facet, selectedOptionsForFacet(facet).find((o) => o.value === $event)!)"
                @clear="removeFacet(facet)"
              >
                <Input
                  :id="`${uid}-facet-${encodeURIComponent(facet.key)}`"
                  :ref="(el) => setFacetInputRef(facet.key, el)"
                  :model-value="editingKey === facet.key ? filterQuery : ''"
                  :size="editingKey === facet.key ? Math.max(1, filterQuery.length + 1) : 1"
                  autocomplete="off"
                  inputmode="search"
                  enterkeyhint="done"
                  role="combobox"
                  :aria-label="`بحث في ${facet.label}`"
                  :aria-describedby="hintId"
                  :aria-expanded="editingKey === facet.key && menuOpen"
                  :aria-controls="editingKey === facet.key && menuOpen ? listId : undefined"
                  aria-autocomplete="list"
                  :aria-activedescendant="editingKey === facet.key && menuOpen && activeRow ? optionId(activeRow) : undefined"
                  :class="cn(
                    'h-7 min-h-7 rounded-none border-0 bg-transparent py-0 text-xs shadow-none focus-visible:ring-0 focus-visible:outline-none',
                    editingKey === facet.key && filterQuery
                      ? 'w-auto min-w-0 max-w-32 px-0.5'
                      : 'absolute end-0 w-px min-w-0 max-w-px p-0 opacity-0',
                  )"
                  @focus="() => {
                    if (editingKey !== facet.key) { filterQuery = ''; active = -1; }
                    dismissed = false;
                    editingKey = facet.key;
                    browse = false;
                    open = true;
                  }"
                  @update:model-value="(val) => { filterQuery = String(val); active = 0; dismissed = false; open = true; }"
                  @keydown="onInputKeyDown"
                />
              </FilterChipGroup>
            </template>
          </div>

          <input
            ref="inputRef"
            data-smart-search-input="true"
            type="text"
            :value="draft"
            role="combobox"
            :aria-expanded="!editingKey && menuOpen"
            :aria-controls="!editingKey && menuOpen ? listId : undefined"
            aria-autocomplete="list"
            :aria-activedescendant="!editingKey && menuOpen && activeRow ? optionId(activeRow) : undefined"
            :aria-label="ariaLabel"
            :aria-describedby="hintId"
            :placeholder="placeholder"
            autocomplete="off"
            inputmode="search"
            enterkeyhint="search"
            dir="rtl"
            class="h-9 min-w-[min(100%,8rem)] flex-1 basis-32 border-0 bg-transparent px-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            @input="editDraft(($event.target as HTMLInputElement).value)"
            @focus="() => { dismissed = false; editingKey = null; filterQuery = ''; open = true; active = -1; }"
            @keydown="onInputKeyDown"
          />

          <div class="ms-auto flex shrink-0 items-center gap-1.5">
            <span
              v-if="resultCount !== undefined"
              class="hidden items-center rounded-lg bg-muted px-2 py-1 text-xs font-medium text-muted-foreground tabular-nums sm:inline-flex"
            >
              {{ resultCount }} {{ resultLabel }}
            </span>

            <Button
              v-if="chosenCount > 0 || draft.length > 0 || editingKey"
              type="button"
              variant="ghost"
              size="icon"
              class="h-9 w-9 text-muted-foreground hover:bg-transparent hover:text-foreground"
              aria-label="مسح البحث والتصفيات"
              @click="clearAll"
            >
              <X class="h-3.5 w-3.5" stroke-width="1.5" aria-hidden="true" />
            </Button>

            <Button
              type="button"
              variant="outline"
              class="h-9 w-9 gap-0 px-0 text-xs text-muted-foreground hover:bg-accent hover:text-foreground sm:w-auto sm:gap-1.5 sm:px-2.5"
              aria-label="التصفيات"
              title="التصفيات"
              aria-haspopup="listbox"
              :aria-expanded="menuOpen"
              :aria-controls="menuOpen ? listId : undefined"
              @click="toggleBrowseMenu"
            >
              <SlidersHorizontal class="h-4 w-4" aria-hidden="true" />
              <span class="sr-only sm:not-sr-only">التصفيات</span>
              <span
                v-if="chosenCount > 0"
                class="hidden tabular-nums font-semibold text-primary sm:inline"
                :aria-label="`${chosenCount} تصفيات مختارة`"
              >
                {{ chosenCount }}
              </span>
            </Button>
          </div>
        </div>
      </PopoverAnchor>

      <PopoverPortal>
        <PopoverContent
          align="start"
          side="bottom"
          :collision-padding="16"
          :side-offset="8"
          role="region"
          aria-label="اقتراحات البحث والتصفية"
          dir="rtl"
          class="z-50 flex max-h-[min(26rem,var(--radix-popover-content-available-height))] w-[min(28rem,var(--radix-popover-trigger-width))] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-border bg-popover/95 p-1.5 text-popover-foreground shadow-lg backdrop-blur supports-[backdrop-filter]:bg-popover/85 outline-none"
          @open-auto-focus.prevent
          @close-auto-focus.prevent
          @escape-key-down.prevent="leaveEditor"
          @interact-outside="handleInteractOutside"
        >
          <div class="flex min-h-10 shrink-0 items-center gap-2 border-b border-border px-2 pb-1.5">
            <Button
              v-if="editingFacet && !browse"
              type="button"
              variant="ghost"
              size="icon"
              class="h-8 w-8 shrink-0 rounded-full p-0 text-muted-foreground hover:text-foreground"
              aria-label="العودة إلى مجموعات التصفيات"
              title="العودة إلى التصفيات"
              @click="showGroups"
            >
              <ChevronRight class="h-4 w-4" aria-hidden="true" />
            </Button>
            <span :id="headingId" class="min-w-0 flex-1 text-sm font-semibold">
              {{ heading }}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              class="h-8 w-8 shrink-0 rounded-full p-0 text-muted-foreground hover:text-foreground"
              aria-label="إغلاق اقتراحات البحث والتصفية"
              title="إغلاق"
              @click="() => { dismissed = true; focusSearch(); }"
            >
              <X class="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          <div
            :id="listId"
            role="listbox"
            dir="rtl"
            tabindex="-1"
            :aria-labelledby="headingId"
            :aria-multiselectable="rows.some((r) => r.kind === 'option' && r.facet.selectionMode === 'multiple') || undefined"
            class="max-h-[min(21rem,calc(var(--radix-popover-content-available-height)-4.5rem))] overflow-y-auto overscroll-contain pt-1.5"
          >
            <div
              v-for="(row, index) in rows"
              :key="row.id"
              :id="optionId(row)"
              role="option"
              :aria-selected="row.kind === 'option'
                ? Boolean(modelValue.filters[row.facet.key]?.includes(row.option.value))
                : index === active"
              :class="cn(
                'flex min-h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                index === active && 'bg-accent text-accent-foreground',
              )"
              @mousedown.prevent
              @pointermove="active = index"
              @click="choose(row)"
            >
              <Search
                v-if="row.kind === 'search'"
                :class="cn('h-4 w-4 shrink-0', index === active ? 'text-accent-foreground' : 'text-muted-foreground')"
                aria-hidden="true"
              />
              <span class="min-w-0 flex-1 break-words">
                <template v-if="row.kind === 'search'">
                  <span :class="index === active ? 'text-accent-foreground/80' : 'text-muted-foreground'">البحث عن </span>«{{ row.label }}»
                </template>
                <template v-else-if="row.kind === 'option'">
                  <span :class="index === active ? 'text-accent-foreground/80' : 'text-muted-foreground'">{{ row.facet.label }} · </span>{{ row.label }}
                </template>
                <template v-else>
                  {{ row.label }}
                </template>
              </span>

              <span
                v-if="row.kind === 'option' && row.option.count !== undefined"
                :class="cn('tabular-nums text-xs', index === active ? 'text-accent-foreground/80' : 'text-muted-foreground')"
              >
                {{ row.option.count }}
              </span>
              <span
                v-if="row.kind === 'facet' && (modelValue.filters[row.facet.key]?.length ?? 0) > 0"
                class="tabular-nums text-xs font-semibold text-primary"
              >
                {{ modelValue.filters[row.facet.key].length }}
              </span>

              <template v-if="row.kind === 'option' && modelValue.filters[row.facet.key]?.includes(row.option.value)">
                <Check class="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span class="sr-only">مختار</span>
              </template>
              <ChevronLeft
                v-if="row.kind === 'facet'"
                :class="cn('h-4 w-4 shrink-0', index === active ? 'text-accent-foreground' : 'text-muted-foreground')"
                aria-hidden="true"
              />
            </div>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </Popover>

    <p :id="hintId" class="sr-only">
      الأيمن والأيسر للتنقل بين التصفيات وقيمها، وEnter للدخول، وEscape للخروج، وDelete لحذف المحدد. Backspace في حقل فارغ يحدد العنصر السابق. الأعلى والأسفل للتنقل في الاقتراحات وEnter للاختيار.
    </p>
    <div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
      {{ announcement }}
    </div>
  </div>
</template>
