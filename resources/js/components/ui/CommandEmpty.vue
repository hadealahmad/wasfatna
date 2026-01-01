<script setup lang="ts">
import { ComboboxEmpty, type ComboboxEmptyProps } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<ComboboxEmptyProps & { class?: string }>();
</script>

<template>
  <ComboboxEmpty
    v-bind="props"
    :class="cn('py-6 text-center text-sm', props.class)"
  >
    <slot />
  </ComboboxEmpty>
</template>
