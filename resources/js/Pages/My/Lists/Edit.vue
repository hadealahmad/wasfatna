```
<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3';
import MyDashboardLayout from '@/Layouts/MyDashboardLayout.vue';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Checkbox } from '@/components/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { ChevronRight } from 'lucide-vue-next';

const props = defineProps<{
    list: any;
}>();

const form = useForm({
    _method: 'PUT',
    name: props.list.name,
    description: props.list.description,
    is_public: !!props.list.is_public,
    cover_image: null,
});

const submit = () => {
    form.post(route('my.lists.update', props.list.id));
};
</script>

<template>
    <MyDashboardLayout>
        <Head title="تعديل القائمة" />
        
        <div class="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
            <Link :href="route('my.lists.index')" class="hover:text-primary">قوائمي</Link>
            <ChevronRight class="w-4 h-4" />
            <span class="text-foreground font-medium">تعديل: {{ list.name }}</span>
        </div>

        <h2 class="text-2xl font-bold mb-6">تعديل القائمة</h2>

        <Card>
            <CardContent class="pt-6">
                <form @submit.prevent="submit" class="space-y-6">
                    <div class="space-y-2">
                        <Label for="name">اسم القائمة</Label>
                        <Input id="name" v-model="form.name" required />
                        <p v-if="form.errors.name" class="text-sm text-red-500">{{ form.errors.name }}</p>
                    </div>

                    <div class="space-y-2">
                        <Label for="description">وصف القائمة</Label>
                        <Textarea id="description" v-model="form.description" />
                        <p v-if="form.errors.description" class="text-sm text-red-500">{{ form.errors.description }}</p>
                    </div>

                    <div class="space-y-2">
                        <Label for="image">تغيير صورة الغلاف</Label>
                         <div v-if="list.cover_image" class="mb-2">
                            <img :src="list.cover_image" class="w-24 h-24 object-cover rounded-md" />
                        </div>
                        <Input id="image" type="file" @input="form.cover_image = $event.target.files[0]" accept="image/*" />
                        <p v-if="form.errors.cover_image" class="text-sm text-red-500">{{ form.errors.cover_image }}</p>
                    </div>

                    <div class="flex items-center space-x-2 flex-row-reverse space-x-reverse justify-end">
                        <Label for="is-public" class="cursor-pointer">قائمة عامة</Label>
                        <Switch id="is-public" :checked="form.is_public" @update:checked="form.is_public = $event" />
                    </div>

                    <div class="flex justify-end gap-4 pt-4">
                        <Link :href="route('my.lists.index')">
                            <Button variant="outline" type="button">إلغاء</Button>
                        </Link>
                        <Button type="submit" :disabled="form.processing">
                            {{ form.processing ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </MyDashboardLayout>
</template>
