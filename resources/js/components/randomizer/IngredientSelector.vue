<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { Check, ChevronsUpDown, Loader2, Search, Trash2, X } from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';
import Command from '@/components/ui/Command.vue';
import CommandEmpty from '@/components/ui/CommandEmpty.vue';
import CommandGroup from '@/components/ui/CommandGroup.vue';
import CommandInput from '@/components/ui/CommandInput.vue';
import CommandItem from '@/components/ui/CommandItem.vue';
import CommandList from '@/components/ui/CommandList.vue';
import FilterChip from '@/components/ui/FilterChip.vue';
import Popover from '@/components/ui/Popover.vue';
import PopoverContent from '@/components/ui/PopoverContent.vue';
import PopoverTrigger from '@/components/ui/PopoverTrigger.vue';
import { cn } from '@/lib/utils';

export interface IngredientOption {
  id: number;
  name: string;
}

const props = withDefaults(
  defineProps<{
    selectedIngredients: IngredientOption[];
    popularIngredients?: IngredientOption[];
  }>(),
  {
    popularIngredients: () => [],
  },
);

const emit = defineEmits<{
  (e: 'select', ingredient: IngredientOption): void;
  (e: 'remove', id: number): void;
  (e: 'clear'): void;
}>();

const open = ref(false);
const query = ref('');
const suggestions = ref<IngredientOption[]>([]);
const loading = ref(false);
const searchError = ref(false);

const selectedIds = computed(() => new Set(props.selectedIngredients.map((i) => i.id)));

const fetchIngredients = useDebounceFn(async (q: string) => {
  const trimmed = q.trim();
  if (trimmed.length < 2) {
    suggestions.value = [];
    searchError.value = false;
    loading.value = false;
    return;
  }

  loading.value = true;
  searchError.value = false;
  try {
    const response = await fetch(`/api/ingredients/search?q=${encodeURIComponent(trimmed)}`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch ingredients');
    const data = await response.json();
    suggestions.value = Array.isArray(data.ingredients)
      ? data.ingredients
      : Array.isArray(data.data)
        ? data.data
        : [];
  } catch {
    searchError.value = true;
    suggestions.value = [];
  } finally {
    loading.value = false;
  }
}, 250);

watch(query, (newVal) => {
  fetchIngredients(newVal);
});

function toggleIngredient(ingredient: IngredientOption): void {
  if (selectedIds.value.has(ingredient.id)) {
    emit('remove', ingredient.id);
  } else {
    emit('select', ingredient);
  }
}

function handleCommandSelect(ingredient: IngredientOption): void {
  toggleIngredient(ingredient);
  open.value = false;
  query.value = '';
  suggestions.value = [];
}
</script>

<template>
  <div class="space-y-4">
    <!-- Search Combobox -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between gap-2">
        <label for="randomizer-ingredient-trigger" class="text-sm font-medium text-foreground">
          استبعاد مكونات لا تفضلها
        </label>
        <span
          v-if="selectedIngredients.length > 0"
          class="text-xs font-medium text-muted-foreground tabular-nums"
        >
          المستبعدة: {{ selectedIngredients.length }}
        </span>
      </div>

      <Popover v-model:open="open">
        <PopoverTrigger as-child>
          <Button
            id="randomizer-ingredient-trigger"
            type="button"
            variant="outline"
            role="combobox"
            :aria-expanded="open"
            class="w-full justify-between bg-background h-10 font-normal"
          >
            <span class="flex items-center gap-2 text-muted-foreground truncate">
              <Search class="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>ابحث عن مكون لاستبعاده (مثال: لحم، ثوم، باذنجان)...</span>
            </span>
            <ChevronsUpDown class="ms-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[min(22rem,88vw)] p-0" align="start">
          <Command v-model:search-term="query">
            <CommandInput
              placeholder="اكتب حرفين على الأقل للبحث..."
              class="text-start"
              dir="rtl"
            />
            <CommandList>
              <div
                v-if="loading"
                class="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground"
              >
                <Loader2 class="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>جاري البحث...</span>
              </div>

              <div
                v-else-if="searchError"
                class="py-6 text-center text-sm text-destructive"
              >
                تعذّر تحميل المكونات، حاول مجدداً.
              </div>

              <div
                v-else-if="query.trim().length < 2"
                class="py-5 px-3 text-center text-xs text-muted-foreground"
              >
                اكتب حرفين على الأقل للبحث في قائمة المكونات.
              </div>

              <CommandEmpty v-else-if="suggestions.length === 0">
                لم يتم العثور على مكون مطابق.
              </CommandEmpty>

              <CommandGroup v-else heading="المكونات المطابقة">
                <CommandItem
                  v-for="ingredient in suggestions"
                  :key="ingredient.id"
                  :value="ingredient.name"
                  class="cursor-pointer text-start justify-between"
                  @select="handleCommandSelect(ingredient)"
                >
                  <span>{{ ingredient.name }}</span>
                  <Check
                    :class="
                      cn(
                        'ms-2 h-4 w-4 text-primary',
                        selectedIds.has(ingredient.id) ? 'opacity-100' : 'opacity-0',
                      )
                    "
                    aria-hidden="true"
                  />
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>

    <!-- Quick-Exclude Popular Ingredients -->
    <div v-if="popularIngredients.length > 0" class="space-y-2">
      <p class="text-xs font-medium text-muted-foreground">استبعاد سريع لمكونات شائعة:</p>
      <div
        role="group"
        aria-label="مكونات شائعة للاستبعاد السريع"
        class="flex flex-wrap gap-1.5"
      >
        <FilterChip
          v-for="ingredient in popularIngredients"
          :key="ingredient.id"
          :active="selectedIds.has(ingredient.id)"
          @click="toggleIngredient(ingredient)"
        >
          <span>{{ ingredient.name }}</span>
          <X
            v-if="selectedIds.has(ingredient.id)"
            class="h-3 w-3 shrink-0"
            aria-hidden="true"
          />
        </FilterChip>
      </div>
    </div>

    <!-- Selected Excluded Chips -->
    <div
      v-if="selectedIngredients.length > 0"
      class="rounded-xl border border-border/70 bg-muted/30 p-3 space-y-2"
    >
      <div class="flex items-center justify-between gap-2">
        <span class="text-xs font-semibold text-foreground tabular-nums">
          المكونات المستبعدة ({{ selectedIngredients.length }})
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          class="h-7 px-2 text-xs text-muted-foreground hover:text-destructive gap-1"
          @click="emit('clear')"
        >
          <Trash2 class="h-3.5 w-3.5" aria-hidden="true" />
          <span>مسح الكل</span>
        </Button>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <FilterChip
          v-for="ingredient in selectedIngredients"
          :key="ingredient.id"
          :active="true"
          :aria-label="`إزالة ${ingredient.name} من المستبعدات`"
          @click="emit('remove', ingredient.id)"
        >
          <span>{{ ingredient.name }}</span>
          <X class="h-3 w-3 shrink-0" aria-hidden="true" />
        </FilterChip>
      </div>
    </div>
  </div>
</template>
