<script setup lang="ts">
import { computed } from 'vue';
import { DropdownMenuItem, type DropdownMenuItemProps, useForwardProps } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<DropdownMenuItemProps & { class?: string; inset?: boolean }>();

const delegatedProps = computed(() => {
  const { class: _, inset: __, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <DropdownMenuItem
    v-bind="forwarded"
    :class="cn(
      'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
      props.inset && 'ps-8',
      props.class,
    )"
  >
    <slot />
  </DropdownMenuItem>
</template>
