<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3';
import MyDashboardLayout from '@/Layouts/MyDashboardLayout.vue';
import {
  Button,
  Input,
  Label,
  Textarea,
  Switch,
  Card,
  CardContent,
  Checkbox,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { ChevronLeft } from 'lucide-vue-next';

const form = useForm({
    name: '',
    description: '',
    is_public: false,
    cover_image: null,
});

const submit = () => {
    form.post(route('my.lists.store'));
};
</script>

<template>
    <MyDashboardLayout>
        <Head title="قائمة جديدة" />
        
        <nav aria-label="مسار التصفح" class="flex items-center gap-1.5 mb-6 text-sm text-muted-foreground">
            <Link :href="route('my.lists.index')" class="hover:text-primary transition-colors">قوائمي</Link>
            <ChevronLeft class="w-4 h-4 shrink-0" aria-hidden="true" />
            <span class="text-foreground font-medium">قائمة جديدة</span>
        </nav>

        <div class="mb-6">
            <h1 class="text-2xl font-bold tracking-tight">إنشاء قائمة جديدة</h1>
            <p class="text-sm text-muted-foreground mt-1">أضف تفاصيل القائمة واختر ما إذا كنت تود مشاركتها مع المجتمع</p>
        </div>

        <Card>
            <CardContent class="pt-6">
                <form @submit.prevent="submit" class="space-y-6">
                    <div class="space-y-2">
                        <Label for="name">اسم القائمة</Label>
                        <Input id="name" v-model="form.name" required placeholder="مثال: حلويات رمضان، أطباقي المفضلة..." />
                        <p v-if="form.errors.name" class="text-sm text-destructive">{{ form.errors.name }}</p>
                    </div>

                    <div class="space-y-2">
                        <Label for="description">وصف القائمة (اختياري)</Label>
                        <Textarea id="description" v-model="form.description" placeholder="اكتب وصفاً مختصراً لمحتوى القائمة..." />
                        <p v-if="form.errors.description" class="text-sm text-destructive">{{ form.errors.description }}</p>
                    </div>

                    <div class="space-y-2">
                        <Label for="image">صورة الغلاف (اختياري)</Label>
                        <Input id="image" type="file" @input="form.cover_image = $event.target.files[0]" accept="image/*" />
                        <p v-if="form.errors.cover_image" class="text-sm text-destructive">{{ form.errors.cover_image }}</p>
                    </div>

                    <div class="flex items-center gap-3">
                        <Switch id="is-public" :checked="form.is_public" @update:checked="form.is_public = $event" />
                        <Label for="is-public" class="cursor-pointer">قائمة عامة (يمكن للجميع رؤيتها)</Label>
                    </div>

                    <div class="flex justify-end gap-4 pt-4">
                        <Button as-child variant="outline">
                            <Link :href="route('my.lists.index')">إلغاء</Link>
                        </Button>
                        <Button type="submit" :disabled="form.processing" :aria-busy="form.processing || undefined">
                            {{ form.processing ? 'جاري الحفظ...' : 'إنشاء القائمة' }}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </MyDashboardLayout>
</template>
