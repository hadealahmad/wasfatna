<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardDescription from '@/components/ui/CardDescription.vue';
import Dialog from '@/components/ui/Dialog.vue';
import DialogContent from '@/components/ui/DialogContent.vue';
import DialogHeader from '@/components/ui/DialogHeader.vue';
import DialogTitle from '@/components/ui/DialogTitle.vue';
import { Dices, Sparkles, ChefHat, RotateCcw, ArrowLeft, Loader2 } from 'lucide-vue-next';
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
            alert('لم يتم العثور على وصفات بهذه المعايير!');
        }
    } catch (e) {
        console.error(e);
        loading.value = false;
        alert('حدث خطأ ما');
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
    <Head title="شو طابخين اليوم؟" />
    
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
            >
              <Loader2 v-if="loading" class="ml-2 h-5 w-5 animate-spin" />
              <Sparkles v-else class="ml-2 h-5 w-5" />
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
            <Sparkles class="ml-2 h-5 w-5" />
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
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
            </div>

            <!-- Sparkle Decorations -->
            <div class="absolute inset-0 z-10 pointer-events-none overflow-hidden">
              <Sparkles 
                v-for="i in 6" 
                :key="i"
                class="absolute text-yellow-400 animate-pulse"
                :style="{
                  top: `${15 + Math.random() * 70}%`,
                  left: `${10 + Math.random() * 80}%`,
                  animationDelay: `${i * 0.25}s`,
                  opacity: 0.8,
                  width: `${14 + Math.random() * 10}px`,
                  height: `${14 + Math.random() * 10}px`,
                }"
              />
            </div>

            <!-- Image Section -->
            <div class="relative h-52 w-full bg-gradient-to-br from-primary/20 to-secondary/20">
              <img 
                v-if="winner.image_url" 
                :src="winner.image_url" 
                :alt="winner.name" 
                class="w-full h-full object-cover"
              />
              <div v-else class="flex h-full items-center justify-center">
                <ChefHat class="h-16 w-16 text-muted-foreground/30" />
              </div>

              <!-- Winner Badge -->
              <div class="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-1.5 z-30">
                <Sparkles class="h-4 w-4" />
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
                <Link :href="route('recipes.show', winner.slug)">
                  <Button size="lg" class="w-full h-12 text-base font-semibold">
                    <ArrowLeft class="ml-2 h-5 w-5" />
                    عرض الوصفة
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  class="w-full h-12 text-base font-semibold"
                  @click="spinAgain"
                >
                  <RotateCcw class="ml-2 h-5 w-5" />
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
</style>
