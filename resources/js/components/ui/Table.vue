<script setup lang="ts">
import { cn } from "@/lib/utils";

interface Props {
  class?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
}

defineProps<Props>();
</script>

<template>
  <div
    data-slot="table-container"
    tabindex="0"
    role="region"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    class="relative w-full overflow-x-auto rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    <table
      data-slot="table"
      :class="cn('w-full caption-bottom text-sm', $props.class)"
    >
      <slot />
    </table>
  </div>
</template>
