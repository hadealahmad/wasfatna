<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useForm, usePage, router } from '@inertiajs/vue3';
import { toast } from 'vue-sonner';
import { compressImage, validateImageFile } from '@/lib/image-utils';
import {
    Button,
    Input,
    Label,
    Textarea,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
    Badge
} from '@/components/ui';
import { Plus, Trash, X, Eye } from 'lucide-vue-next';
import RecipePreview from '@/components/recipes/RecipePreview.vue';

// Types
interface City {
    id: number;
    name: string;
    slug: string;
}

interface Tag {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface IngredientItem {
    amount: string;
    unit: string;
    name: string;
    descriptor: string;
}

interface IngredientGroup {
    name: string;
    items: IngredientItem[];
}

interface StepGroup {
    name: string;
    items: string[];
}

interface Recipe {
    id: number;
    name: string;
    description?: string;
    city_id?: number;
    city_slug?: string;
    difficulty: string;
    servings?: number | string;
    time_needed?: any;
    ingredients?: any;
    steps?: any;
    tags?: Tag[];
    image_url?: string;
    image_path?: string;
    status?: string;
    user?: { id: number };
    is_anonymous?: boolean;
    author_name?: string;
}

const props = defineProps<{
    cities: City[];
    tags?: Tag[];
    users?: User[];
    initialData?: Recipe;
}>();

const page = usePage();
const isAdmin = computed(() => page.props.auth?.user?.role === 'admin');
const isEditing = computed(() => !!props.initialData);

// Difficulty options
const difficulties = [
    'سهلة جداً',
    'سهلة',
    'متوسطة',
    'صعبة',
    'صعبة جداً',
];

// State
const isSubmitting = ref(false);
const isAiProcessing = ref(false);
const showPreview = ref(false);

// Preview computed data
const previewCityName = computed(() => {
    if (!cityId.value) return null;
    return props.cities.find(c => c.id.toString() === cityId.value)?.name || null;
});
const previewTags = computed(() => {
    return (props.tags || []).filter(t => selectedTags.value.includes(t.id));
});
const previewTimeNeeded = computed(() => {
    const valid = timeEntries.value.filter(e => e.step && e.duration);
    if (!valid.length) return null;
    const obj: Record<string, string> = {};
    valid.forEach(e => { obj[e.step] = e.duration; });
    return obj;
});

// Form fields
const name = ref(props.initialData?.name || '');
const servings = ref(props.initialData?.servings?.toString() || '');
const cityId = ref(props.initialData?.city_id?.toString() || '');
const difficulty = ref(props.initialData?.difficulty || 'متوسطة');
const selectedTags = ref<number[]>(props.initialData?.tags?.map(t => t.id) || []);

// Image handling
const image = ref<File | null>(null);
const imagePreview = ref<string | null>(props.initialData?.image_url || null);

// Admin-only fields
const authorId = ref(props.initialData?.user?.id?.toString() || '');
const isManualAuthor = ref(props.initialData?.is_anonymous || false);
const manualAuthorName = ref(props.initialData?.is_anonymous && props.initialData?.author_name 
    ? props.initialData.author_name : '');

// Time entries
const getInitialTimeEntries = () => {
    if (!props.initialData?.time_needed) return [{ step: '', duration: '' }];
    if (typeof props.initialData.time_needed === 'string') {
        return [{ step: '', duration: props.initialData.time_needed }];
    }
    if (typeof props.initialData.time_needed === 'object') {
        // Handle {prep: 15, cook: 45} format
        if ('prep' in props.initialData.time_needed || 'cook' in props.initialData.time_needed) {
            const entries = [];
            if (props.initialData.time_needed.prep) {
                entries.push({ step: 'تحضير', duration: `${props.initialData.time_needed.prep} دقيقة` });
            }
            if (props.initialData.time_needed.cook) {
                entries.push({ step: 'طبخ', duration: `${props.initialData.time_needed.cook} دقيقة` });
            }
            return entries.length > 0 ? entries : [{ step: '', duration: '' }];
        }
        return Object.entries(props.initialData.time_needed).map(([step, duration]) => ({
            step,
            duration: String(duration)
        }));
    }
    return [{ step: '', duration: '' }];
};

const timeEntries = ref<{ step: string; duration: string }[]>(getInitialTimeEntries());

// Initialize ingredients
const getInitialIngredients = (): IngredientGroup[] => {
    if (!props.initialData?.ingredients) {
        return [{ name: '', items: [{ amount: '', unit: '', name: '', descriptor: '' }] }];
    }

    if (Array.isArray(props.initialData.ingredients)) {
        if (props.initialData.ingredients.length === 0) {
            return [{ name: '', items: [{ amount: '', unit: '', name: '', descriptor: '' }] }];
        }

        const firstItem = props.initialData.ingredients[0];

        // New Ordered Group Format
        if (firstItem && typeof firstItem === 'object' && 'name' in firstItem && 'items' in firstItem) {
            return props.initialData.ingredients.map((group: any) => ({
                name: group.name,
                items: group.items.map((i: any) => ({
                    amount: i.amount || '',
                    unit: i.unit || '',
                    name: i.name || '',
                    descriptor: i.descriptor || ''
                }))
            }));
        }

        // Flattened objects format (including Eloquent belongsToMany with pivot)
        if (typeof firstItem === 'object' && firstItem !== null && 'name' in firstItem) {
            const grouped: Record<string, IngredientItem[]> = {};
            const groupsOrder: string[] = [];

            props.initialData.ingredients.forEach((item: any) => {
                // Read group from pivot (Eloquent) or direct property (fallback)
                const groupName = item.pivot?.group ?? item.group ?? '';
                if (!grouped[groupName]) {
                    grouped[groupName] = [];
                    groupsOrder.push(groupName);
                }
                // Read amount/unit/descriptor from pivot (Eloquent) or direct property (fallback)
                grouped[groupName].push({
                    amount: item.pivot?.amount ?? item.amount ?? '',
                    unit: item.pivot?.unit ?? item.unit ?? '',
                    name: item.name || '',
                    descriptor: item.pivot?.ingredient_descriptor ?? item.pivot?.descriptor ?? item.descriptor ?? ''
                });
            });

            return groupsOrder.map(name => ({
                name,
                items: grouped[name]
            }));
        }

        // Legacy strings
        return [{
            name: '',
            items: props.initialData.ingredients.map((ing: any) => ({
                amount: '',
                unit: '',
                name: typeof ing === 'string' ? ing : '',
                descriptor: ''
            }))
        }];
    }

    // Object format (Legacy Grouped)
    return Object.entries(props.initialData.ingredients).map(([name, items]) => ({
        name,
        items: (Array.isArray(items) ? items : [String(items)]).map((ing: any) => ({
            amount: '',
            unit: '',
            name: typeof ing === 'string' ? ing : '',
            descriptor: ''
        }))
    }));
};

const ingredientGroups = ref<IngredientGroup[]>(getInitialIngredients());

// Initialize steps
const getInitialSteps = (): StepGroup[] => {
    if (!props.initialData?.steps) {
        return [{ name: '', items: [''] }];
    }

    if (Array.isArray(props.initialData.steps)) {
        if (props.initialData.steps.length === 0) {
            return [{ name: '', items: [''] }];
        }

        // Check for new ordered group format
        if (typeof props.initialData.steps[0] === 'object' && 'name' in props.initialData.steps[0]) {
            return props.initialData.steps.map((group: any) => ({
                name: group.name,
                items: group.items || group.steps || []
            }));
        }

        // Check if it's array of objects with content property
        if (typeof props.initialData.steps[0] === 'object' && 'content' in props.initialData.steps[0]) {
            return [{ name: '', items: props.initialData.steps.map((s: any) => s.content || '') }];
        }

        // Simple array of strings
        return [{ name: '', items: props.initialData.steps }];
    }

    // Legacy Object format
    return Object.entries(props.initialData.steps).map(([name, items]) => ({
        name,
        items: Array.isArray(items) ? items : [String(items)]
    }));
};

const stepGroups = ref<StepGroup[]>(getInitialSteps());

// ------- Methods -------

// Time entries management
const addTimeEntry = () => {
    timeEntries.value.push({ step: '', duration: '' });
};

const removeTimeEntry = (index: number) => {
    timeEntries.value.splice(index, 1);
};

// Ingredient management
const addIngredientGroup = () => {
    ingredientGroups.value.push({ name: '', items: [{ amount: '', unit: '', name: '', descriptor: '' }] });
};

const removeIngredientGroup = (groupIndex: number) => {
    ingredientGroups.value.splice(groupIndex, 1);
};

const addIngredientItem = (groupIndex: number) => {
    ingredientGroups.value[groupIndex].items.push({ amount: '', unit: '', name: '', descriptor: '' });
};

const removeIngredientItem = (groupIndex: number, itemIndex: number) => {
    ingredientGroups.value[groupIndex].items.splice(itemIndex, 1);
};

// Step management
const addStepGroup = () => {
    stepGroups.value.push({ name: '', items: [''] });
};

const removeStepGroup = (groupIndex: number) => {
    stepGroups.value.splice(groupIndex, 1);
};

const addStepItem = (groupIndex: number) => {
    stepGroups.value[groupIndex].items.push('');
};

const removeStepItem = (groupIndex: number, itemIndex: number) => {
    stepGroups.value[groupIndex].items.splice(itemIndex, 1);
};

// Tag toggle
const toggleTag = (tagId: number) => {
    const index = selectedTags.value.indexOf(tagId);
    if (index === -1) {
        selectedTags.value.push(tagId);
    } else {
        selectedTags.value.splice(index, 1);
    }
};

// Image handling
const handleImageChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
        toast.error(validationError);
        return;
    }

    toast.loading('جاري معالجة الصورة...');

    const result = await compressImage(file);
    toast.dismiss();

    if (!result.success || !result.file) {
        toast.error(result.error || 'فشل في معالجة الصورة');
        return;
    }

    image.value = result.file;
    imagePreview.value = URL.createObjectURL(result.file);
    toast.success('تم معالجة الصورة بنجاح');
};

const removeImage = () => {
    image.value = null;
    imagePreview.value = null;
};

// AI Processing (Admin only)
const handleAiProcess = async () => {
    if (!isAdmin.value) return;

    // Collect raw text
    const rawIngredients = ingredientGroups.value.map(g =>
        g.items.map(i => `${i.amount} ${i.unit} ${i.name} ${i.descriptor}`).filter(t => t.trim().length > 3).join('\n')
    ).join('\n\n');

    const rawSteps = stepGroups.value.map(g =>
        g.items.join('\n')
    ).join('\n\n');

    if (!rawIngredients.trim() && !rawSteps.trim()) {
        toast.error('الرجاء تعبئة بعض المكونات أو الخطوات أولاً');
        return;
    }

    isAiProcessing.value = true;
    toast.loading('جاري المعالجة بالذكاء الاصطناعي...');

    try {
        const response = await fetch('/dashboard/ai/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify({
                ingredients: rawIngredients,
                steps: rawSteps,
                locale: 'ar'
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || result.message || 'فشل في معالجة البيانات');
        }

        if (result.ingredientGroups && Array.isArray(result.ingredientGroups)) {
            ingredientGroups.value = result.ingredientGroups.map((group: any) => ({
                name: group.name || '',
                items: Array.isArray(group.items) ? group.items.map((item: any) => ({
                    amount: item.amount || '',
                    unit: item.unit || '',
                    name: item.name || item.item || '',
                    descriptor: item.descriptor || ''
                })) : []
            }));
        }

        if (result.stepGroups && Array.isArray(result.stepGroups)) {
            stepGroups.value = result.stepGroups.map((group: any) => ({
                name: group.name || '',
                items: Array.isArray(group.items) ? group.items.map((s: any) => 
                    typeof s === 'string' ? s : JSON.stringify(s)
                ) : []
            }));
        }

        if (result.tags && Array.isArray(result.tags) && props.tags) {
            const newTagIds = result.tags
                .map((tagName: string) => props.tags?.find(t => t.name === tagName)?.id)
                .filter((id: number | undefined): id is number => id !== undefined);
            selectedTags.value = [...new Set([...selectedTags.value, ...newTagIds])];
        }

        toast.dismiss();
        toast.success('تم تنظيم البيانات بنجاح');
    } catch (error: any) {
        console.error('AI Processing Error:', error);
        toast.dismiss();
        
        // Show the specific error from the API
        const errorMessage = error instanceof Error ? error.message : String(error);
        toast.error(errorMessage, {
            duration: 6000 // Give user more time to read long errors
        });
    } finally {
        isAiProcessing.value = false;
    }
};

// Build data structures for submission
const buildTimeNeeded = () => {
    const validEntries = timeEntries.value.filter(e => e.step && e.duration);
    if (validEntries.length === 0) return null;
    if (validEntries.length === 1 && !validEntries[0].step) {
        return validEntries[0].duration;
    }
    return Object.fromEntries(validEntries.map(e => [e.step, e.duration]));
};

const buildIngredients = () => {
    // If only one group with no name, return flat array
    if (ingredientGroups.value.length === 1 && !ingredientGroups.value[0].name) {
        return ingredientGroups.value[0].items
            .filter(i => i.name.trim())
            .map(i => ({
                amount: i.amount,
                unit: i.unit,
                name: i.name,
                descriptor: i.descriptor
            }));
    }

    // Return Ordered Array of Groups
    return ingredientGroups.value
        .filter(g => g.items.some(i => i.name.trim()))
        .map(g => ({
            name: g.name || 'المكونات',
            items: g.items
                .filter(i => i.name.trim())
                .map(i => ({
                    amount: i.amount,
                    unit: i.unit,
                    name: i.name,
                    descriptor: i.descriptor
                }))
        }));
};

const buildSteps = () => {
    // If only one group with no name, return flat array
    if (stepGroups.value.length === 1 && !stepGroups.value[0].name) {
        return stepGroups.value[0].items.filter(s => s.trim());
    }

    // Return Ordered Array of Groups
    return stepGroups.value
        .filter(g => g.items.some(s => s.trim()))
        .map(g => ({
            name: g.name || 'الخطوات',
            items: g.items.filter(s => s.trim())
        }));
};

// Submit form
const submit = async () => {
    if (!name.value.trim()) {
        toast.error('يرجى إدخال اسم الوصفة');
        return;
    }

    const ingredients = buildIngredients();
    const steps = buildSteps();

    if ((Array.isArray(ingredients) && ingredients.length === 0)) {
        toast.error('يرجى إضافة المكونات');
        return;
    }

    if ((Array.isArray(steps) && steps.length === 0)) {
        toast.error('يرجى إضافة خطوات التحضير');
        return;
    }

    if (!isEditing.value && !image.value && !imagePreview.value) {
        toast.error('يرجى إضافة صورة للوصفة');
        return;
    }

    isSubmitting.value = true;

    try {
        const formData = new FormData();
        formData.append('name', name.value);
        formData.append('difficulty', difficulty.value);
        formData.append('ingredients', JSON.stringify(ingredients));
        formData.append('steps', JSON.stringify(steps));
        formData.append('tags', JSON.stringify(selectedTags.value));

        if (servings.value) formData.append('servings', servings.value);
        if (cityId.value) formData.append('city_id', cityId.value);
        if (image.value) formData.append('image', image.value);

        if (isAdmin.value) {
            if (isManualAuthor.value) {
                if (!manualAuthorName.value.trim()) {
                    toast.error('يرجى إدخال اسم المؤلف');
                    isSubmitting.value = false;
                    return;
                }
                formData.append('manual_author_name', manualAuthorName.value);
            } else if (authorId.value) {
                formData.append('user_id', authorId.value);
            }
        }

        const timeNeeded = buildTimeNeeded();
        if (timeNeeded) formData.append('time_needed', JSON.stringify(timeNeeded));

        if (isEditing.value && props.initialData) {
            formData.append('_method', 'PUT');
            
            const response = await fetch(route('my.recipes.update', props.initialData.id), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Save failed:', errorData);
                if (errorData.errors) {
                    const firstError = Object.values(errorData.errors)[0];
                    throw new Error(Array.isArray(firstError) ? firstError[0] : String(firstError));
                }
                throw new Error(errorData.message || 'فشل في تحديث الوصفة');
            }

            if (props.initialData.status === 'approved' && !isAdmin.value) {
                toast.success('تم تحديث الوصفة وإرسالها للمراجعة');
            } else {
                toast.success('تم تحديث الوصفة بنجاح');
            }

            router.visit(route('my.recipes.index'));
        } else {
            const response = await fetch(route('recipes.store'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Store failed:', errorData);
                if (errorData.errors) {
                    const firstError = Object.values(errorData.errors)[0];
                    throw new Error(Array.isArray(firstError) ? firstError[0] : String(firstError));
                }
                throw new Error(errorData.message || 'فشل في إرسال الوصفة');
            }

            if (isAdmin.value) {
                toast.success('تم نشر الوصفة بنجاح');
                router.visit(route('dashboard.recipes'));
            } else {
                toast.success('تم إرسال الوصفة للمراجعة');
                router.visit(route('my.recipes.index'));
            }
        }
    } catch (error: any) {
        console.error(error);
        toast.error(error?.message || (isEditing.value ? 'فشل في تحديث الوصفة' : 'فشل في إرسال الوصفة'));
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <form @submit.prevent="submit" class="space-y-8">
        <!-- Basic Info Card -->
        <Card>
            <CardHeader>
                <CardTitle>{{ isEditing ? 'تعديل الوصفة' : 'معلومات الوصفة' }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
                <!-- AI Assistant (Admin Only) -->
                <div v-if="isAdmin" class="bg-muted/50 border rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-lg">✨</span>
                            <h3 class="font-semibold">مساعد الذكاء الاصطناعي</h3>
                        </div>
                        <p class="text-sm text-muted-foreground">
                            استخدم الذكاء الاصطناعي لتنظيم المكونات والخطوات واقتراح الوسوم تلقائياً.
                        </p>
                    </div>
                    <Button
                        type="button"
                        @click="handleAiProcess"
                        :disabled="isAiProcessing"
                        variant="secondary"
                        class="shrink-0"
                    >
                        {{ isAiProcessing ? 'جاري المعالجة...' : 'تنظيم المحتوى' }}
                    </Button>
                </div>

                <!-- Recipe Name -->
                <div>
                    <Label for="name" class="text-base mb-2 block">اسم الوصفة *</Label>
                    <Input
                        id="name"
                        v-model="name"
                        placeholder="مثال: منسف رز"
                        required
                        class="h-12 text-base bg-background"
                    />
                </div>

                <!-- City & Difficulty -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <Label for="city" class="text-base mb-2 block">المدينة</Label>
                        <Select v-model="cityId">
                            <SelectTrigger class="h-12 text-base bg-background">
                                <SelectValue placeholder="اختر المدينة" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="city in cities" :key="city.id" :value="city.id.toString()">
                                    {{ city.name }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label for="difficulty" class="text-base mb-2 block">مستوى الصعوبة *</Label>
                        <Select v-model="difficulty">
                            <SelectTrigger class="h-12 text-base bg-background">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="d in difficulties" :key="d" :value="d">
                                    {{ d }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label for="servings" class="text-base mb-2 block">عدد الحصص</Label>
                        <Input
                            id="servings"
                            v-model="servings"
                            placeholder="مثال: 4-6 أشخاص"
                            class="h-12 text-base bg-background"
                        />
                    </div>
                </div>

                <!-- Tags -->
                <div v-if="tags && tags.length > 0">
                    <Label class="text-base mb-2 block">الوسوم</Label>
                    <div class="flex flex-wrap gap-2">
                        <Badge
                            v-for="tag in tags"
                            :key="tag.id"
                            variant="outline"
                            class="cursor-pointer select-none hover:bg-secondary/50 transition-colors px-3 py-1.5"
                            :class="{ 'bg-primary text-primary-foreground hover:bg-primary/90': selectedTags.includes(tag.id) }"
                            @click="toggleTag(tag.id)"
                        >
                            {{ tag.name }}
                        </Badge>
                    </div>
                </div>

                <!-- Admin Author Section -->
                <div v-if="isAdmin && users && users.length > 0" class="mt-4 p-4 border rounded-lg bg-muted/10">
                    <div class="flex items-center gap-2 mb-4">
                        <input
                            type="checkbox"
                            id="isManualAuthor"
                            v-model="isManualAuthor"
                            class="w-4 h-4 accent-primary"
                        />
                        <Label for="isManualAuthor" class="cursor-pointer select-none">
                            مؤلف خارجي / غير مسجل
                        </Label>
                    </div>

                    <div v-if="isManualAuthor">
                        <Label for="manualAuthorName" class="text-base mb-2 block">اسم المؤلف</Label>
                        <Input
                            id="manualAuthorName"
                            v-model="manualAuthorName"
                            placeholder="أدخل اسم المؤلف..."
                            class="h-12 text-base bg-background"
                        />
                    </div>

                    <div v-else>
                        <Label for="author" class="text-base mb-2 block">المؤلف (مستخدم مسجل)</Label>
                        <Select v-model="authorId">
                            <SelectTrigger class="h-12 text-base bg-background">
                                <SelectValue placeholder="اختر المؤلف" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="user in users" :key="user.id" :value="user.id.toString()">
                                    {{ user.name }} ({{ user.email }})
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <!-- Image Upload -->
                <div>
                    <Label class="text-base mb-2 block">صورة الوصفة</Label>
                    <div class="mt-2">
                        <div v-if="imagePreview" class="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border bg-background">
                            <img :src="imagePreview" alt="معاينة" class="object-cover w-full h-full" />
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                class="absolute top-2 right-2"
                                @click="removeImage"
                            >
                                حذف
                            </Button>
                        </div>
                        <label v-else class="flex flex-col items-center justify-center w-full max-w-md h-52 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors bg-background">
                            <span class="text-4xl mb-4">📷</span>
                            <span class="text-base text-muted-foreground font-medium">اضغط لاختيار صورة</span>
                            <span class="text-sm text-muted-foreground mt-2">(الحد الأقصى 1 ميغابايت)</span>
                            <input
                                type="file"
                                accept="image/*"
                                class="hidden"
                                @change="handleImageChange"
                            />
                        </label>
                    </div>
                </div>
            </CardContent>
        </Card>

        <!-- Time Needed Card -->
        <Card>
            <CardHeader>
                <CardTitle>الوقت المطلوب</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
                <div v-for="(entry, index) in timeEntries" :key="index" class="grid grid-cols-12 gap-4">
                    <Input
                        placeholder="المرحلة (مثال: التحضير)"
                        v-model="entry.step"
                        class="h-12 text-base bg-background col-span-5"
                    />
                    <Input
                        placeholder="المدة (مثال: 30 دقيقة)"
                        v-model="entry.duration"
                        class="h-12 text-base bg-background col-span-5"
                    />
                    <Button 
                        v-if="timeEntries.length > 1"
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        @click="removeTimeEntry(index)"
                        class="col-span-2 h-12 text-destructive"
                    >
                        <X class="w-4 h-4" />
                    </Button>
                </div>
                <Button type="button" variant="outline" @click="addTimeEntry" class="h-10">
                    + إضافة مرحلة
                </Button>
            </CardContent>
        </Card>

        <!-- Ingredients Card -->
        <Card>
            <CardHeader>
                <CardTitle>المكونات *</CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
                <div v-for="(group, groupIndex) in ingredientGroups" :key="groupIndex" class="space-y-4 p-5 border rounded-xl bg-muted/20">
                    <!-- Group name (only show if multiple groups) -->
                    <div v-if="ingredientGroups.length > 1" class="flex gap-2">
                        <Input
                            placeholder="اسم المجموعة (مثال: العجينة)"
                            v-model="group.name"
                            class="font-semibold h-12 text-base bg-background flex-1"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            @click="removeIngredientGroup(groupIndex)"
                            class="h-12 text-destructive"
                        >
                            <Trash class="w-4 h-4" />
                        </Button>
                    </div>

                    <!-- Ingredient items -->
                    <div v-for="(item, itemIndex) in group.items" :key="itemIndex" class="space-y-2">
                        <div class="grid grid-cols-12 gap-2">
                            <Input
                                placeholder="الكمية"
                                v-model="item.amount"
                                class="h-11 text-base bg-background col-span-2"
                            />
                            <Input
                                placeholder="الوحدة"
                                v-model="item.unit"
                                class="h-11 text-base bg-background col-span-2"
                            />
                            <Input
                                placeholder="المكون *"
                                v-model="item.name"
                                class="h-11 text-base bg-background col-span-6"
                            />
                            <Button
                                v-if="group.items.length > 1"
                                type="button"
                                variant="ghost"
                                size="icon"
                                @click="removeIngredientItem(groupIndex, itemIndex)"
                                class="h-11 text-destructive col-span-2"
                            >
                                <X class="w-4 h-4" />
                            </Button>
                        </div>
                        <Input
                            placeholder="وصف إضافي (اختياري)"
                            v-model="item.descriptor"
                            class="h-10 text-sm bg-background text-muted-foreground"
                        />
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        @click="addIngredientItem(groupIndex)"
                        class="text-muted-foreground hover:text-primary"
                    >
                        + مكون جديد
                    </Button>
                </div>
                <Button type="button" variant="outline" @click="addIngredientGroup" class="w-full h-12 border-dashed">
                    + مجموعة مكونات جديدة
                </Button>
            </CardContent>
        </Card>

        <!-- Steps Card -->
        <Card>
            <CardHeader>
                <CardTitle>طريقة التحضير *</CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
                <div v-for="(group, groupIndex) in stepGroups" :key="groupIndex" class="space-y-4 p-5 border rounded-xl bg-muted/20">
                    <!-- Group name (only show if multiple groups) -->
                    <div v-if="stepGroups.length > 1" class="flex gap-2">
                        <Input
                            placeholder="اسم المرحلة (مثال: تحضير الصلصة)"
                            v-model="group.name"
                            class="font-semibold h-12 text-base bg-background flex-1"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            @click="removeStepGroup(groupIndex)"
                            class="h-12 text-destructive"
                        >
                            <Trash class="w-4 h-4" />
                        </Button>
                    </div>

                    <!-- Step items -->
                    <div v-for="(item, itemIndex) in group.items" :key="itemIndex" class="flex gap-2">
                        <div class="flex-none pt-3 bg-muted w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                            {{ itemIndex + 1 }}
                        </div>
                        <Textarea
                            :placeholder="`الخطوة ${itemIndex + 1}`"
                            v-model="group.items[itemIndex]"
                            :rows="3"
                            class="text-base bg-background resize-y min-h-[100px] flex-1"
                        />
                        <Button
                            v-if="group.items.length > 1"
                            type="button"
                            variant="ghost"
                            size="icon"
                            @click="removeStepItem(groupIndex, itemIndex)"
                            class="h-11 text-destructive"
                        >
                            <X class="w-4 h-4" />
                        </Button>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        @click="addStepItem(groupIndex)"
                        class="text-muted-foreground hover:text-primary"
                    >
                        + خطوة جديدة
                    </Button>
                </div>
                <Button type="button" variant="outline" @click="addStepGroup" class="w-full h-12 border-dashed">
                    + مرحلة جديدة
                </Button>
            </CardContent>
        </Card>

        <!-- Submit -->
        <div class="flex flex-col-reverse sm:flex-row justify-end gap-4 pb-12">
            <Button type="button" variant="outline" @click="router.back()">
                إلغاء
            </Button>
            <Button type="button" variant="secondary" @click="showPreview = true" class="gap-2">
                <Eye class="h-4 w-4" />
                معاينة
            </Button>
            <Button type="submit" :disabled="isSubmitting">
                {{ isSubmitting
                    ? (isEditing ? 'جاري التحديث...' : 'جاري الإرسال...')
                    : (isEditing
                        ? (isAdmin ? 'تحديث الوصفة' : 'تحديث وإرسال للمراجعة')
                        : (isAdmin ? 'نشر الوصفة' : 'إرسال للمراجعة')
                    )
                }}
            </Button>
        </div>

        <!-- Preview Dialog -->
        <RecipePreview
            v-model:open="showPreview"
            :name="name"
            :description="description"
            :image-preview="imagePreview"
            :difficulty="difficulty"
            :servings="servings"
            :city-name="previewCityName"
            :tags="previewTags"
            :ingredient-groups="ingredientGroups"
            :step-groups="stepGroups"
            :time-needed="previewTimeNeeded"
        />
    </form>
</template>
