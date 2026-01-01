<script setup lang="ts">
import { ComboboxItem, type ComboboxItemProps } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<ComboboxItemProps & { class?: string }>();
</script>

<template>
  <ComboboxItem
    v-bind="props"
    :class="cn(
      'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
      props.class
    )"
  >
    <slot />
  </ComboboxItem>
</template>
