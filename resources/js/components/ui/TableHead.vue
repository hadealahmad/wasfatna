<script setup lang="ts">
import { cn } from "@/lib/utils";

interface Props {
  class?: string;
}

defineProps<Props>();
</script>

<template>
  <th
    data-slot="table-head"
    :class="cn(
      'text-foreground h-10 px-2 text-start align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]',
      $props.class
    )"
  >
    <slot />
  </th>
</template>
