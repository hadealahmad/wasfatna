<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, useForm } from '@inertiajs/vue3';
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { 
    Button, 
    Input, 
    Label, 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Textarea,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    MultiSelect
} from '@/components/ui';
import { Loader2, Save, Upload } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

interface Props {
    settings: {
        gemini_api_key: string;
        gemini_model: string;
        default_city_id: string;
        randomizer_tags: number[];
    };
    cities: { id: number; name: string }[];
    tags: { id: number; name: string }[];
    aiModels: { value: string; label: string }[];
}

const props = defineProps<Props>();

const settingsForm = useForm({
    gemini_api_key: props.settings.gemini_api_key || '',
    gemini_model: props.settings.gemini_model || 'gemini-1.5-flash',
    default_city_id: props.settings.default_city_id ? String(props.settings.default_city_id) : '',
    randomizer_tags: props.settings.randomizer_tags || [],
});

const importForm = useForm({
    importJson: '',
});

const importResult = ref<any>(null);

const tagOptions = computed(() => 
    props.tags.map(t => ({ label: t.name, value: String(t.id) }))
);

const selectedTagIds = computed({
    get: () => settingsForm.randomizer_tags.map(String),
    set: (val) => {
        settingsForm.randomizer_tags = val.map(Number);
    }
});

const handleSaveSettings = () => {
    settingsForm.post(route('dashboard.settings.update'), {
        preserveScroll: true,
        onSuccess: () => {
            toast.success('تم حفظ الإعدادات');
        },
        onError: (errors) => {
            const firstError = Object.values(errors)[0];
            toast.error(firstError as string || 'فشل حفظ الإعدادات');
        }
    });
};

const handleImport = () => {
    if (!importForm.importJson.trim()) return;

    let recipes;
    try {
        recipes = JSON.parse(importForm.importJson);
        if (!Array.isArray(recipes)) throw new Error('يجب أن يكون الملف مصفوفة من الوصفات');
    } catch (e) {
        toast.error('صيغة JSON غير صحيحة');
        return;
    }

    importForm.transform(() => ({
        recipes
    })).post(route('dashboard.settings.import'), {
        onSuccess: (page) => {
            importResult.value = page.props.flash.importResult;
            importForm.importJson = '';
            toast.success('تم اكتمال الاستيراد');
        },
        onError: (errors) => {
             toast.error(errors.import || 'فشل الاستيراد');
        }
    });
};
</script>

<template>
    <Head title="الإعدادات" />

    <DashboardLayout>
        <div class="space-y-6">
            <h2 class="text-2xl font-bold tracking-tight text-right">الإعدادات</h2>

            <Tabs default-value="general" class="w-full">
                <TabsList class="flex flex-row-reverse">
                    <TabsTrigger value="general">عام</TabsTrigger>
                    <TabsTrigger value="ai">إعدادات AI</TabsTrigger>
                    <TabsTrigger value="import">استيراد وصفات</TabsTrigger>
                </TabsList>

                <TabsContent value="general" class="mt-4">
                    <Card>
                        <CardHeader class="text-right">
                            <CardTitle>الإعدادات العامة</CardTitle>
                            <CardDescription>تكوين الإعدادات الأساسية للموقع</CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <div class="space-y-2 text-right">
                                <Label for="default_city">المدينة الافتراضية</Label>
                                <Select
                                    v-model="settingsForm.default_city_id"
                                >
                                    <SelectTrigger class="w-full text-right">
                                        <SelectValue placeholder="اختر مدينة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem v-for="city in cities" :key="city.id" :value="String(city.id)">
                                            {{ city.name }}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p class="text-xs text-muted-foreground">
                                    هذه المدينة ستكون الوجهة الافتراضية للوصفات المحذوفة مدنها.
                                </p>
                            </div>

                            <div class="space-y-2 text-right">
                                <Label>الوسوم المستخدمة في العشوائي</Label>
                                <MultiSelect
                                    :options="tagOptions"
                                    v-model:selected="selectedTagIds"
                                    placeholder="اختر الوسوم..."
                                />
                                <p class="text-xs text-muted-foreground">
                                    الوصفات التي تحتوي على أحد هذه الوسوم ستظهر في صفحة العشوائي. اتركها فارغة لعرض الكل.
                                </p>
                            </div>
                            <div class="flex justify-end">
                                <Button @click="handleSaveSettings" :disabled="settingsForm.processing">
                                    <Loader2 v-if="settingsForm.processing" class="ml-2 h-4 w-4 animate-spin" />
                                    حفظ التغييرات
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ai" class="mt-4">
                    <Card>
                        <CardHeader class="text-right">
                            <CardTitle>إعدادات الذكاء الاصطناعي</CardTitle>
                            <CardDescription>تكوين مفتاح API ونموذج Gemini</CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <div class="space-y-2 text-right">
                                <Label for="api_key">Gemini API Key</Label>
                                <Input
                                    id="api_key"
                                    type="password"
                                    v-model="settingsForm.gemini_api_key"
                                    placeholder="AIza..."
                                    class="text-left"
                                />
                            </div>
                            <div class="space-y-2 text-right">
                                <Label for="model">Gemini Model</Label>
                                <Select
                                    v-model="settingsForm.gemini_model"
                                >
                                    <SelectTrigger class="w-full text-right">
                                        <SelectValue placeholder="اختر النموذج" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem v-for="model in aiModels" :key="model.value" :value="model.value">
                                            {{ model.label }}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div class="flex justify-end">
                                <Button @click="handleSaveSettings" :disabled="settingsForm.processing">
                                    <Loader2 v-if="settingsForm.processing" class="ml-2 h-4 w-4 animate-spin" />
                                    حفظ التغييرات
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="import" class="mt-4">
                    <Card>
                        <CardHeader class="text-right">
                            <CardTitle>استيراد وصفات</CardTitle>
                            <CardDescription>استيراد وصفات من ملف JSON</CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <div class="space-y-2 text-right">
                                <Label>بيانات JSON</Label>
                                <Textarea
                                    v-model="importForm.importJson"
                                    placeholder='[{"name": "...", "ingredients": ...}]'
                                    class="h-64 font-mono text-sm text-left dir-ltr"
                                />
                            </div>
                            <div class="flex justify-end">
                                <Button @click="handleImport" :disabled="importForm.processing || !importForm.importJson.trim()">
                                    <Loader2 v-if="importForm.processing" class="ml-2 h-4 w-4 animate-spin" />
                                    <Upload v-else class="ml-2 h-4 w-4" />
                                    {{ importForm.processing ? 'جاري الاستيراد...' : 'استيراد الوصفات' }}
                                </Button>
                            </div>

                            <div v-if="importResult" class="mt-4 p-4 bg-muted rounded-md text-sm text-right">
                                <p class="font-bold">نتائج الاستيراد:</p>
                                <ul class="list-disc list-inside mt-2">
                                    <li>الإجمالي: {{ importResult.results.total }}</li>
                                    <li class="text-green-600">نجاح: {{ importResult.results.success }}</li>
                                    <li class="text-red-600">فشل: {{ importResult.results.failed }}</li>
                                </ul>
                                <div v-if="importResult.results.errors && importResult.results.errors.length > 0" class="mt-2 text-red-600">
                                    <p class="font-semibold">الأخطاء:</p>
                                    <ul class="list-disc list-inside max-h-40 overflow-y-auto">
                                        <li v-for="(err, idx) in importResult.results.errors" :key="idx">
                                            وصفة #{{ err.index }} ({{ err.name }}): {{ err.error }}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    </DashboardLayout>
</template>

<style scoped>
.dir-ltr {
    direction: ltr;
}
</style>
