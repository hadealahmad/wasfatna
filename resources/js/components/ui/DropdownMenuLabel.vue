<script setup lang="ts">
import { computed } from 'vue';
import { DropdownMenuLabel, type DropdownMenuLabelProps, useForwardProps } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<DropdownMenuLabelProps & { class?: string; inset?: boolean }>();

const delegatedProps = computed(() => {
  const { class: _, inset: __, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <DropdownMenuLabel
    v-bind="forwarded"
    :class="cn('px-2 py-1.5 text-sm font-semibold', props.inset && 'ps-8', props.class)"
  >
    <slot />
  </DropdownMenuLabel>
</template>
