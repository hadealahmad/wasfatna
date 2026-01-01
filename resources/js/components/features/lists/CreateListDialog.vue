<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import Dialog from '@/components/ui/Dialog.vue';
import DialogContent from '@/components/ui/DialogContent.vue';
import DialogHeader from '@/components/ui/DialogHeader.vue';
import DialogTitle from '@/components/ui/DialogTitle.vue';
import DialogTrigger from '@/components/ui/DialogTrigger.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Label from '@/components/ui/Label.vue';
import { Plus } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const props = defineProps<{
    trigger?: any; // Slot or component
}>();

const open = ref(false);

const form = useForm({
    name: '',
    description: '',
    is_public: false
});

const handleSubmit = () => {
    form.post(route('my.lists.store'), {
        onSuccess: () => {
            toast.success('تم إنشاء القائمة بنجاح');
            open.value = false;
            form.reset();
        },
        onError: () => {
             toast.error('فشل في إنشاء القائمة');
        }
    });
};
</script>

<template>
    <Dialog v-model:open="open">
        <DialogTrigger asChild>
            <slot name="trigger">
                <Button class="gap-2">
                    <Plus class="w-4 h-4" />
                    قائمة جديدة
                </Button>
            </slot>
        </DialogTrigger>
        <DialogContent class="sm:max-w-md" dir="rtl">
            <DialogHeader>
                <DialogTitle>إنشاء قائمة جديدة</DialogTitle>
            </DialogHeader>
            <form @submit.prevent="handleSubmit" class="space-y-4 py-4">
                <div class="space-y-2">
                    <Label htmlFor="name">اسم القائمة</Label>
                    <Input
                        id="name"
                        v-model="form.name"
                        placeholder="مثال: وصفات الفطور"
                        required
                    />
                    <div v-if="form.errors.name" class="text-sm text-red-500">{{ form.errors.name }}</div>
                </div>
                <div class="space-y-2">
                    <Label htmlFor="description">وصف (اختياري)</Label>
                    <Input
                        id="description"
                        v-model="form.description"
                        placeholder="وصف مختصر للقائمة..."
                    />
                     <div v-if="form.errors.description" class="text-sm text-red-500">{{ form.errors.description }}</div>
                </div>
                <div class="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" @click="open = false">
                        إلغاء
                    </Button>
                    <Button type="submit" :disabled="form.processing || !form.name.trim()">
                        {{ form.processing ? 'جاري الإنشاء...' : 'إنشاء' }}
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
</template>
