<script setup lang="ts">
import { cn } from "@/lib/utils";

interface Props {
  class?: string;
}

defineProps<Props>();
</script>

<template>
  <div
    data-slot="card-content"
    :class="cn('px-6', $props.class)"
  >
    <slot />
  </div>
</template>
