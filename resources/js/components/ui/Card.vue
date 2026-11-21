<script setup lang="ts">
import { cn } from '@/lib/utils';

interface Props {
  class?: string;
}

defineProps<Props>();
</script>

<template>
  <div
    data-slot="card"
    :class="cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      $props.class,
    )"
  >
    <slot />
  </div>
</template>
