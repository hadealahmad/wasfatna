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
import { ChevronRight } from 'lucide-vue-next';

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
        
        <div class="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
            <Link :href="route('my.lists.index')" class="hover:text-primary">قوائمي</Link>
            <ChevronRight class="w-4 h-4" />
            <span class="text-foreground font-medium">قائمة جديدة</span>
        </div>

        <h2 class="text-2xl font-bold mb-6">إنشاء قائمة جديدة</h2>

        <Card>
            <CardContent class="pt-6">
                <form @submit.prevent="submit" class="space-y-6">
                    <div class="space-y-2">
                        <Label for="name">اسم القائمة</Label>
                        <Input id="name" v-model="form.name" required placeholder="مثال: حلويات رمضان، أطباقي المفضلة..." />
                        <p v-if="form.errors.name" class="text-sm text-red-500">{{ form.errors.name }}</p>
                    </div>

                    <div class="space-y-2">
                        <Label for="description">وصف القائمة (اختياري)</Label>
                        <Textarea id="description" v-model="form.description" placeholder="اكتب وصفاً مختصراً لمحتوى القائمة..." />
                        <p v-if="form.errors.description" class="text-sm text-red-500">{{ form.errors.description }}</p>
                    </div>

                    <div class="space-y-2">
                        <Label for="image">صورة الغلاف (اختياري)</Label>
                        <Input id="image" type="file" @input="form.cover_image = $event.target.files[0]" accept="image/*" />
                        <p v-if="form.errors.cover_image" class="text-sm text-red-500">{{ form.errors.cover_image }}</p>
                    </div>

                    <div class="flex items-center space-x-2 flex-row-reverse space-x-reverse justify-end">
                        <Label for="is-public" class="cursor-pointer">قائمة عامة (يمكن للجميع رؤيتها)</Label>
                        <Switch id="is-public" :checked="form.is_public" @update:checked="form.is_public = $event" />
                    </div>

                    <div class="flex justify-end gap-4 pt-4">
                        <Link :href="route('my.lists.index')">
                            <Button variant="outline" type="button">إلغاء</Button>
                        </Link>
                        <Button type="submit" :disabled="form.processing">
                            {{ form.processing ? 'جاري الحفظ...' : 'إنشاء القائمة' }}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </MyDashboardLayout>
</template>
