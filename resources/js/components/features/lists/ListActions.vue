<script setup lang="ts">
import { ref, computed } from 'vue';
import { useForm, usePage, router } from '@inertiajs/vue3';
import { MoreVertical, Pencil, Trash2, Globe, Lock, Share, Upload } from 'lucide-vue-next';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Input,
  Label
} from '@/components/ui';
import { toast } from 'vue-sonner';

const props = defineProps<{
  list: any;
}>();

const page = usePage();
const currentUser = computed(() => page.props.auth?.user);
const isOwner = computed(() => currentUser.value && currentUser.value.id === props.list.user_id);

// Dialog States
const editOpen = ref(false);
const publishConfirmOpen = ref(false);
const unpublishConfirmOpen = ref(false);
const deleteConfirmOpen = ref(false);

const form = useForm({
    name: props.list.name,
    description: props.list.description || '',
    is_public: props.list.is_public
});

const handleShare = () => {
    const url = `${window.location.protocol}//${window.location.host}/lists/${props.list.id}`;
    navigator.clipboard.writeText(url);
    toast.success('تم نسخ رابط القائمة');
};

const handleDelete = () => {
    router.delete(route('my.lists.destroy', props.list.id), {
        onSuccess: () => toast.success('تم حذف القائمة'),
        onError: () => toast.error('فشل في حذف القائمة')
    });
};

const handleUpdate = () => {
    form.put(route('my.lists.update', props.list.id), {
        onSuccess: () => {
            toast.success('تم تحديث القائمة');
            editOpen.value = false;
        },
        onError: () => toast.error('فشل في تحديث القائمة')
    });
};

const handlePublishRequest = () => {
    router.post(route('my.lists.request-publish', props.list.id), {}, {
        onSuccess: () => {
            toast.success('تم إرسال طلب النشر للمراجعة');
            publishConfirmOpen.value = false;
        },
        onError: (errors: any) => {
            toast.error(errors.message || 'فشل طلب النشر');
        }
    });
};

const handleUnpublish = () => {
    router.post(route('my.lists.unpublish', props.list.id), {}, {
        onSuccess: () => {
            toast.success('تم إلغاء نشر القائمة');
            unpublishConfirmOpen.value = false;
        },
        onError: () => toast.error('فشل إلغاء النشر')
    });
};
</script>

<template>
    <div v-if="isOwner" class="flex items-center gap-2">
        <!-- Share Button -->
        <Button variant="outline" size="icon" @click="handleShare" title="مشاركة">
            <Share class="w-4 h-4" />
        </Button>

        <!-- Edit Button -->
        <Button variant="outline" class="gap-2" @click="editOpen = true">
            <Pencil class="w-4 h-4" />
            تعديل
        </Button>

        <!-- Publish Button (for Drafts) -->
        <Button 
            v-if="!list.is_default && !list.is_public && list.status === 'draft'" 
            class="gap-2" 
            @click="publishConfirmOpen = true"
        >
            <Upload class="w-4 h-4" />
            نشر
        </Button>

        <!-- In Review Status -->
        <Button 
            v-if="list.status === 'review'" 
            variant="secondary" 
            disabled 
            class="gap-2 opacity-80"
        >
            <Upload class="w-4 h-4" />
            قيد المراجعة
        </Button>

        <!-- Unpublish Button for Approved/Public Lists -->
        <Button 
            v-if="list.is_public && list.status === 'approved'"
            variant="secondary" 
            class="gap-2 text-orange-600 hover:text-orange-700" 
            @click="unpublishConfirmOpen = true"
        >
            <Upload class="w-4 h-4 rotate-180" />
            إلغاء النشر
        </Button>

        <!-- Delete Button (Not for default lists) -->
        <Button 
            v-if="!list.is_default"
            variant="destructive" 
            class="gap-2" 
            @click="deleteConfirmOpen = true"
        >
            <Trash2 class="w-4 h-4" />
            حذف
        </Button>

        <!-- Edit Dialog -->
        <Dialog v-model:open="editOpen">
            <DialogContent class="sm:max-w-md" dir="rtl">
                <DialogHeader>
                    <DialogTitle>تعديل القائمة</DialogTitle>
                </DialogHeader>
                <form @submit.prevent="handleUpdate" class="space-y-4 py-4">
                    <div class="space-y-2">
                        <Label htmlFor="edit-name">اسم القائمة</Label>
                        <Input
                            id="edit-name"
                            v-model="form.name"
                            required
                        />
                        <div v-if="form.errors.name" class="text-sm text-red-500">{{ form.errors.name }}</div>
                    </div>
                    <div class="space-y-2">
                        <Label htmlFor="edit-description">وصف</Label>
                        <Input
                            id="edit-description"
                            v-model="form.description"
                        />
                         <div v-if="form.errors.description" class="text-sm text-red-500">{{ form.errors.description }}</div>
                    </div>
                     <div class="flex items-center gap-2 py-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            @click="form.is_public = !form.is_public"
                        >
                            <Globe v-if="form.is_public" class="w-4 h-4 ml-2 text-green-600" />
                            <Lock v-else class="w-4 h-4 ml-2" />
                            {{ form.is_public ? 'القائمة عامة' : 'القائمة خاصة' }}
                        </Button>
                    </div>

                    <div class="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" @click="editOpen = false">
                            إلغاء
                        </Button>
                        <Button type="submit" :disabled="form.processing">
                            {{ form.processing ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

        <!-- Publish Confirm Dialog -->
        <Dialog v-model:open="publishConfirmOpen">
            <DialogContent class="sm:max-w-md" dir="rtl">
                <DialogHeader>
                    <DialogTitle>نشر القائمة</DialogTitle>
                    <DialogDescription>
                        سيتم إرسال القائمة للمراجعة قبل نشرها للعامة. هل أنت متأكد؟
                    </DialogDescription>
                </DialogHeader>
                <div class="py-4">
                    <p class="text-xs text-orange-500">تأكد من وجود صورة غلاف ووجود أكثر من وصفة.</p>
                </div>
                <DialogFooter>
                    <Button variant="ghost" @click="publishConfirmOpen = false">إلغاء</Button>
                    <Button @click="handlePublishRequest" :disabled="form.processing">تأكيد النشر</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- Unpublish Confirm Dialog -->
        <Dialog v-model:open="unpublishConfirmOpen">
            <DialogContent class="sm:max-w-md" dir="rtl">
                <DialogHeader>
                    <DialogTitle>إلغاء نشر القائمة</DialogTitle>
                    <DialogDescription>
                        ستصبح القائمة خاصة ولن تظهر للآخرين. يمكنك نشرها مرة أخرى لاحقاً.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="ghost" @click="unpublishConfirmOpen = false">إلغاء</Button>
                    <Button @click="handleUnpublish" :disabled="form.processing">تأكيد</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- Delete Confirm Dialog -->
        <Dialog v-model:open="deleteConfirmOpen">
            <DialogContent class="sm:max-w-md" dir="rtl">
                <DialogHeader>
                    <DialogTitle>حذف القائمة</DialogTitle>
                    <DialogDescription>
                        هل أنت متأكد من رغبتك في حذف هذه القائمة؟ هذا الإجراء لا يمكن التراجع عنه.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="ghost" @click="deleteConfirmOpen = false">إلغاء</Button>
                    <Button variant="destructive" @click="handleDelete" :disabled="form.processing">حذف نهائي</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

