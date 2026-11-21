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

const tagColors = [
    'bg-chart-1/15 text-chart-1 border-chart-1/30',
    'bg-chart-2/15 text-chart-2 border-chart-2/30',
    'bg-chart-3/15 text-chart-3 border-chart-3/30',
    'bg-chart-4/15 text-chart-4 border-chart-4/30',
    'bg-chart-5/15 text-chart-5 border-chart-5/30',
    'bg-chart-6/15 text-chart-6 border-chart-6/30',
];

const getTagColor = (mealType: string) => {
    let hash = 0;
    for (let i = 0; i < mealType.length; i++) hash = mealType.charCodeAt(i) + ((hash << 5) - hash);
    return tagColors[Math.abs(hash) % tagColors.length];
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
                decoding="async"
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
                <Badge :class="getTagColor(entry.meal_type)" class="text-xs px-1.5 py-0">
                    {{ entry.meal_type }}
                </Badge>
                <StickyNote v-if="entry.notes" class="h-3 w-3 text-muted-foreground shrink-0" aria-hidden="true" />
            </div>
            <p v-if="entry.notes" class="text-xs text-muted-foreground truncate mt-0.5">{{ entry.notes }}</p>
        </div>

        <Link
            v-if="entry.recipe"
            :href="`/recipes/${entry.recipe.slug}`"
            :aria-label="`فتح وصفة ${entry.title}`"
            @click.stop
            class="shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
        >
            <ExternalLink class="h-3.5 w-3.5" aria-hidden="true" />
        </Link>

        <Button
            v-if="!readonly"
            type="button"
            variant="ghost"
            size="icon"
            :aria-label="`حذف ${entry.title}`"
            class="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
            @click.stop="removeEntry"
            :disabled="loading"
        >
            <Trash2 class="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
    </div>
</template>
