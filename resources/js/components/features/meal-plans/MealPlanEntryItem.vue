<script setup lang="ts">
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import { Trash2, StickyNote, ExternalLink } from 'lucide-vue-next';
import type { MealPlanEntry } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'vue-sonner';

const props = defineProps<{
    entry: MealPlanEntry;
    planId: number;
    readonly?: boolean;
}>();

const emit = defineEmits<{
    removed: [id: number];
    toggled: [id: number, isDone: boolean];
}>();

const loading = ref(false);

const mealTypeLabels: Record<string, string> = {
    main: 'رئيسي',
    iftar: 'إفطار',
    suhoor: 'سحور',
    dessert: 'حلويات',
};

const mealTypeColors: Record<string, string> = {
    main: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    iftar: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    suhoor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    dessert: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
};

const toggleDone = async () => {
    if (props.readonly) return;
    loading.value = true;
    try {
        const res = await fetch(route('web-api.meal-plans.entries.done', { mealPlan: props.planId, entry: props.entry.id }), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'Accept': 'application/json',
            },
        });
        const data = await res.json();
        emit('toggled', props.entry.id, data.is_done);
    } catch {
        toast.error('حدث خطأ');
    } finally {
        loading.value = false;
    }
};

const removeEntry = async () => {
    if (props.readonly) return;
    loading.value = true;
    try {
        await fetch(route('web-api.meal-plans.entries.destroy', { mealPlan: props.planId, entry: props.entry.id }), {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'Accept': 'application/json',
            },
        });
        emit('removed', props.entry.id);
    } catch {
        toast.error('حدث خطأ');
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div :class="cn(
        'flex items-center gap-3 p-2 rounded-lg border transition-colors group',
        entry.is_done ? 'bg-muted/50 border-muted' : 'bg-card border-border hover:border-primary/30'
    )">
        <Checkbox
            v-if="!readonly"
            :checked="entry.is_done"
            @update:checked="toggleDone"
            :disabled="loading"
            class="shrink-0"
        />

        <div v-if="entry.recipe?.image_url" class="shrink-0">
            <img
                :src="entry.recipe.image_url"
                :alt="entry.title"
                class="w-8 h-8 rounded object-cover"
                loading="lazy"
                width="32"
                height="32"
            />
        </div>

        <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
                <span :class="cn('text-sm font-medium truncate', entry.is_done && 'line-through text-muted-foreground')">
                    <Link v-if="entry.recipe" :href="`/recipes/${entry.recipe.slug}`" class="hover:text-primary" @click.stop>
                        {{ entry.title }}
                    </Link>
                    <span v-else>{{ entry.title }}</span>
                </span>
                <Badge :class="mealTypeColors[entry.meal_type]" class="text-[10px] px-1.5 py-0">
                    {{ mealTypeLabels[entry.meal_type] }}
                </Badge>
                <StickyNote v-if="entry.notes" class="h-3 w-3 text-muted-foreground shrink-0" />
            </div>
            <p v-if="entry.notes" class="text-xs text-muted-foreground truncate mt-0.5">{{ entry.notes }}</p>
        </div>

        <Link
            v-if="entry.recipe"
            :href="`/recipes/${entry.recipe.slug}`"
            @click.stop
            class="shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
        >
            <ExternalLink class="h-3.5 w-3.5" />
        </Link>

        <Button
            v-if="!readonly"
            variant="ghost"
            size="icon"
            class="h-7 w-7 shrink-0 text-muted-foreground hover:text-red-500"
            @click.stop="removeEntry"
            :disabled="loading"
        >
            <Trash2 class="h-3.5 w-3.5" />
        </Button>
    </div>
</template>
