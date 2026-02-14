<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { SwitchRoot, type SwitchRootEmits, type SwitchRootProps, SwitchThumb, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<SwitchRootProps & { class?: HTMLAttributes['class'] }>()

const emits = defineEmits<SwitchRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <SwitchRoot
    v-bind="forwarded"
    :class="cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
      props.class,
    )"
    :style="{
      backgroundColor: props.checked ? 'var(--primary)' : 'var(--input)',
    }"
  >
    <SwitchThumb
      class="pointer-events-none block h-5 w-5 rounded-full bg-background ring-0 shadow-lg transition-transform"
      :style="{
        transform: props.checked ? 'translateX(1.25rem)' : 'translateX(0)',
      }"
    />
  </SwitchRoot>
</template>
