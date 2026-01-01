<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <h5 :class="cn('mb-1 font-medium leading-none tracking-tight', props.class)" v-bind="delegatedProps">
    <slot />
  </h5>
</template>
