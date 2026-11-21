<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

interface OptionItem {
  value: string;
  label: string;
}

interface Props {
  label: string;
  options: readonly OptionItem[];
  inputId?: string;
  dataFilterKey?: string;
  hintId?: string;
  class?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'remove', value: string): void;
  (e: 'clear'): void;
  (e: 'keydown', event: KeyboardEvent): void;
  (e: 'focus', event: FocusEvent): void;
}>();
</script>

<template>
  <span
    role="group"
    :aria-label="`تصفية ${label}`"
    :data-filter-key="dataFilterKey"
    tabindex="0"
    :aria-describedby="hintId"
    :class="cn(
      'inline-flex min-h-8 max-w-full items-center gap-1 rounded-2xl border border-border bg-muted/40 py-0.5 pe-0.5 ps-2.5 text-xs font-medium text-foreground transition-colors focus-within:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      $props.class,
    )"
    @keydown="emit('keydown', $event)"
    @focus="emit('focus', $event)"
  >
    <label :for="inputId" class="shrink-0 cursor-text leading-7 text-muted-foreground">
      {{ label }}
    </label>
    <span class="relative flex min-w-0 flex-wrap items-center gap-x-0.5">
      <span
        v-for="(option, index) in options"
        :key="option.value"
        class="inline-flex min-w-0 max-w-full items-center"
      >
        <span v-if="index > 0" class="shrink-0 text-muted-foreground" aria-hidden="true">،</span>
        <button
          type="button"
          :data-filter-value="option.value"
          :aria-label="`إزالة تصفية ${label}: ${option.label}`"
          :title="`إزالة ${option.label}`"
          class="min-h-7 min-w-0 rounded px-1 py-0 text-start leading-relaxed break-words hover:line-through focus-visible:line-through focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          @click="emit('remove', option.value)"
        >
          {{ option.label }}
        </button>
      </span>
      <slot />
    </span>
    <button
      type="button"
      :aria-label="`إزالة تصفية ${label} بالكامل`"
      :title="`إزالة تصفية ${label} بالكامل`"
      class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      @click="emit('clear')"
    >
      <X class="h-3 w-3" stroke-width="1.5" aria-hidden="true" />
    </button>
  </span>
</template>
