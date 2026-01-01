<script setup lang="ts">
import { ComboboxRoot, type ComboboxRootEmits, type ComboboxRootProps, useForwardPropsEmits } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<ComboboxRootProps & { class?: string }>();
const emits = defineEmits<ComboboxRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <ComboboxRoot
    v-bind="forwarded"
    :class="cn('bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md', props.class)"
    :open="true"
    :model-value="props.modelValue"
  >
    <slot />
  </ComboboxRoot>
</template>
