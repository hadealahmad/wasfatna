<script setup lang="ts">
import { cn } from "@/lib/utils";

interface Props {
  class?: string;
}

defineProps<Props>();
</script>

<template>
  <tr
    data-slot="table-row"
    :class="cn(
      'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
      $props.class
    )"
  >
    <slot />
  </tr>
</template>
