<script setup lang="ts">
import { ComboboxGroup, type ComboboxGroupProps, ComboboxLabel } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<ComboboxGroupProps & { class?: string, heading?: string }>();
</script>

<template>
  <ComboboxGroup
    v-bind="props"
    :class="cn('text-foreground overflow-hidden p-1', props.class)"
  >
    <ComboboxLabel v-if="heading" class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
      {{ heading }}
    </ComboboxLabel>
    <slot />
  </ComboboxGroup>
</template>
