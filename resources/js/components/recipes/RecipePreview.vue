<script setup lang="ts">
import { computed } from 'vue';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    Badge, Card, CardContent, CardHeader, CardTitle,
    Avatar, AvatarFallback,
} from '@/components/ui';
import { MapPin, Clock, Utensils, Tag as TagIcon } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/vue3';

interface IngredientItem {
    amount: string;
    unit: string;
    name: string;
    descriptor: string;
}

interface IngredientGroup {
    name: string;
    items: IngredientItem[];
}

interface StepGroup {
    name: string;
    items: string[];
}

interface Tag {
    id: number;
    name: string;
}

interface City {
    id: number;
    name: string;
}

const props = defineProps<{
    open: boolean;
    name: string;
    description?: string;
    imagePreview: string | null;
    difficulty: string;
    servings: string;
    cityName: string | null;
    tags: Tag[];
    ingredientGroups: IngredientGroup[];
    stepGroups: StepGroup[];
    timeNeeded: any;
}>();

const emit = defineEmits<{
    'update:open': [value: boolean];
}>();

const page = usePage();
const userName = computed(() => page.props.auth?.user?.name || '');

const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
        'سهلة جداً': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        'سهلة': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        'متوسطة': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        'صعبة': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
        'صعبة جداً': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
};

const formatIngredient = (item: IngredientItem) => {
    return [item.amount, item.unit, item.name, item.descriptor].filter(Boolean).join(' ');
};

const formatTimeNeeded = (time: any) => {
    if (!time) return null;
    if (typeof time === 'string') return [time];
    if (Array.isArray(time)) return time;
    if (typeof time === 'object') {
        const parts: string[] = [];
        const prep = parseInt(time.prep) || 0;
        const cook = parseInt(time.cook) || 0;
        if (prep) parts.push(`تحضير: ${prep} دقيقة`);
        if (cook) parts.push(`طبخ: ${cook} دقيقة`);
        if (!parts.length) {
            Object.entries(time).forEach(([key, value]) => {
                if (value) parts.push(`${key}: ${value}`);
            });
        }
        return parts.length ? parts : null;
    }
    return null;
};

const timeParts = computed(() => formatTimeNeeded(props.timeNeeded));

const today = new Date().toLocaleDateString('ar-SY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});
</script>

<template>
    <Dialog :open="open" @update:open="emit('update:open', $event)">
        <DialogContent class="max-w-3xl max-h-[85vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
                <DialogTitle>معاينة الوصفة</DialogTitle>
            </DialogHeader>

            <div class="space-y-6 py-2">
                <!-- Image -->
                <div class="relative aspect-video rounded-xl overflow-hidden bg-muted">
                    <img v-if="imagePreview" :src="imagePreview" :alt="name" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20">
                        <span class="text-7xl">🍽️</span>
                    </div>
                </div>

                <!-- Title -->
                <h2 class="text-2xl md:text-3xl font-bold">{{ name || 'اسم الوصفة' }}</h2>

                <!-- Description -->
                <p v-if="description" class="text-muted-foreground leading-relaxed">{{ description }}</p>

                <!-- Tags & Location -->
                <div v-if="cityName || tags.length" class="flex flex-wrap items-center gap-2 text-sm">
                    <Badge v-if="cityName" variant="secondary" class="gap-1 px-3 py-1 bg-muted/50 border-muted-foreground/20">
                        <MapPin class="w-3.5 h-3.5" />
                        {{ cityName }}
                    </Badge>
                    <Badge v-for="tag in tags" :key="tag.id" variant="outline" class="gap-1 px-3 py-1 border-muted-foreground/20">
                        <TagIcon class="w-3.5 h-3.5" />
                        {{ tag.name }}
                    </Badge>
                </div>

                <!-- Time & Servings & Difficulty -->
                <div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div v-if="timeParts" class="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                        <Clock class="w-4 h-4 text-primary" />
                        <div class="flex gap-1.5 flex-wrap">
                            <span v-for="(t, i) in timeParts" :key="i" class="bg-background px-2 py-0.5 rounded-md border text-xs font-medium shadow-sm">{{ t }}</span>
                        </div>
                    </div>
                    <div v-if="servings" class="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                        <Utensils class="w-4 h-4 text-primary" />
                        <span class="font-medium">{{ servings }}{{ servings.includes('شخص') ? '' : ' أشخاص' }}</span>
                    </div>
                    <Badge v-if="difficulty" :class="cn('mr-auto', getDifficultyColor(difficulty))">
                        {{ difficulty }}
                    </Badge>
                </div>

                <!-- Author -->
                <div v-if="userName" class="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Avatar>
                        <AvatarFallback>{{ userName.charAt(0) }}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p class="font-medium">{{ userName }}</p>
                        <p class="text-sm text-muted-foreground">نُشرت في {{ today }}</p>
                    </div>
                </div>

                <hr class="border-border" />

                <!-- Ingredients & Steps -->
                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Ingredients -->
                    <Card>
                        <CardHeader>
                            <CardTitle class="flex items-center gap-2">
                                <span>🥗</span>
                                المكونات
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div v-for="(group, gi) in ingredientGroups" :key="gi" class="mb-4 last:mb-0">
                                <h4 v-if="group.name && ingredientGroups.length > 1" class="font-semibold mb-2 text-sm text-muted-foreground">{{ group.name }}</h4>
                                <ul class="space-y-2">
                                    <li v-for="(item, ii) in group.items" :key="ii" class="flex items-start gap-2 text-sm">
                                        <span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0"></span>
                                        {{ formatIngredient(item) }}
                                    </li>
                                </ul>
                            </div>
                            <p v-if="!ingredientGroups.length" class="text-sm text-muted-foreground">لم تتم إضافة مكونات بعد</p>
                        </CardContent>
                    </Card>

                    <!-- Steps -->
                    <Card>
                        <CardHeader>
                            <CardTitle class="flex items-center gap-2">
                                <span>👨‍🍳</span>
                                خطوات التحضير
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div v-for="(group, gi) in stepGroups" :key="gi" class="mb-4 last:mb-0">
                                <h4 v-if="group.name && stepGroups.length > 1" class="font-semibold mb-2 text-sm text-muted-foreground">{{ group.name }}</h4>
                                <ol class="space-y-3">
                                    <li v-for="(step, si) in group.items" :key="si" class="flex gap-3 text-sm">
                                        <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{{ si + 1 }}</span>
                                        <span class="pt-0.5">{{ step }}</span>
                                    </li>
                                </ol>
                            </div>
                            <p v-if="!stepGroups.length" class="text-sm text-muted-foreground">لم تتم إضافة خطوات بعد</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>
