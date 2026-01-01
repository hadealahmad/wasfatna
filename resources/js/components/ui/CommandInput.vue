<script setup lang="ts">
import { ComboboxInput, type ComboboxInputProps } from 'radix-vue';
import { Search } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const props = defineProps<ComboboxInputProps & { class?: string }>();
</script>

<template>
  <div class="flex h-9 items-center gap-2 border-b px-3" data-slot="command-input-wrapper">
    <Search class="h-4 w-4 shrink-0 opacity-50" />
    <ComboboxInput
      v-bind="props"
      :class="cn(
        'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      )"
    />
  </div>
</template>
