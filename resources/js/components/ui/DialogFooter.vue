<script setup lang="ts">
import { cn } from "@/lib/utils";

interface Props {
  class?: string;
}

defineProps<Props>();
</script>

<template>
  <div
    data-slot="dialog-footer"
    :class="cn(
      'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
      $props.class
    )"
  >
    <slot />
  </div>
</template>
