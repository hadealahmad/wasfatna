<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { MapPin, UtensilsCrossed } from 'lucide-vue-next';
import Badge from '@/components/ui/Badge.vue';
import { cn } from '@/lib/utils';
import { getRecipeRarity, type RandomizerRecipe } from './rarity';

const props = withDefaults(
  defineProps<{
    recipes: RandomizerRecipe[];
    spinning: boolean;
    soundEnabled?: boolean;
  }>(),
  {
    soundEnabled: false,
  },
);

const emit = defineEmits<{
  (e: 'spinComplete', winner: RandomizerRecipe): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const scrollPosition = ref(0);
const isAnimating = ref(false);
const landedIndex = ref<number | null>(null);
let animationFrame: number | null = null;
let audioCtx: AudioContext | null = null;

function playTick(pitch = 520): void {
  if (!props.soundEnabled || typeof window === 'undefined') return;
  try {
    const AudioContextCtor =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;
    if (!audioCtx) audioCtx = new AudioContextCtor();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.035, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.045);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } catch {
    // Ignore audio errors silently (browser autoplay policy)
  }
}

function playRevealChime(): void {
  if (!props.soundEnabled || typeof window === 'undefined') return;
  try {
    const AudioContextCtor =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;
    if (!audioCtx) audioCtx = new AudioContextCtor();
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const start = audioCtx.currentTime + i * 0.07;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.05, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + 0.26);
    });
  } catch {
    // Ignore audio errors
  }
}

function getCardDimensions(): { width: number; gap: number } {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return {
    width: isMobile ? 156 : 212,
    gap: isMobile ? 12 : 16,
  };
}

const MAX_STRIP_CARDS = 40;
const displayRecipes = ref<RandomizerRecipe[]>([]);

function buildStrip(source: RandomizerRecipe[]): RandomizerRecipe[] {
  if (source.length === 0) return [];
  const strip: RandomizerRecipe[] = [];
  while (strip.length < MAX_STRIP_CARDS) {
    // Lightly shuffle each repetition so adjacent cards feel varied
    const batch = [...source];
    for (let i = batch.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [batch[i], batch[j]] = [batch[j], batch[i]];
    }
    strip.push(...batch);
  }
  return strip.slice(0, MAX_STRIP_CARDS);
}

watch(
  () => props.recipes,
  (newRecipes) => {
    landedIndex.value = null;
    displayRecipes.value = buildStrip(newRecipes);
  },
  { immediate: true },
);

watch(
  () => props.spinning,
  (spinning) => {
    if (spinning && props.recipes.length > 0) {
      startSpin();
    }
  },
);

// The parent mounts this reel only once the phase is already 'spinning', so the
// watcher above never sees a false→true change; start the spin on mount too.
onMounted(async () => {
  if (!props.spinning || props.recipes.length === 0) return;
  await nextTick();
  startSpin();
});

function startSpin(): void {
  if (props.recipes.length === 0 || displayRecipes.value.length === 0) return;

  landedIndex.value = null;
  const { width: CARD_WIDTH, gap: CARD_GAP } = getCardDimensions();
  const TOTAL_CARD_WIDTH = CARD_WIDTH + CARD_GAP;

  const stripLength = displayRecipes.value.length;
  const minIndex = Math.min(Math.floor(stripLength * 0.52), stripLength - 1);
  const maxIndex = Math.max(minIndex + 1, Math.min(Math.floor(stripLength * 0.82), stripLength - 1));
  const winningIndex = Math.floor(Math.random() * (maxIndex - minIndex)) + minIndex;
  const winningRecipe = displayRecipes.value[winningIndex];

  const containerWidth = containerRef.value?.offsetWidth || 640;
  const centerOffset = containerWidth / 2 - CARD_WIDTH / 2;
  const targetPosition = winningIndex * TOTAL_CARD_WIDTH - centerOffset;

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    scrollPosition.value = Math.max(0, targetPosition);
    landedIndex.value = winningIndex;
    isAnimating.value = false;
    playRevealChime();
    emit('spinComplete', winningRecipe);
    return;
  }

  // Slight realistic jitter inside the winning slot before snapping to exact center
  const jitter = (Math.random() - 0.5) * Math.min(28, CARD_WIDTH * 0.14);
  const initialTarget = Math.max(0, targetPosition + jitter);

  isAnimating.value = true;
  const startTime = performance.now();
  const duration = 4400;
  scrollPosition.value = 0;
  let lastTickCard = -1;

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Smooth quintic-like crate reel deceleration
    const ease = 1 - Math.pow(1 - progress, 4.4);
    const currentPos = initialTarget * ease;
    scrollPosition.value = currentPos;

    const currentCenterCard = Math.floor((currentPos + centerOffset + CARD_WIDTH / 2) / TOTAL_CARD_WIDTH);
    if (currentCenterCard !== lastTickCard && progress < 0.98) {
      lastTickCard = currentCenterCard;
      playTick(440 + Math.round((1 - progress) * 220));
    }

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      // Gentle settle to dead-center
      scrollPosition.value = Math.max(0, targetPosition);
      landedIndex.value = winningIndex;
      isAnimating.value = false;
      playRevealChime();
      emit('spinComplete', winningRecipe);
    }
  };

  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(animate);
}

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  if (audioCtx) {
    audioCtx.close().catch(() => {});
    audioCtx = null;
  }
});
</script>

<template>
  <div
    class="relative w-full overflow-hidden rounded-2xl border border-border bg-card/80 py-7 md:py-9 shadow-sm"
    aria-label="شريط تدوير الصندوق"
  >
    <!-- Top & Bottom Center Pointers -->
    <div class="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
      <div class="h-0 w-0 border-x-[10px] border-x-transparent border-t-[13px] border-t-primary drop-shadow-sm" />
      <div class="h-6 w-0.5 bg-primary/50" />
    </div>
    <div class="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
      <div class="h-6 w-0.5 bg-primary/50" />
      <div class="h-0 w-0 border-x-[10px] border-x-transparent border-b-[13px] border-b-primary drop-shadow-sm" />
    </div>

    <!-- Center Selection Frame -->
    <div
      class="pointer-events-none absolute inset-y-3 left-1/2 -translate-x-1/2 w-[166px] md:w-[222px] rounded-xl border-2 border-primary/60 bg-primary/5 z-20"
    />

    <!-- Side Fade Masks -->
    <div
      class="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-28 bg-gradient-to-l from-card via-card/75 to-transparent z-20"
    />
    <div
      class="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-28 bg-gradient-to-r from-card via-card/75 to-transparent z-20"
    />

    <!-- Horizontal Reel Track (LTR math for predictable translate3d) -->
    <div ref="containerRef" class="w-full overflow-hidden" dir="ltr">
      <div
        class="flex gap-3 md:gap-4"
        :style="{
          transform: `translate3d(-${scrollPosition}px, 0, 0)`,
          width: 'max-content',
          willChange: isAnimating ? 'transform' : 'auto',
        }"
      >
        <div
          v-for="(recipe, index) in displayRecipes"
          :key="`${recipe.id}-${index}`"
          class="shrink-0 w-[156px] md:w-[212px]"
          dir="rtl"
        >
          <div
            :class="
              cn(
                'relative flex flex-col h-[212px] md:h-[252px] overflow-hidden rounded-xl border bg-background transition-all duration-300',
                getRecipeRarity(recipe.difficulty).borderClass,
                landedIndex === index && 'ring-2 ring-primary scale-[1.03] shadow-lg',
              )
            "
          >
            <!-- Rarity Top Bar -->
            <div :class="cn('h-1.5 w-full shrink-0', getRecipeRarity(recipe.difficulty).topBarClass)" />

            <!-- Recipe Image -->
            <div class="relative h-24 md:h-32 w-full bg-muted overflow-hidden shrink-0">
              <img
                v-if="recipe.image_url"
                :src="recipe.image_url"
                :alt="recipe.name"
                width="212"
                height="128"
                decoding="async"
                fetchpriority="low"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-accent"
              >
                <UtensilsCrossed class="h-8 w-8 md:h-10 md:w-10 text-muted-foreground/30" aria-hidden="true" />
              </div>

              <Badge
                variant="outline"
                :class="
                  cn(
                    'absolute bottom-1.5 start-1.5 px-1.5 py-0 text-[10px] font-semibold backdrop-blur-sm bg-background/85',
                    getRecipeRarity(recipe.difficulty).badgeClass,
                  )
                "
              >
                {{ getRecipeRarity(recipe.difficulty).label }}
              </Badge>
            </div>

            <!-- Card Body -->
            <div class="flex flex-1 flex-col justify-between p-2.5 md:p-3 text-start">
              <h3 class="font-bold text-xs md:text-sm line-clamp-2 leading-snug text-foreground" :title="recipe.name">
                {{ recipe.name }}
              </h3>
              <p class="flex items-center gap-1 text-[11px] text-muted-foreground truncate mt-1">
                <MapPin class="h-3 w-3 shrink-0 text-primary" aria-hidden="true" />
                <span class="truncate">{{ recipe.city?.name || 'المطبخ السوري' }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
