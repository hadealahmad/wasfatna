<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { usePage, router } from '@inertiajs/vue3';
import axios from 'axios';
import Dialog from '@/components/ui/Dialog.vue';
import DialogContent from '@/components/ui/DialogContent.vue';
import DialogHeader from '@/components/ui/DialogHeader.vue';
import DialogTitle from '@/components/ui/DialogTitle.vue';
import DialogTrigger from '@/components/ui/DialogTrigger.vue';
import DialogDescription from '@/components/ui/DialogDescription.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Label from '@/components/ui/Label.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import { Heart, Plus } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

interface List {
    id: number;
    name: string;
    is_default: boolean;
    recipes_count?: number;
    has_recipe?: boolean;
}

const props = defineProps<{
    recipeId: number;
}>();

const page = usePage();
const user = computed(() => page.props.auth?.user);
const isAuthenticated = computed(() => !!user.value);

const open = ref(false);
const lists = ref<List[]>([]);
const newListName = ref('');
const loading = ref(false);
const creating = ref(false);
const selectedLists = ref<number[]>([]);

// Fetch lists when dialog opens
watch(open, async (isOpen) => {
    if (isOpen && isAuthenticated.value) {
        await fetchLists();
    }
});

const fetchLists = async () => {
    loading.value = true;
    try {
        const response = await axios.get(`/web-api/lists?recipe_id=${props.recipeId}`);
        const data = response.data;
        // API might return { lists: [...] } or just [...]
        const listData = Array.isArray(data) ? data : (data.lists || []);
        lists.value = listData;
        selectedLists.value = listData.filter((l: List) => l.has_recipe).map((l: List) => l.id);
    } catch (error) {
        console.error('Failed to fetch lists', error);
        lists.value = [];
    } finally {
        loading.value = false;
    }
};

const handleToggle = async (listId: number, checked: boolean) => {
    const previouslySelected = selectedLists.value.includes(listId);
    
    // Optimistic update
    if (checked) {
        selectedLists.value = [...selectedLists.value, listId];
    } else {
        selectedLists.value = selectedLists.value.filter(id => id !== listId);
    }
    
    try {
        const response = await axios.post(`/web-api/lists/${listId}/toggle`, {
            recipe_id: props.recipeId
        });
        const res = response.data;
        
        if (res.added !== checked) {
            // Revert if mismatch
            if (res.added) selectedLists.value = [...selectedLists.value, listId];
            else selectedLists.value = selectedLists.value.filter(id => id !== listId);
        }
        toast.success(res.message || (res.added ? 'تمت الإضافة للقائمة' : 'تمت الإزالة من القائمة'));
    } catch (error) {
        // Revert on error
        if (previouslySelected) selectedLists.value = [...selectedLists.value, listId];
        else selectedLists.value = selectedLists.value.filter(id => id !== listId);
        toast.error('حدث خطأ أثناء التحديث');
    }
};

const handleCreateList = async () => {
    if (!newListName.value.trim()) return;
    creating.value = true;
    try {
        const response = await axios.post('/web-api/lists', {
            name: newListName.value,
            is_public: false
        });
        
        const newList = response.data;
        // Ensure lists.value is an array before spreading
        const currentLists = Array.isArray(lists.value) ? lists.value : [];
        lists.value = [newList, ...currentLists];
        newListName.value = '';
        if (newList.id) {
            await handleToggle(newList.id, true);
        }
        toast.success('تم إنشاء القائمة');
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('API Error:', error.response?.status, error.response?.data);
        }
        console.error('Failed to create list', error);
        toast.error('فشل في إنشاء القائمة');
    } finally {
        creating.value = false;
    }
};

const handleGoogleLogin = () => {
    window.location.href = '/auth/google';
};
</script>

<template>
    <Dialog v-model:open="open">
        <DialogTrigger as-child>
            <slot>
                <Button variant="outline" size="sm" class="gap-2">
                    <Heart 
                        :class="[
                            'w-4 h-4',
                            (Array.isArray(lists) ? lists : []).some(l => l.is_default && selectedLists.includes(l.id))
                                ? 'fill-red-500 text-red-500' 
                                : ''
                        ]" 
                    />
                    <span>حفظ</span>
                </Button>
            </slot>
        </DialogTrigger>
        
        <DialogContent class="sm:max-w-md" dir="rtl">
            <!-- Not authenticated state -->
            <div v-if="!isAuthenticated" class="flex flex-col items-center justify-center py-6 text-center space-y-4">
                <div class="bg-muted p-3 rounded-full">
                    <Heart class="h-6 w-6 text-muted-foreground" />
                </div>
                <DialogHeader>
                    <DialogTitle class="text-center">تسجيل الدخول مطلوب</DialogTitle>
                    <DialogDescription class="text-center">
                        يرجى تسجيل الدخول لتمكن من حفظ الوصفات في قوائمك.
                    </DialogDescription>
                </DialogHeader>
                <Button @click="handleGoogleLogin" class="gap-2 w-full sm:w-auto">
                    <svg class="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    تسجيل الدخول باستخدام Google
                </Button>
            </div>
            
            <!-- Authenticated state -->
            <template v-else>
                <DialogHeader>
                    <DialogTitle>إضافة إلى قائمة</DialogTitle>
                </DialogHeader>
                
                <div class="flex flex-col gap-4 py-4">
                    <div class="flex items-center gap-2">
                        <Input
                            v-model="newListName"
                            placeholder="اسم القائمة الجديدة..."
                            class="bg-muted/50"
                        />
                        <Button
                            @click="handleCreateList"
                            :disabled="!newListName.trim() || creating"
                            size="icon"
                            variant="secondary"
                        >
                            <Plus class="h-4 w-4" />
                        </Button>
                    </div>
                    
                    <div class="max-h-[300px] overflow-y-auto space-y-2">
                        <Label
                            v-for="list in lists"
                            :key="list.id"
                            :for="`list-${list.id}`"
                            :class="[
                                'flex items-center space-x-3 space-x-reverse p-3 rounded-lg border cursor-pointer transition-all',
                                selectedLists.includes(list.id) 
                                    ? 'border-primary bg-primary/5' 
                                    : 'border-transparent hover:bg-accent'
                            ]"
                            @click.prevent="handleToggle(list.id, !selectedLists.includes(list.id))"
                        >
                            <Checkbox
                                :checked="selectedLists.includes(list.id)"
                                :id="`list-${list.id}`"
                                class="h-5 w-5"
                            />
                            <div class="flex-1 flex items-center justify-between">
                                <span class="font-medium">
                                    {{ list.name }}
                                    <span v-if="list.is_default" class="text-xs text-muted-foreground mr-2 font-normal">(افتراضي)</span>
                                </span>
                                <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                    {{ list.recipes_count ?? 0 }} وصفة
                                </span>
                            </div>
                        </Label>
                    </div>
                </div>
            </template>
        </DialogContent>
    </Dialog>
</template>
