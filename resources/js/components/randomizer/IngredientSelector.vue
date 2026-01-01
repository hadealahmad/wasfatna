<script setup lang="ts">
import { ref, watch } from 'vue';
import Button from '@/components/ui/Button.vue';
import Popover from '@/components/ui/Popover.vue';
import PopoverContent from '@/components/ui/PopoverContent.vue';
import PopoverTrigger from '@/components/ui/PopoverTrigger.vue';
import Badge from '@/components/ui/Badge.vue';
import Command from '@/components/ui/Command.vue';
import CommandInput from '@/components/ui/CommandInput.vue';
import CommandList from '@/components/ui/CommandList.vue';
import CommandEmpty from '@/components/ui/CommandEmpty.vue';
import CommandGroup from '@/components/ui/CommandGroup.vue';
import CommandItem from '@/components/ui/CommandItem.vue';

import { Check, ChevronsUpDown, X } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import { useDebounceFn } from '@vueuse/core';

interface Ingredient {
  id: number;
  name: string;
}

const props = defineProps<{
  selectedIngredients: Ingredient[];
}>();

const emit = defineEmits<{
  (e: 'select', ingredient: Ingredient): void;
  (e: 'remove', id: number): void;
}>();

const open = ref(false);
const query = ref('');
const suggestions = ref<Ingredient[]>([]);
const loading = ref(false);

const fetchIngredients = useDebounceFn(async (q: string) => {
  if (!q || q.length < 2) {
    suggestions.value = [];
    return;
  }

  loading.value = true;
  try {
    // Assuming backend endpoint supports searching ingredients
    const response = await fetch(`/api/ingredients?search=${encodeURIComponent(q)}`);
    const data = await response.json();
    suggestions.value = data.data || data; // Handle paginated or simple list
  } catch (e) {
    console.error(e);
    suggestions.value = [];
  } finally {
    loading.value = false;
  }
}, 300);

watch(query, (newVal) => {
  fetchIngredients(newVal);
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <Popover v-model:open="open">
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          :aria-expanded="open"
          class="w-full justify-between"
        >
          اختر مكونات لاستبعادها...
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-[300px] p-0" align="start">
        <Command v-model:searchTerm="query">
          <CommandInput
            placeholder="ابحث عن مكون..."
            class="text-right"
            dir="rtl"
          />
          <CommandList>
            <div v-if="loading" class="py-6 text-center text-sm text-muted-foreground">جاري التحميل...</div>

            <CommandEmpty v-if="!loading && query.length >= 2 && suggestions.length === 0">
              لم يتم العثور على مكون.
            </CommandEmpty>

            <CommandGroup v-if="!loading && suggestions.length > 0" heading="مقترحات">
              <CommandItem
                v-for="ingredient in suggestions"
                :key="ingredient.id"
                :value="ingredient.name"
                @select="() => {
                  emit('select', ingredient);
                  open = false;
                  query = '';
                }"
                class="cursor-pointer text-right flex-row-reverse"
              >
                <Check
                  :class="cn(
                    'mr-2 h-4 w-4',
                    selectedIngredients.some(i => i.id === ingredient.id) ? 'opacity-100' : 'opacity-0'
                  )"
                />
                {{ ingredient.name }}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>

    <div class="flex flex-wrap gap-2">
      <Badge 
        v-for="ingredient in selectedIngredients" 
        :key="ingredient.id" 
        variant="secondary" 
        class="px-3 py-1 gap-2"
      >
        {{ ingredient.name }}
        <button
          class="rounded-full hover:bg-muted p-0.5"
          @click="emit('remove', ingredient.id)"
        >
          <X class="h-3 w-3" />
          <span class="sr-only">إزالة {{ ingredient.name }}</span>
        </button>
      </Badge>
    </div>
  </div>
</template>
