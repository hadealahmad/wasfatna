<script setup lang="ts">
import { ref } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardDescription from '@/components/ui/CardDescription.vue';
import Dialog from '@/components/ui/Dialog.vue';
import DialogContent from '@/components/ui/DialogContent.vue';
import { Sparkles, ChefHat, RotateCcw, ArrowLeft, Loader2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import IngredientSelector from '@/components/randomizer/IngredientSelector.vue';
import RecipeSpinner from '@/components/randomizer/RecipeSpinner.vue';

interface Recipe {
    id: number;
    name: string;
    slug: string;
    image_url?: string;
    city?: { name: string };
    author?: { name: string };
}

interface Ingredient {
    id: number;
    name: string;
}

const loading = ref(false);
const isSpinning = ref(false);
const recipes = ref<Recipe[]>([]);
const winner = ref<Recipe | null>(null);
const showModal = ref(false);
const selectedIngredients = ref<Ingredient[]>([]);

const sparkleDecorations = [
    { top: '18%', left: '14%', delay: '0.25s', size: '16px' },
    { top: '26%', left: '78%', delay: '0.5s', size: '20px' },
    { top: '48%', left: '22%', delay: '0.75s', size: '15px' },
    { top: '58%', left: '84%', delay: '1s', size: '22px' },
    { top: '76%', left: '16%', delay: '1.25s', size: '18px' },
    { top: '72%', left: '74%', delay: '1.5s', size: '16px' },
];

const handleIngredientSelect = (ingredient: Ingredient) => {
    if (!selectedIngredients.value.find(i => i.id === ingredient.id)) {
        selectedIngredients.value.push(ingredient);
    }
};

const handleIngredientRemove = (id: number) => {
    selectedIngredients.value = selectedIngredients.value.filter(i => i.id !== id);
};

// Fetch random recipes and start spinning
const startSpin = async () => {
    loading.value = true;
    winner.value = null;
    showModal.value = false;
    recipes.value = [];

    try {
        const excludeIndices = selectedIngredients.value.map(i => i.id);
        const queryParams = new URLSearchParams();
        queryParams.set('count', '10');
        if (excludeIndices.length > 0) {
            queryParams.set('exclude', excludeIndices.join(','));
        }

        // Fetch multiple random recipes for the spinner
        const response = await fetch(`/api/recipes/randomizer?${queryParams.toString()}`);
        const data = await response.json();
        
        if (data.recipes && data.recipes.length > 0) {
            // Duplicate for spinning effect
            let spinRecipes = data.recipes;
            while (spinRecipes.length < 30) {
                spinRecipes = [...spinRecipes, ...data.recipes];
            }
            if (spinRecipes.length > 50) spinRecipes = spinRecipes.slice(0, 50);
            
            recipes.value = spinRecipes;
            
            setTimeout(() => {
                loading.value = false;
                isSpinning.value = true;
                // RecipeSpinner will call onSpinComplete after animation
            }, 100);
        } else {
            loading.value = false;
            toast.error('لم يتم العثور على وصفات بهذه المعايير!');
        }
    } catch (e) {
        console.error(e);
        loading.value = false;
        toast.error('حدث خطأ ما');
    }
};

// When spin completes - called by RecipeSpinner
const onSpinComplete = (wonRecipe: Recipe) => {
    isSpinning.value = false;
    winner.value = wonRecipe;
    
    setTimeout(() => {
        showModal.value = true;
    }, 500);
};

// Spin again
const spinAgain = () => {
    showModal.value = false;
    winner.value = null;
    setTimeout(() => {
        startSpin();
    }, 100);
};
</script>

<template>
  <PublicLayout>
    <Head>
      <title>شو طابخين اليوم؟</title>
      <meta name="robots" content="noindex, follow" head-key="robots" />
      <meta head-key="description" name="description" content="محتار شو تطبخ اليوم؟ استبعد المكونات اللي ما بدك ياها وخلينا نختارلك وصفة سورية شهية بشكل عشوائي!" />
      <meta head-key="og:title" property="og:title" content="شو طابخين اليوم؟ | وصفاتنا" />
      <meta head-key="og:description" property="og:description" content="محتار شو تطبخ اليوم؟ استبعد المكونات اللي ما بدك ياها وخلينا نختارلك وصفة سورية شهية بشكل عشوائي!" />
      <meta head-key="og:image" property="og:image" content="https://food.syrian.zone/og-image.webp" />
      <meta head-key="twitter:title" name="twitter:title" content="شو طابخين اليوم؟ | وصفاتنا" />
      <meta head-key="twitter:description" name="twitter:description" content="محتار شو تطبخ اليوم؟ استبعد المكونات اللي ما بدك ياها وخلينا نختارلك وصفة سورية شهية بشكل عشوائي!" />
      <meta head-key="twitter:image" name="twitter:image" content="https://food.syrian.zone/og-image.webp" />
    </Head>
    
    <div class="container mx-auto max-w-5xl py-8 md:py-12 px-4" dir="rtl">
      <div class="mb-6 md:mb-8 text-center">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">شو طابخين اليوم؟</h1>
        <p class="text-muted-foreground text-base md:text-lg">
          محتار شو تطبخ؟ استبعد المكونات اللي ما بدك ياها وخلينا نختارلك!
        </p>
      </div>

      <div class="grid gap-6 md:gap-8">
        <!-- Main Card -->
        <Card>
          <CardHeader class="pb-4">
            <CardTitle>تصفية النتائج</CardTitle>
            <CardDescription>اختر المكونات التي تريد استبعادها من النتائج.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <IngredientSelector 
                :selected-ingredients="selectedIngredients"
                @select="handleIngredientSelect"
                @remove="handleIngredientRemove"
            />

            <Button
              size="lg"
              class="w-full text-lg font-bold h-14"
              @click="startSpin"
              :disabled="isSpinning || loading"
              :aria-busy="loading || isSpinning || undefined"
            >
              <Loader2 v-if="loading" class="ms-2 h-5 w-5 animate-spin" aria-hidden="true" />
              <Sparkles v-else class="ms-2 h-5 w-5" aria-hidden="true" />
              {{ loading ? 'جاري التحميل...' : isSpinning ? 'جاري التدوير...' : '🎲 يلا نختار!' }}
            </Button>
          </CardContent>
        </Card>

        <!-- Spinner Area -->
        <div v-if="isSpinning || recipes.length > 0" class="my-4 md:my-8">
          <RecipeSpinner
            :recipes="recipes"
            :spinning="isSpinning"
            @spin-complete="onSpinComplete"
          />
        </div>

        <!-- Show Winner Button -->
        <div v-if="winner && !showModal && !isSpinning" class="text-center py-4">
          <Button
            size="lg"
            variant="outline"
            @click="showModal = true"
            class="h-12"
          >
            <Sparkles class="me-2 h-5 w-5" aria-hidden="true" />
            عرض الفائز
          </Button>
        </div>
      </div>

      <!-- Winner Modal -->
      <Dialog v-model:open="showModal">
        <DialogContent class="max-w-md p-0 overflow-hidden border-2 border-primary gap-0" dir="rtl">
          <div v-if="winner" class="relative">
            <!-- Shine Animation Overlay -->
            <div class="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-lg">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-background/30 to-transparent animate-shine"></div>
            </div>

            <!-- Sparkle Decorations -->
            <div class="absolute inset-0 z-10 pointer-events-none overflow-hidden">
              <Sparkles 
                v-for="(sparkle, idx) in sparkleDecorations" 
                :key="idx"
                aria-hidden="true"
                class="absolute text-warning motion-safe:animate-pulse"
                :style="{
                  top: sparkle.top,
                  left: sparkle.left,
                  animationDelay: sparkle.delay,
                  opacity: 0.8,
                  width: sparkle.size,
                  height: sparkle.size,
                }"
              />
            </div>

            <!-- Image Section -->
            <div class="relative h-52 w-full bg-gradient-to-br from-primary/20 to-secondary/20">
              <img 
                v-if="winner.image_url" 
                :src="winner.image_url" 
                :alt="winner.name" 
                decoding="async"
                width="448"
                height="208"
                class="w-full h-full object-cover"
              />
              <div v-else class="flex h-full items-center justify-center">
                <ChefHat class="h-16 w-16 text-muted-foreground/30" aria-hidden="true" />
              </div>

              <!-- Winner Badge -->
              <div class="absolute top-3 start-3 bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-1.5 z-30">
                <Sparkles class="h-4 w-4" aria-hidden="true" />
                🎉 الفائز!
              </div>
            </div>

            <!-- Content Section -->
            <div class="p-5 space-y-4 bg-background">
              <div class="text-center space-y-2">
                <h2 class="text-xl font-bold">{{ winner.name }}</h2>
                <div class="flex items-center justify-center gap-2 text-sm text-muted-foreground flex-wrap">
                  <span v-if="winner.city?.name">{{ winner.city.name }}</span>
                  <template v-if="winner.author">
                    <span>•</span>
                    <span>بواسطة {{ winner.author.name }}</span>
                  </template>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col gap-3 pt-2">
                <Button as-child size="lg" class="w-full h-12 text-base font-semibold">
                  <Link :href="route('recipes.show', winner.slug)">
                    <ArrowLeft class="ms-2 h-5 w-5" aria-hidden="true" />
                    عرض الوصفة
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  class="w-full h-12 text-base font-semibold"
                  @click="spinAgain"
                >
                  <RotateCcw class="ms-2 h-5 w-5" aria-hidden="true" />
                  دوّر مرة ثانية
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </PublicLayout>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  @keyframes shine {
    0% { 
      transform: translateX(-150%) skewX(-15deg); 
    }
    40% { 
      transform: translateX(150%) skewX(-15deg); 
    }
    100% { 
      transform: translateX(150%) skewX(-15deg); 
    }
  }

  .animate-shine {
    animation: shine 2.5s ease-in-out infinite;
    transform: skewX(-15deg);
  }
}
</style>
