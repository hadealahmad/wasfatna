<script setup lang="ts">
import { ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';
import Select from '@/components/ui/Select.vue';
import SelectContent from '@/components/ui/SelectContent.vue';
import SelectItem from '@/components/ui/SelectItem.vue';
import SelectTrigger from '@/components/ui/SelectTrigger.vue';
import SelectValue from '@/components/ui/SelectValue.vue';
import Command from '@/components/ui/Command.vue';
import CommandEmpty from '@/components/ui/CommandEmpty.vue';
import CommandGroup from '@/components/ui/CommandGroup.vue';
import CommandInput from '@/components/ui/CommandInput.vue';
import CommandItem from '@/components/ui/CommandItem.vue';
import CommandList from '@/components/ui/CommandList.vue';
import Popover from '@/components/ui/Popover.vue';
import PopoverContent from '@/components/ui/PopoverContent.vue';
import PopoverTrigger from '@/components/ui/PopoverTrigger.vue';
import { Check, ChevronsUpDown } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

interface City {
  id: number;
  name: string;
  slug: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

const props = withDefaults(defineProps<{
  cities: City[];
  tags: Tag[];
  initialFilters?: { search?: string; city?: string; tag?: string; difficulty?: string };
  showSearchButton?: boolean;
}>(), {
  showSearchButton: true
});

const searchQuery = ref(props.initialFilters?.search || '');
const city = ref(props.initialFilters?.city || '');
const tag = ref(props.initialFilters?.tag || '');
const difficulty = ref(props.initialFilters?.difficulty || '');

const isCityOpen = ref(false);
const isTagOpen = ref(false);

const difficulties = [
  { value: 'all', label: 'كل المستويات' },
  { value: 'سهلة جداً', label: 'سهلة جداً' },
  { value: 'سهلة', label: 'سهلة' },
  { value: 'متوسطة', label: 'متوسطة' },
  { value: 'صعبة', label: 'صعبة' },
  { value: 'صعبة جداً', label: 'صعبة جداً' },
];

const emit = defineEmits<{
  (e: 'search', params: any): void;
}>();

const handleSearch = () => {
  const params: any = {};
  if (searchQuery.value) params.search = searchQuery.value;
  if (city.value && city.value !== 'all') params.city = city.value;
  if (tag.value && tag.value !== 'all') params.tag = tag.value;
  if (difficulty.value && difficulty.value !== 'all') params.difficulty = difficulty.value;
  
  // Reset page when searching
  params.page = 1;

  emit('search', params);

  // Determine target route. If on recipes.index or search.index, stay. Otherwise go to search.index
  const currentRoute = route().current();
  let targetRoute = route('search.index');
  
  if (currentRoute === 'recipes.index' || currentRoute === 'search.index') {
    targetRoute = route(currentRoute as string);
  }

  router.get(targetRoute, params, {
    preserveState: true,
    replace: true,
  });
};

const onFilterChange = () => {
    if (!props.showSearchButton) {
        handleSearch();
    }
};

const getSelectedCityName = () => {
  if (!city.value || city.value === 'all') return 'كل المدن';
  const found = props.cities.find(c => String(c.id) === String(city.value) || c.slug === city.value);
  return found ? found.name : 'كل المدن';
};

const getSelectedTagName = () => {
  if (!tag.value || tag.value === 'all') return 'كل الوسوم';
  const found = props.tags.find(t => String(t.id) === String(tag.value) || t.slug === tag.value);
  return found ? found.name : 'كل الوسوم';
};
</script>

<template>
  <search class="w-full">
    <form @submit.prevent="handleSearch" class="flex flex-col gap-4" :class="{ 'md:flex-row': !showSearchButton }">
      <!-- Search Input -->
      <div class="flex-1" :class="{ 'w-full': showSearchButton }">
        <label for="recipe-search-input" class="sr-only">البحث عن وصفة</label>
        <Input
          id="recipe-search-input"
          v-model="searchQuery"
          type="search"
          name="search"
          enterkeyhint="search"
          autocorrect="off"
          autocapitalize="none"
          spellcheck="false"
          placeholder="ابحث عن وصفة..."
          class="h-12 text-lg bg-background"
          dir="rtl"
        />
      </div>

      <div class="flex flex-col md:flex-row gap-4" :class="{ 'w-full': showSearchButton }">
        <!-- City Filter -->
        <Popover v-model:open="isCityOpen">
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-label="تصفية حسب المدينة"
              class="h-12 justify-between bg-background font-normal w-full md:w-48 text-start"
              :class="{ 'md:flex-1': showSearchButton }"
            >
              <span class="truncate">{{ getSelectedCityName() }}</span>
              <ChevronsUpDown class="h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[200px] p-0" align="end">
            <Command>
              <CommandInput placeholder="بحث عن مدينة..." class="text-start" dir="rtl" />
              <CommandList>
                <CommandEmpty>لم يتم العثور على نتائج.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    @select="city = 'all'; isCityOpen = false; onFilterChange()"
                    class="text-start justify-between cursor-pointer"
                  >
                    <span>كل المدن</span>
                    <Check :class="cn('h-4 w-4 ms-2', city === 'all' || !city ? 'opacity-100' : 'opacity-0')" aria-hidden="true" />
                  </CommandItem>
                  <CommandItem
                    v-for="c in cities"
                    :key="c.id"
                    :value="c.name"
                    @select="city = String(c.id); isCityOpen = false; onFilterChange()"
                    class="text-start justify-between cursor-pointer"
                  >
                    <span>{{ c.name }}</span>
                    <Check :class="cn('h-4 w-4 ms-2', String(city) === String(c.id) ? 'opacity-100' : 'opacity-0')" aria-hidden="true" />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <!-- Tag Filter -->
        <Popover v-model:open="isTagOpen">
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-label="تصفية حسب الوسم"
              class="h-12 justify-between bg-background font-normal w-full md:w-48 text-start"
              :class="{ 'md:flex-1': showSearchButton }"
            >
              <span class="truncate">{{ getSelectedTagName() }}</span>
              <ChevronsUpDown class="h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[200px] p-0" align="end">
            <Command>
              <CommandInput placeholder="بحث عن وسم..." class="text-start" dir="rtl" />
              <CommandList>
                <CommandEmpty>لم يتم العثور على نتائج.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    @select="tag = 'all'; isTagOpen = false; onFilterChange()"
                    class="text-start justify-between cursor-pointer"
                  >
                    <span>كل الوسوم</span>
                    <Check :class="cn('h-4 w-4 ms-2', tag === 'all' || !tag ? 'opacity-100' : 'opacity-0')" aria-hidden="true" />
                  </CommandItem>
                  <CommandItem
                    v-for="t in tags"
                    :key="t.id"
                    :value="t.name"
                    @select="tag = String(t.id); isTagOpen = false; onFilterChange()"
                    class="text-start justify-between cursor-pointer"
                  >
                    <span>{{ t.name }}</span>
                    <Check :class="cn('h-4 w-4 ms-2', String(tag) === String(t.id) ? 'opacity-100' : 'opacity-0')" aria-hidden="true" />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        <!-- Difficulty Filter -->
         <Select v-model="difficulty" @update:modelValue="onFilterChange()">
            <SelectTrigger aria-label="تصفية حسب مستوى الصعوبة" class="h-12 bg-background w-full md:w-48 text-start" :class="{ 'md:flex-1': showSearchButton }">
                <SelectValue placeholder="مستوى الصعوبة" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem v-for="d in difficulties" :key="d.value" :value="d.value" class="text-start cursor-pointer">
                    {{ d.label }}
                </SelectItem>
            </SelectContent>
         </Select>

        <!-- Search Button -->
        <Button v-if="showSearchButton" type="submit" size="lg" class="h-12 px-8 w-full md:w-auto">
          بحث
        </Button>
      </div>
    </form>
  </search>
</template>
