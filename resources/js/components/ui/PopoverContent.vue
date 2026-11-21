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
        'z-50 w-72 max-h-[var(--radix-popover-content-available-height)] overflow-y-auto rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none origin-(--radix-popover-content-transform-origin) motion-safe:transition-[opacity,transform] duration-150',
        props.class,
      )"
    >
      <slot />
    </PopoverContent>
  </PopoverPortal>
</template>
