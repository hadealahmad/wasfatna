<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import { ChefHat } from 'lucide-vue-next';

interface Recipe {
    id: number;
    name: string;
    slug: string;
    image_url?: string;
    city?: { name: string };
    author?: { name: string };
}

const props = defineProps<{
    recipes: Recipe[];
    spinning: boolean;
}>();

const emit = defineEmits<{
    (e: 'spinComplete', winner: Recipe): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const scrollPosition = ref(0);
const isAnimating = ref(false);
let animationFrame: number | null = null;

// Responsive card dimensions
const getCardDimensions = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return {
        width: isMobile ? 160 : 220,
        gap: isMobile ? 12 : 16,
    };
};

// Cap strip length to ~36-40 cards to avoid rendering hundreds of DOM nodes
const MAX_STRIP_CARDS = 36;
const displayRecipes = ref<Recipe[]>([]);

watch(() => props.recipes, (newRecipes) => {
    if (newRecipes.length > 0) {
        const strip: Recipe[] = [];
        while (strip.length < MAX_STRIP_CARDS) {
            strip.push(...newRecipes);
        }
        displayRecipes.value = strip.slice(0, MAX_STRIP_CARDS);
    } else {
        displayRecipes.value = [];
    }
}, { immediate: true });

// Watch for spinning trigger
watch(() => props.spinning, (spinning) => {
    if (spinning && props.recipes.length > 0) {
        startSpin();
    }
});

const startSpin = () => {
    if (props.recipes.length === 0 || displayRecipes.value.length === 0) return;

    const { width: CARD_WIDTH, gap: CARD_GAP } = getCardDimensions();
    const TOTAL_CARD_WIDTH = CARD_WIDTH + CARD_GAP;

    // Pick a random winner from the middle-to-late section of the capped strip
    const stripLength = displayRecipes.value.length;
    const minIndex = Math.min(Math.floor(stripLength * 0.4), stripLength - 1);
    const maxIndex = Math.max(minIndex + 1, Math.floor(stripLength * 0.8));
    const winningIndex = Math.floor(Math.random() * (maxIndex - minIndex)) + minIndex;
    const winningRecipe = displayRecipes.value[winningIndex];

    // Calculate exact position to center the winning card
    const containerWidth = containerRef.value?.offsetWidth || 600;
    const centerOffset = (containerWidth / 2) - (CARD_WIDTH / 2);
    const targetPosition = (winningIndex * TOTAL_CARD_WIDTH) - centerOffset;

    const prefersReducedMotion = typeof window !== 'undefined'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        scrollPosition.value = targetPosition;
        isAnimating.value = false;
        emit('spinComplete', winningRecipe);
        return;
    }

    isAnimating.value = true;

    const startTime = performance.now();
    const duration = 5000; // 5 seconds spin

    // Reset to start
    scrollPosition.value = 0;

    const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out quartic for realistic slot machine deceleration
        const ease = 1 - Math.pow(1 - progress, 4);

        scrollPosition.value = targetPosition * ease;

        if (progress < 1) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            isAnimating.value = false;
            emit('spinComplete', winningRecipe);
        }
    };

    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(animate);
};

onUnmounted(() => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
});
</script>

<template>
    <div class="relative w-full overflow-hidden py-6 md:py-10 bg-muted/20 rounded-xl border-y-2 border-primary/20">
        <!-- Center Indicator Arrows -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 z-20 text-primary">
            <div class="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-primary drop-shadow-md"></div>
        </div>
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 text-primary">
            <div class="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[14px] border-b-primary drop-shadow-md"></div>
        </div>

        <!-- Center Highlight Line -->
        <div class="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[168px] md:w-[228px] border-2 border-primary/40 rounded-lg z-10 pointer-events-none bg-primary/5"></div>

        <!-- Side Fade Overlays -->
        <div class="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
        <div class="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>

        <!-- Scrolling Track - Using LTR internally for predictable math -->
        <div ref="containerRef" class="w-full overflow-hidden" dir="ltr">
            <div 
                class="flex gap-3 md:gap-4"
                :style="{
                    transform: `translate3d(-${scrollPosition}px, 0, 0)`,
                    width: 'max-content',
                    willChange: isAnimating ? 'transform' : 'auto'
                }"
            >
                <div 
                    v-for="(recipe, index) in displayRecipes" 
                    :key="`${recipe.id}-${index}`"
                    class="flex-shrink-0 w-[160px] md:w-[220px]"
                    dir="rtl"
                >
                    <Card class="h-[220px] md:h-[260px] overflow-hidden border-2 hover:border-primary/50 transition-colors">
                        <div class="relative h-28 md:h-36 w-full bg-muted">
                            <img 
                                v-if="recipe.image_url" 
                                :src="recipe.image_url" 
                                :alt="recipe.name" 
                                width="220"
                                height="144"
                                decoding="async"
                                fetchpriority="low"
                                class="w-full h-full object-cover"
                            />
                            <div v-else class="flex h-full items-center justify-center text-muted-foreground">
                                <ChefHat class="h-8 w-8 md:h-12 md:w-12 opacity-20" aria-hidden="true" />
                            </div>
                        </div>
                        <CardContent class="p-2.5 md:p-3 text-center">
                            <h3 class="font-bold text-sm md:text-base truncate mb-1" :title="recipe.name">
                                {{ recipe.name }}
                            </h3>
                            <p class="text-xs text-muted-foreground truncate">
                                {{ recipe.city?.name || 'سوريا' }}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>
