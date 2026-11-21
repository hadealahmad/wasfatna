<script setup lang="ts">
import {
  SelectContent,
  type SelectContentEmits,
  type SelectContentProps,
  SelectPortal,
  SelectViewport,
  useForwardPropsEmits,
} from 'radix-vue';
import { cn } from '@/lib/utils';

const props = withDefaults(defineProps<SelectContentProps & { class?: string }>(), {
  position: 'popper',
});
const emits = defineEmits<SelectContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <SelectPortal>
    <SelectContent
      v-bind="forwarded"
      :class="cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md origin-[var(--radix-select-content-transform-origin)] motion-safe:transition-[opacity,transform] duration-150',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 rtl:data-[side=left]:translate-x-1 data-[side=right]:translate-x-1 rtl:data-[side=right]:-translate-x-1 data-[side=top]:-translate-y-1',
        props.class,
      )"
    >
      <SelectViewport
        :class="cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )"
      >
        <slot />
      </SelectViewport>
    </SelectContent>
  </SelectPortal>
</template>
