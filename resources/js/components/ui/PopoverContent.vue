<script setup lang="ts">
import { PopoverContent, type PopoverContentProps, PopoverPortal } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = withDefaults(defineProps<PopoverContentProps & { class?: string }>(), {
  align: 'center',
  sideOffset: 4,
});
</script>

<template>
  <PopoverPortal>
    <PopoverContent
      v-bind="props"
      :class="cn(
        'bg-popover text-popover-foreground motion-safe:transition-[opacity,transform] duration-150 z-50 w-72 max-h-[var(--radix-popover-content-available-height)] overflow-y-auto origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-none',
        props.class
      )"
    >
      <slot />
    </PopoverContent>
  </PopoverPortal>
</template>
