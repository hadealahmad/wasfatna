<script setup lang="ts">
import { cn } from "@/lib/utils";

interface Props {
  class?: string;
}

defineProps<Props>();
</script>

<template>
  <thead
    data-slot="table-header"
    :class="cn('[&_tr]:border-b', $props.class)"
  >
    <slot />
  </thead>
</template>
