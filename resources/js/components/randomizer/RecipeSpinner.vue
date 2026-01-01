<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import { ChefHat } from 'lucide-vue-next';

export interface Recipe {
    id: number;
    name: string;
    slug: string;
    image_url: string | null;
    author?: { name: string };
    city?: { name: string };
}

const props = defineProps<{
    recipes: Recipe[];
    spinning: boolean;
}>();

const emit = defineEmits<{
    (e: 'spinComplete', winner: Recipe): void;
}>();

const trackRef = ref<HTMLDivElement | null>(null);
let audioContext: AudioContext | null = null;
let lastTickIndex = -1;
let animationFrameId: number | null = null;
let hasStarted = false;

const winnerIndex = ref<number | null>(null);
const translateX = ref(0);
const isAnimating = ref(false);
const showResult = ref(false);

const CARD_WIDTH = 180;
const CARD_GAP = 12;
const CARD_TOTAL = CARD_WIDTH + CARD_GAP;

// Initialize audio context
const initAudio = () => {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.warn('Audio not available');
        }
    }
    return audioContext;
};

// Play tick sound
const playTick = () => {
    if (!audioContext) return;
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 500 + Math.random() * 300;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    } catch (e) {}
};

// Play win sound
const playWinSound = () => {
    if (!audioContext) return;
    try {
        const frequencies = [523, 659, 784, 1047];
        frequencies.forEach((freq, i) => {
            setTimeout(() => {
                const oscillator = audioContext!.createOscillator();
                const gainNode = audioContext!.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext!.destination);
                oscillator.frequency.value = freq;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.12, audioContext!.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext!.currentTime + 0.4);
                oscillator.start(audioContext!.currentTime);
                oscillator.stop(audioContext!.currentTime + 0.4);
            }, i * 80);
        });
    } catch (e) {}
};

// Track animation for tick sounds
const trackAnimationLoop = () => {
    if (!trackRef.value || !isAnimating.value) return;
    
    try {
        const transform = getComputedStyle(trackRef.value).transform;
        if (transform && transform !== 'none') {
            const matrix = new DOMMatrix(transform);
            const currentX = Math.abs(matrix.m41);
            const cardAtCenter = Math.floor(currentX / CARD_TOTAL);
            
            if (cardAtCenter !== lastTickIndex && cardAtCenter >= 0) {
                lastTickIndex = cardAtCenter;
                playTick();
            }
        }
    } catch (e) {}
    
    animationFrameId = requestAnimationFrame(trackAnimationLoop);
};

// Handle spinning state change
watch(() => props.spinning, (newSpinning) => {
    if (newSpinning && props.recipes.length > 0 && !hasStarted) {
        hasStarted = true;
        initAudio();
        
        // Reset for new spin
        showResult.value = false;
        lastTickIndex = -1;
        
        // Pick winner
        const minIndex = Math.max(props.recipes.length - 8, Math.floor(props.recipes.length * 0.7));
        const maxIndex = props.recipes.length - 3;
        const targetIndex = Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;
        
        winnerIndex.value = targetIndex;
        
        // Calculate position
        const winnerCenterOffset = (targetIndex * CARD_TOTAL) + (CARD_WIDTH / 2);
        translateX.value = -winnerCenterOffset;
        
        // Start animating
        isAnimating.value = true;
        animationFrameId = requestAnimationFrame(trackAnimationLoop);
        
        // Complete after 5 seconds
        setTimeout(() => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            
            isAnimating.value = false;
            showResult.value = true;
            playWinSound();
            
            if (winnerIndex.value !== null) {
                emit('spinComplete', props.recipes[winnerIndex.value]);
            }
        }, 5000);
    }
    
    if (!newSpinning && hasStarted) {
        hasStarted = false;
    }
});

// Cleanup
onUnmounted(() => {
    if (audioContext) {
        audioContext.close().catch(() => {});
    }
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});

const currentTransform = computed(() => {
    if (isAnimating.value || showResult.value) {
        return `translateX(${translateX.value}px)`;
    }
    return `translateX(${CARD_TOTAL * 2}px)`;
});

const getCardClass = (index: number) => {
    const isWinner = winnerIndex.value === index && (isAnimating.value || showResult.value);
    if (isWinner && showResult.value) {
        return 'ring-4 ring-primary scale-110 shadow-2xl z-30';
    }
    if (isWinner) {
        return 'ring-2 ring-primary/50 scale-105';
    }
    return 'border-2 border-border';
};
</script>

<template>
    <div class="relative w-full overflow-hidden rounded-xl border bg-background/80 backdrop-blur py-6" dir="ltr">
        <!-- Center Selection Indicator -->
        <div class="absolute left-1/2 top-0 z-20 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-primary via-primary to-primary shadow-lg">
            <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-primary"></div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-primary"></div>
        </div>

        <!-- Edge Fade Gradients -->
        <div class="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
        <div class="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>

        <!-- Scrolling Track Container -->
        <div class="relative h-[220px] flex items-center justify-center overflow-hidden">
            <div
                ref="trackRef"
                class="absolute flex items-center"
                :style="{
                    gap: `${CARD_GAP}px`,
                    left: '50%',
                    transform: currentTransform,
                    transition: isAnimating ? 'transform 5s cubic-bezier(0.15, 0.05, 0.05, 1)' : 'none',
                }"
            >
                <Card
                    v-for="(recipe, index) in recipes"
                    :key="`${recipe.id}-${index}`"
                    :class="[
                        'shrink-0 overflow-hidden transition-all duration-500 relative',
                        getCardClass(index)
                    ]"
                    :style="{ width: `${CARD_WIDTH}px` }"
                    dir="rtl"
                >
                    <div class="relative h-28 w-full bg-muted">
                        <img 
                            v-if="recipe.image_url" 
                            :src="recipe.image_url" 
                            :alt="recipe.name"
                            class="w-full h-full object-cover"
                        />
                        <div v-else class="flex h-full items-center justify-center">
                            <ChefHat class="w-8 h-8 text-muted-foreground/50" />
                        </div>
                    </div>
                    <CardContent class="p-2">
                        <h3 class="truncate font-bold text-sm" :title="recipe.name">
                            {{ recipe.name }}
                        </h3>
                        <p class="truncate text-xs text-muted-foreground">
                            {{ recipe.city?.name }}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</template>
