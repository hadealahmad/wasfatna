<script setup lang="ts">
import { ComboboxContent, type ComboboxContentProps } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<ComboboxContentProps & { class?: string }>();
</script>

<template>
  <ComboboxContent
    v-bind="props"
    :class="cn('max-h-[300px] overflow-x-hidden overflow-y-auto', props.class)"
  >
    <slot />
  </ComboboxContent>
</template>
