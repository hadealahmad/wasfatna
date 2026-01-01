<script setup lang="ts">
import { cn } from "@/lib/utils";

interface Props {
  class?: string;
}

defineProps<Props>();
</script>

<template>
  <div
    data-slot="table-container"
    class="relative w-full overflow-x-auto"
  >
    <table
      data-slot="table"
      :class="cn('w-full caption-bottom text-sm', $props.class)"
    >
      <slot />
    </table>
  </div>
</template>
