<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import Input from './Input.vue';
import { Search } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  className?: string;
}

const props = defineProps<SearchInputProps>();
const query = ref('');

const handleSearch = () => {
  if (query.value.trim()) {
    router.get(route('recipes.index'), { search: query.value }, {
      preserveState: true,
      replace: true,
    });
  }
};
</script>

<template>
  <form @submit.prevent="handleSearch" :class="cn('relative', props.className)">
    <Input
      v-model="query"
      type="search"
      placeholder="بحث عن وصفة..."
      class="pr-10 h-10 w-[200px] lg:w-[300px] bg-background text-right"
      dir="rtl"
    />
    <Search class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  </form>
</template>
