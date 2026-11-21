<script setup lang="ts">
import { ref, useId } from 'vue';
import { router } from '@inertiajs/vue3';
import Input from './Input.vue';
import { Search } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  className?: string;
}

const props = defineProps<SearchInputProps>();
const query = ref('');
const inputId = useId();

const handleSearch = () => {
  if (query.value.trim()) {
    router.get(route('search.index'), { search: query.value }, {
      preserveState: true,
      replace: true,
    });
  }
};
</script>

<template>
  <search :class="cn('relative', props.className)">
    <form @submit.prevent="handleSearch" class="relative">
      <label class="sr-only" :for="inputId">بحث</label>
      <Input
        :id="inputId"
        v-model="query"
        type="search"
        name="search"
        enterkeyhint="search"
        autocorrect="off"
        autocapitalize="none"
        spellcheck="false"
        placeholder="بحث عن وصفة..."
        class="ps-10 h-10 w-[200px] lg:w-[300px] bg-background text-start"
        dir="rtl"
      />
      <Search class="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
    </form>
  </search>
</template>
