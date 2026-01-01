<script setup lang="ts">
import { cn } from "@/lib/utils";

interface SkeletonProps {
  class?: string;
}

defineProps<SkeletonProps>();
</script>

<template>
  <div
    data-slot="skeleton"
    :class="cn('bg-accent animate-pulse rounded-md', $props.class)"
  />
</template>
