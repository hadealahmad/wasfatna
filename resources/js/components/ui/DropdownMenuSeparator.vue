<script setup lang="ts">
import { DropdownMenuSeparator, type DropdownMenuSeparatorProps, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<DropdownMenuSeparatorProps & { class?: string }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <DropdownMenuSeparator
    v-bind="forwarded"
    :class="cn('bg-border -mx-1 my-1 h-px', props.class)"
  />
</template>
