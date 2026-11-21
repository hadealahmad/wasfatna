<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { cn } from '@/lib/utils';

interface Props {
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: string;
  type?: string;
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
</script>

<template>
  <input
    v-model="modelValue"
    :type="type"
    data-slot="input"
    :class="cn(
      'flex h-10 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm',
      $props.class,
    )"
  />
</template>
