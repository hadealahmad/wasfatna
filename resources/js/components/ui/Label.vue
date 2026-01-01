<script setup lang="ts">
import { Label, type LabelProps } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<LabelProps & { class?: string }>();
</script>

<template>
  <Label
    v-bind="props"
    :class="cn(
      'text-sm font-medium leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
      props.class
    )"
  >
    <slot />
  </Label>
</template>
