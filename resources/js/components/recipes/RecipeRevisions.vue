<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { usePage, router } from '@inertiajs/vue3';
import axios from 'axios';
import { 
    Sheet, SheetContent, SheetHeader, SheetTitle,
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
    Button, Badge
} from '@/components/ui';
import { History, RotateCcw, Eye, Loader2 } from 'lucide-vue-next';

interface Revision {
    id: number;
    user_name: string;
    change_summary: string;
    created_at: string;
    content?: any;
}

const props = defineProps<{
    slug: string;
    recipeId: number;
}>();

const page = usePage();
const user = computed(() => page.props.auth?.user);
const canModerate = computed(() => ['admin', 'moderator'].includes(user.value?.role));

const isOpen = ref(false);
const isLoading = ref(false);
const revisions = ref<Revision[]>([]);
const selectedRevision = ref<Revision | null>(null);
const isPreviewOpen = ref(false);
const isRestoring = ref(false);

watch(isOpen, async (open) => {
    if (open && canModerate.value) {
        await loadHistory();
    }
});

const loadHistory = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get(`/api/recipes/${props.recipeId}/history`);
        const data = response.data;
        revisions.value = data.revisions || [];
    } catch (error) {
        console.error('Failed to load history', error);
    } finally {
        isLoading.value = false;
    }
};

const handlePreview = (revision: Revision) => {
    selectedRevision.value = revision;
    isPreviewOpen.value = true;
};

const formatTimeNeeded = (time: any) => {
    if (!time) return 'غير محدد';
    if (Array.isArray(time)) return time.join(', ');
    if (typeof time === 'object') return Object.values(time).join(', ');
    return time;
};

const handleRestore = async () => {
    if (!selectedRevision.value) return;
    if (!confirm('هل أنت متأكد من استعادة هذه النسخة؟ سيتم حفظ النسخة الحالية في السجل.')) return;
    
    isRestoring.value = true;
    try {
        const content = selectedRevision.value.content;
        if (!content) throw new Error('Revision content is missing');
        
        const payload = {
            name: content.name,
            time_needed: content.time_needed,
            servings: content.servings,
            difficulty: content.difficulty,
            steps: content.steps,
            ingredients: content.ingredients,
            tags: content.tags?.map((t: any) => t.name)
        };
        
        const response = await axios.put(`/api/recipes/${props.recipeId}`, payload);
        
        alert('تم استعادة النسخة بنجاح');
        isOpen.value = false;
        isPreviewOpen.value = false;
        router.reload();
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Update failed:', error.response?.data);
        }
        console.error('Restore failed', error);
        alert('فشل الاستعادة');
    } finally {
        isRestoring.value = false;
    }
};
</script>

<template>
    <template v-if="canModerate">
        <Button variant="outline" size="sm" @click="isOpen = true" class="gap-2">
            <History class="w-4 h-4" />
            سجل التعديلات
        </Button>
        
        <Sheet v-model:open="isOpen">
            <SheetContent side="left" class="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>سجل تعديلات الوصفة</SheetTitle>
                    <p class="text-sm text-muted-foreground">
                        يمكنك مشاهدة جميع التعديلات السابقة واستعادتها
                    </p>
                </SheetHeader>
                
                <div class="h-[calc(100vh-120px)] mt-6 pr-4 overflow-y-auto">
                    <div v-if="isLoading" class="flex justify-center py-8">
                        <Loader2 class="w-6 h-6 animate-spin" />
                    </div>
                    
                    <p v-else-if="revisions.length === 0" class="text-center text-muted-foreground py-8">
                        لا يوجد تعديلات سابقة
                    </p>
                    
                    <div v-else class="space-y-4">
                        <div 
                            v-for="rev in revisions" 
                            :key="rev.id" 
                            class="border rounded-lg p-4 space-y-2 hover:bg-muted/50 transition-colors"
                        >
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="font-semibold text-sm">{{ rev.user_name }}</p>
                                    <p class="text-xs text-muted-foreground">
                                        {{ new Date(rev.created_at).toLocaleString('ar-EG', { dateStyle: 'long', timeStyle: 'short' }) }}
                                    </p>
                                </div>
                                <Badge variant="outline" class="text-xs">
                                    {{ rev.change_summary }}
                                </Badge>
                            </div>
                            
                            <Button
                                variant="ghost"
                                size="sm"
                                class="w-full mt-2 gap-2 text-primary hover:text-primary/90"
                                @click="handlePreview(rev)"
                            >
                                <Eye class="w-4 h-4" />
                                معاينة و استعادة
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
        
        <Dialog v-model:open="isPreviewOpen">
            <DialogContent class="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>معاينة النسخة</DialogTitle>
                    <DialogDescription v-if="selectedRevision">
                        {{ new Date(selectedRevision.created_at).toLocaleString('ar-EG', { dateStyle: 'long', timeStyle: 'short' }) }}
                    </DialogDescription>
                </DialogHeader>
                
                <div v-if="selectedRevision?.content" class="space-y-6 py-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <h4 class="font-semibold mb-2">اسم الوصفة</h4>
                            <p class="text-sm p-2 bg-muted rounded">{{ selectedRevision.content.name }}</p>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-2">الوقت / الحصص</h4>
                            <p class="text-sm p-2 bg-muted rounded">
                                {{ formatTimeNeeded(selectedRevision.content.time_needed) }} / {{ selectedRevision.content.servings }}
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="font-semibold mb-2">المكونات</h4>
                        <ul class="text-sm space-y-1 p-2 bg-muted rounded max-h-40 overflow-y-auto">
                            <li v-for="(ing, i) in selectedRevision.content.ingredients" :key="i">
                                • {{ ing.amount }} {{ ing.unit }} {{ ing.name }}
                            </li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 class="font-semibold mb-2">الخطوات</h4>
                        <ol class="text-sm space-y-2 p-2 bg-muted rounded max-h-40 overflow-y-auto list-decimal list-inside">
                            <li v-for="(step, i) in selectedRevision.content.steps" :key="i">{{ step }}</li>
                        </ol>
                    </div>
                </div>
                
                <DialogFooter class="gap-2 sm:gap-0">
                    <Button variant="outline" @click="isPreviewOpen = false">
                        إلغاء
                    </Button>
                    <Button @click="handleRestore" :disabled="isRestoring" class="gap-2">
                        <Loader2 v-if="isRestoring" class="w-4 h-4 animate-spin" />
                        <RotateCcw v-else class="w-4 h-4" />
                        استعادة هذه النسخة
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </template>
</template>
