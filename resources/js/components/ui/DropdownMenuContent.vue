<script setup lang="ts">
import {
  DropdownMenuContent,
  type DropdownMenuContentEmits,
  type DropdownMenuContentProps,
  DropdownMenuPortal,
  useForwardPropsEmits,
} from 'radix-vue';
import { cn } from '@/lib/utils';

const props = withDefaults(defineProps<DropdownMenuContentProps & { class?: string }>(), {
  sideOffset: 4,
});
const emits = defineEmits<DropdownMenuContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent
      v-bind="forwarded"
      :class="cn(
        'z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md origin-[var(--radix-dropdown-menu-content-transform-origin)] motion-safe:transition-[opacity,transform] duration-150',
        props.class,
      )"
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
