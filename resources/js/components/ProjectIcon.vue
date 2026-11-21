<script lang="ts">
import iconData from '../../data/project-icons.json';

type RawDrawing = { viewBox?: string; body?: string; alias?: string };
type Drawing = { viewBox: string; body: string };

const RAW = iconData.icons as Record<string, RawDrawing>;

export type ProjectIconName = keyof typeof iconData.icons;

/**
 * Every Tailwind utility class referenced inside `resources/data/project-icons.json`.
 * Tailwind v4 scans source files (.vue/.ts) rather than JSON data files, so listing
 * the paint tokens here guarantees every duotone fill/stroke class is emitted in CSS.
 */
export const PROJECT_ICON_PAINT_TOKENS =
  'fill-primary fill-primary/15 fill-primary/20 stroke-primary ' +
  'fill-chart-1 fill-chart-1/15 stroke-chart-1 ' +
  'fill-chart-2 fill-chart-2/20 stroke-chart-2 ' +
  'fill-chart-3 fill-chart-3/15 fill-chart-3/20 stroke-chart-3 ' +
  'fill-chart-4 fill-chart-4/20 stroke-chart-4 ' +
  'fill-chart-5 fill-chart-5/15 stroke-chart-5 ' +
  'fill-chart-6 fill-chart-6/15 stroke-chart-6 ' +
  'fill-success fill-success/15 stroke-success ' +
  'fill-warning fill-warning/15 fill-warning/20 stroke-warning ' +
  'fill-info fill-info/15 stroke-info ' +
  'fill-muted-foreground/20 stroke-muted-foreground ' +
  'stroke-background';

function resolveDrawing(key: string, depth = 0): Drawing | null {
  if (depth > 4) return null;
  const entry = RAW[key];
  if (!entry) return null;
  if (entry.alias) return resolveDrawing(entry.alias, depth + 1);
  if (!entry.viewBox || !entry.body) return null;
  return { viewBox: entry.viewBox, body: entry.body };
}
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    name: string;
    class?: string;
    size?: number | string;
    ariaLabel?: string;
  }>(),
  {
    class: undefined,
    size: undefined,
    ariaLabel: undefined,
  },
);

const drawing = computed(() => resolveDrawing(props.name));

const sizeStyle = computed(() => {
  if (props.size === undefined) return undefined;
  const px = typeof props.size === 'number' ? `${props.size}px` : props.size;
  return { width: px, height: px };
});
</script>

<template>
  <svg
    v-if="drawing"
    :viewBox="drawing.viewBox"
    :class="cn('inline-block shrink-0', size === undefined && 'w-7 h-7', props.class)"
    :style="sizeStyle"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :aria-hidden="ariaLabel ? undefined : 'true'"
    :role="ariaLabel ? 'img' : undefined"
    :aria-label="ariaLabel || undefined"
    v-html="drawing.body"
  />
</template>
