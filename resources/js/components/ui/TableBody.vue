<script setup lang="ts">
import { cn } from "@/lib/utils";

interface Props {
  class?: string;
}

defineProps<Props>();
</script>

<template>
  <tbody
    data-slot="table-body"
    :class="cn('[&_tr:last-child]:border-0', $props.class)"
  >
    <slot />
  </tbody>
</template>
