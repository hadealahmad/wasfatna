<script setup lang="ts">
import { computed, useId } from 'vue';
import { Check, Palette } from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';
import Popover from '@/components/ui/Popover.vue';
import PopoverContent from '@/components/ui/PopoverContent.vue';
import PopoverTrigger from '@/components/ui/PopoverTrigger.vue';
import { useTheme } from '@/composables/useTheme';
import { DEFAULT_THEME, FONT_OPTIONS, THEME_REGISTRY, type FontPreference } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface Props {
  class?: string;
}

const props = defineProps<Props>();

const { themePreference, font, setTheme, setFont } = useTheme();

const themeLabelId = useId();
const fontLabelId = useId();

const circleThemes = THEME_REGISTRY.filter((t) => t.group !== 'heritage');
const heritageThemes = THEME_REGISTRY.filter((t) => t.group === 'heritage');
const activeTheme = computed(() => THEME_REGISTRY.find((t) => t.id === themePreference.value));

function handleThemeChange(themeId: string): void {
  setTheme(themeId);
}

function handleFontChange(nextFont: FontPreference): void {
  setFont(nextFont);
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        type="button"
        aria-label="المظهر والخط"
        variant="ghost"
        size="icon"
        :class="cn('h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-accent/50', props.class)"
        title="المظهر والخط"
      >
        <span
          v-if="activeTheme"
          aria-hidden="true"
          class="h-4 w-4 sm:h-5 sm:w-5 rounded-full overflow-hidden shadow-sm"
          :style="{
            background: activeTheme.bg,
            border: `2px solid ${activeTheme.primary}`,
          }"
        >
          <span
            class="block"
            :style="{
              background: activeTheme.primary,
              height: '50%',
              marginTop: '50%',
            }"
          />
        </span>
        <Palette v-else class="h-5 w-5" aria-hidden="true" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-56 p-1" align="end">
      <div class="px-2 py-1.5" dir="rtl">
        <div class="flex items-center justify-between gap-2 mb-2">
          <p :id="themeLabelId" class="text-xs text-muted-foreground">المظهر</p>
          <span v-if="activeTheme" class="text-[11px] text-muted-foreground truncate">
            {{ activeTheme.nameAr }}<template v-if="activeTheme.id === DEFAULT_THEME"> · الافتراضي</template>
          </span>
        </div>
        <div role="group" :aria-labelledby="themeLabelId">
          <div v-if="heritageThemes.length > 0" class="flex items-center gap-2 mb-3">
            <button
              v-for="t in heritageThemes"
              :key="t.id"
              type="button"
              :aria-pressed="themePreference === t.id"
              :class="
                cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors',
                  themePreference === t.id
                    ? 'border-primary bg-accent text-accent-foreground'
                    : 'border-border text-foreground hover:border-primary',
                )
              "
              @click="handleThemeChange(t.id)"
            >
              <span
                aria-hidden="true"
                class="w-4 h-4 rounded-full shrink-0 overflow-hidden shadow-sm"
                :style="{
                  background: t.bg,
                  border: `2px solid ${t.primary}`,
                }"
              >
                <span
                  class="block"
                  :style="{
                    background: t.primary,
                    height: '50%',
                    marginTop: '50%',
                  }"
                />
              </span>
              <span>{{ t.shortNameAr ?? t.nameAr }}</span>
              <Check
                v-if="themePreference === t.id"
                aria-hidden="true"
                class="h-3.5 w-3.5 text-primary"
              />
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-1">
            <button
              v-for="t in circleThemes"
              :key="t.id"
              type="button"
              :aria-label="t.id === DEFAULT_THEME ? `${t.nameAr} (الافتراضي)` : t.nameAr"
              :aria-pressed="themePreference === t.id"
              :title="t.id === DEFAULT_THEME ? `${t.nameAr} (الافتراضي)` : t.nameAr"
              class="w-6 h-6 inline-flex items-center justify-center rounded-full shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              @click="handleThemeChange(t.id)"
            >
              <span
                aria-hidden="true"
                :class="
                  cn(
                    'w-4 h-4 rounded-full overflow-hidden shadow-sm transition-all',
                    themePreference === t.id
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                      : 'hover:scale-110',
                  )
                "
                :style="{
                  background: t.bg,
                  border: `2px solid ${t.primary}`,
                }"
              >
                <span
                  class="block"
                  :style="{
                    background: t.primary,
                    height: '50%',
                    marginTop: '50%',
                  }"
                />
              </span>
            </button>
          </div>
        </div>

        <p :id="fontLabelId" class="text-xs text-muted-foreground mt-3 mb-2">الخط</p>
        <div role="group" :aria-labelledby="fontLabelId" class="flex items-center gap-2">
          <button
            v-for="option in FONT_OPTIONS"
            :key="option.id"
            type="button"
            :aria-pressed="font === option.id"
            :class="
              cn(
                'flex flex-1 items-center justify-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors',
                font === option.id
                  ? 'border-primary bg-accent text-accent-foreground'
                  : 'border-border text-foreground hover:border-primary',
              )
            "
            @click="handleFontChange(option.id)"
          >
            <span>{{ option.label }}</span>
            <Check
              v-if="font === option.id"
              aria-hidden="true"
              class="h-3.5 w-3.5 text-primary"
            />
          </button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
