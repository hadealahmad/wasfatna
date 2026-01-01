<script setup lang="ts">
import { cn } from '@/lib/utils';

interface SheetHeaderProps {
  class?: string;
}

const props = defineProps<SheetHeaderProps>();
</script>

<template>
  <div :class="cn('flex flex-col space-y-2 text-center sm:text-left', props.class)">
    <slot />
  </div>
</template>
