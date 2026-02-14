<script setup lang="ts">
import { ref, watch } from 'vue';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
    Button, Input, Label, Textarea,
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui';
import { Plus, Search, Loader2 } from 'lucide-vue-next';
import { useDebounceFn } from '@vueuse/core';
import { toast } from 'vue-sonner';
import type { MealPlanEntry, Tag } from '@/types';

const props = defineProps<{
    planId: number;
    date: string;
    tags?: Tag[];
}>();

const emit = defineEmits<{
    added: [entry: MealPlanEntry];
}>();

const open = ref(false);
const loading = ref(false);

// Recipe search
const searchQuery = ref('');
const searchResults = ref<any[]>([]);
const searching = ref(false);
const selectedRecipe = ref<any>(null);

// Form fields
const customTitle = ref('');
const notes = ref('');
const mealType = ref(props.tags?.[0]?.slug || 'main');

const searchRecipes = useDebounceFn(async () => {
    if (searchQuery.value.length < 2) {
        searchResults.value = [];
        return;
    }
    searching.value = true;
    try {
        const res = await fetch(route('web-api.recipes.search') + `?q=${encodeURIComponent(searchQuery.value)}`, {
            headers: { 'Accept': 'application/json' },
        });
        searchResults.value = await res.json();
    } catch {
        searchResults.value = [];
    } finally {
        searching.value = false;
    }
}, 300);

watch(searchQuery, () => {
    searchRecipes();
});

const selectRecipe = (recipe: any) => {
    selectedRecipe.value = recipe;
    searchQuery.value = recipe.name;
    searchResults.value = [];
};

const clearRecipe = () => {
    selectedRecipe.value = null;
    searchQuery.value = '';
};

const handleSubmit = async () => {
    if (!selectedRecipe.value && !customTitle.value.trim()) {
        toast.error('اختر وصفة أو أدخل عنوان مخصص');
        return;
    }

    loading.value = true;
    try {
        const res = await fetch(route('web-api.meal-plans.entries.store', { mealPlan: props.planId }), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                date: props.date,
                recipe_id: selectedRecipe.value?.id || null,
                custom_title: customTitle.value.trim() || null,
                notes: notes.value.trim() || null,
                meal_type: mealType.value,
            }),
        });

        if (!res.ok) {
            const err = await res.json();
            toast.error(err.message || 'حدث خطأ');
            return;
        }

        const entry = await res.json();
        emit('added', entry);
        toast.success('تمت الإضافة');
        resetForm();
        open.value = false;
    } catch {
        toast.error('حدث خطأ');
    } finally {
        loading.value = false;
    }
};

const resetForm = () => {
    searchQuery.value = '';
    searchResults.value = [];
    selectedRecipe.value = null;
    customTitle.value = '';
    notes.value = '';
    mealType.value = props.tags?.[0]?.slug || 'main';
};
</script>

<template>
    <Dialog v-model:open="open">
        <DialogTrigger asChild>
            <slot>
                <Button variant="ghost" size="sm" class="gap-1 text-xs h-7">
                    <Plus class="w-3.5 h-3.5" />
                    إضافة
                </Button>
            </slot>
        </DialogTrigger>
        <DialogContent class="sm:max-w-md" dir="rtl">
            <DialogHeader>
                <DialogTitle>إضافة وجبة</DialogTitle>
            </DialogHeader>
            <form @submit.prevent="handleSubmit" class="space-y-4 py-4">
                <!-- Recipe Search -->
                <div class="space-y-2">
                    <Label>بحث عن وصفة</Label>
                    <div class="relative">
                        <Search class="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            v-model="searchQuery"
                            placeholder="ابحث عن وصفة..."
                            class="pr-9"
                            @focus="selectedRecipe && clearRecipe()"
                        />
                        <Loader2 v-if="searching" class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
                    </div>
                    <!-- Search Results -->
                    <div v-if="searchResults.length > 0 && !selectedRecipe" class="border rounded-lg max-h-48 overflow-y-auto">
                        <button
                            v-for="recipe in searchResults"
                            :key="recipe.id"
                            type="button"
                            class="flex items-center gap-3 w-full p-2 hover:bg-muted text-right transition-colors"
                            @click="selectRecipe(recipe)"
                        >
                            <img v-if="recipe.image_url" :src="recipe.image_url" class="w-8 h-8 rounded object-cover" loading="lazy" width="32" height="32" />
                            <div v-else class="w-8 h-8 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">🍽</div>
                            <span class="text-sm truncate">{{ recipe.name }}</span>
                        </button>
                    </div>
                    <div v-if="selectedRecipe" class="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg p-2">
                        <img v-if="selectedRecipe.image_url" :src="selectedRecipe.image_url" class="w-8 h-8 rounded object-cover" width="32" height="32" />
                        <span class="text-sm font-medium flex-1">{{ selectedRecipe.name }}</span>
                        <Button type="button" variant="ghost" size="sm" @click="clearRecipe" class="h-6 px-2 text-xs">إزالة</Button>
                    </div>
                </div>

                <!-- Custom Title (when no recipe selected) -->
                <div v-if="!selectedRecipe" class="space-y-2">
                    <Label>أو عنوان مخصص</Label>
                    <Input v-model="customTitle" placeholder="مثال: فتوش، سلطة..." />
                </div>

                <!-- Meal Type -->
                <div class="space-y-2">
                    <Label>نوع الوجبة</Label>
                    <Select v-model="mealType">
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="tag in (props.tags || [])" :key="tag.id" :value="tag.slug">{{ tag.name }}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Notes -->
                <div class="space-y-2">
                    <Label>ملاحظات (اختياري)</Label>
                    <Textarea v-model="notes" placeholder="أي ملاحظات إضافية..." rows="2" />
                </div>

                <div class="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" @click="open = false">إلغاء</Button>
                    <Button type="submit" :disabled="loading || (!selectedRecipe && !customTitle.trim())">
                        <Loader2 v-if="loading" class="h-4 w-4 ml-2 animate-spin" />
                        {{ loading ? 'جاري الإضافة...' : 'إضافة' }}
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
</template>
