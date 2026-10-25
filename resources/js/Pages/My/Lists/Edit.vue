<script setup lang="ts">
import { useForm, Head, Link, router } from '@inertiajs/vue3';
import { ref } from 'vue';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Textarea from '@/components/ui/Textarea.vue';
import Label from '@/components/ui/Label.vue';
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardFooter from '@/components/ui/CardFooter.vue';
import { Trash2, ArrowRight, Upload } from 'lucide-vue-next';

const props = defineProps<{
    list: {
        id: number;
        name: string;
        description: string;
        is_public: boolean;
        is_default: boolean;
        cover_image?: string;
        recipes: Array<{
            id: number;
            name: string;
            slug: string;
            image_url: string;
        }>;
    };
}>();

const form = useForm({
    _method: 'PUT',
    name: props.list.name,
    description: props.list.description || '',
    is_public: Boolean(props.list.is_public),
    cover_image: null as File | null,
});

const coverPreview = ref<string | null>(props.list.cover_image || null);

const handleImageChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
        form.cover_image = file;
        coverPreview.value = URL.createObjectURL(file);
    }
};

const submit = () => {
    // Wait, with file upload in Inertia, we must use POST with _method: PUT
    form.post(route('my.lists.update', props.list.id), {
        preserveScroll: true,
        onSuccess: () => {
            // Optional: Show toast
        },
    });
};

const deleteList = () => {
    if (confirm('هل أنت متأكد من حذف هذه القائمة؟')) {
        router.delete(route('my.lists.destroy', props.list.id));
    }
};

const removeRecipe = (recipeId: number) => {
    if (confirm('إزالة الوصفة من القائمة؟')) {
        router.post(route('lists.toggle', props.list.id), {
            recipe_id: recipeId
        }, {
            preserveScroll: true,
        });
    }
};
</script>

<template>
    <PublicLayout>
        <Head :title="`تعديل ${list.name}`" />

        <div class="container py-8 max-w-4xl">
            <div class="mb-6 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <Link :href="route('my.lists.index')" class="text-muted-foreground hover:text-foreground">
                        <ArrowRight class="w-5 h-5" />
                    </Link>
                    <h1 class="text-2xl font-bold">تعديل القائمة: {{ list.name }}</h1>
                </div>
                <Button v-if="!list.is_default" variant="destructive" size="sm" @click="deleteList">
                    <Trash2 class="w-4 h-4 ml-2" />
                    حذف القائمة
                </Button>
            </div>

            <div class="grid gap-8 md:grid-cols-3">
                <!-- Edit Form -->
                <div class="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>بيانات القائمة</CardTitle>
                        </CardHeader>
                        <form @submit.prevent="submit">
                            <CardContent class="space-y-4">
                                <div class="space-y-2">
                                    <Label for="name">اسم القائمة</Label>
                                    <Input id="name" v-model="form.name" :disabled="list.is_default" required />
                                    <p v-if="list.is_default" class="text-xs text-muted-foreground">لا يمكن تغيير اسم القائمة الافتراضية</p>
                                    <span v-if="form.errors.name" class="text-destructive text-xs">{{ form.errors.name }}</span>
                                </div>

                                <div class="space-y-2">
                                    <Label for="description">الوصف</Label>
                                    <Textarea id="description" v-model="form.description" rows="3" />
                                    <span v-if="form.errors.description" class="text-destructive text-xs">{{ form.errors.description }}</span>
                                </div>

                                <div class="space-y-2" v-if="!list.is_default">
                                    <div class="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id="is_public" 
                                            v-model="form.is_public"
                                            class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <Label for="is_public">قائمة عامة (يمكن للجميع رؤيتها بعد الموافقة)</Label>
                                    </div>
                                    <span v-if="form.errors.is_public" class="text-destructive text-xs">{{ form.errors.is_public }}</span>
                                </div>

                                <div class="space-y-2">
                                    <Label>صورة الغلاف</Label>
                                    <div class="flex items-center gap-4">
                                        <div v-if="coverPreview" class="w-24 h-16 rounded overflow-hidden bg-muted relative border">
                                            <img :src="coverPreview" alt="معاينة صورة الغلاف" loading="lazy" decoding="async" class="w-full h-full object-cover" />
                                        </div>
                                        <Label for="cover" class="cursor-pointer">
                                            <div class="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted text-sm">
                                                <Upload class="w-4 h-4" />
                                                <span>تغيير الصورة</span>
                                            </div>
                                            <input id="cover" type="file" accept="image/*" class="hidden" @change="handleImageChange" />
                                        </Label>
                                    </div>
                                    <span v-if="form.errors.cover_image" class="text-destructive text-xs">{{ form.errors.cover_image }}</span>
                                </div>
                            </CardContent>
                            <CardFooter class="justify-end border-t pt-4">
                                <Button type="submit" :disabled="form.processing">
                                    {{ form.processing ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>

                    <!-- Recipes Management -->
                    <Card>
                        <CardHeader>
                            <CardTitle>الوصفات المحفوظة ({{ list.recipes.length }})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div v-if="list.recipes.length === 0" class="text-center py-8 text-muted-foreground">
                                لا توجد وصفات في هذه القائمة
                            </div>
                            <div v-else class="space-y-2">
                                <div 
                                    v-for="recipe in list.recipes" 
                                    :key="recipe.id"
                                    class="flex items-center justify-between p-2 rounded hover:bg-muted/50 border"
                                >
                                    <Link :href="route('recipes.show', recipe.slug)" class="flex items-center gap-3 flex-1">
                                        <img :src="recipe.image_url" :alt="recipe.name" loading="lazy" decoding="async" width="48" height="48" class="w-12 h-12 rounded object-cover bg-muted" />
                                        <span class="font-medium hover:underline">{{ recipe.name }}</span>
                                    </Link>
                                    <Button variant="ghost" size="icon" class="text-destructive hover:bg-destructive/10" @click="removeRecipe(recipe.id)">
                                        <Trash2 class="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <!-- Sidebar / Preview -->
                <div>
                    <!-- Maybe show list card preview here -->
                </div>
            </div>
        </div>
    </PublicLayout>
</template>
