<script setup lang="ts">
import { cn } from '@/lib/utils';

interface SkeletonProps {
  class?: string;
}

defineProps<SkeletonProps>();
</script>

<template>
  <div
    data-slot="skeleton"
    :class="cn('rounded-md bg-muted motion-safe:animate-pulse', $props.class)"
  />
</template>
