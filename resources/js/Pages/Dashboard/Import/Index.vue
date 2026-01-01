<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, usePage } from '@inertiajs/vue3';
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Button,
    Alert,
    AlertTitle,
    AlertDescription,
    Progress,
} from '@/components/ui';
import { Upload, FileJson, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

interface Recipe {
    name: string;
    author?: string;
    image_link?: string;
    time_needed?: string;
    servings?: string;
    city?: string;
    difficulty?: string;
    ingredients?: unknown[];
    steps?: unknown;
}

interface ImportResult {
    total: number;
    success: number;
    failed: number;
    errors: Array<{ index: number; name: string; error: string }>;
}

const page = usePage();
const isAdmin = computed(() => page.props.auth?.user?.role === 'admin');

const fileInputRef = ref<HTMLInputElement | null>(null);
const recipes = ref<Recipe[]>([]);
const fileName = ref<string | null>(null);
const isImporting = ref(false);
const result = ref<ImportResult | null>(null);
const parseError = ref<string | null>(null);

const handleFileSelect = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    parseError.value = null;
    result.value = null;
    fileName.value = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target?.result as string;
            const parsed = JSON.parse(content);

            if (!Array.isArray(parsed)) {
                throw new Error('الملف يجب أن يحتوي على مصفوفة من الوصفات');
            }

            if (parsed.length === 0) {
                throw new Error('الملف لا يحتوي على أي وصفات');
            }

            // Validate each recipe has at least a name
            for (let i = 0; i < parsed.length; i++) {
                if (!parsed[i].name) {
                    throw new Error(`الوصفة رقم ${i + 1} لا تحتوي على اسم`);
                }
            }

            recipes.value = parsed;
        } catch (err) {
            parseError.value = err instanceof Error ? err.message : 'خطأ في قراءة الملف';
            recipes.value = [];
        }
    };
    reader.readAsText(file);
};

const handleImport = async () => {
    if (recipes.value.length === 0) return;

    isImporting.value = true;
    result.value = null;

    try {
        const response = await fetch(route('dashboard.import.store'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify({ recipes: recipes.value }),
        });

        const data = await response.json();
        result.value = data.results;

        if (data.results.failed === 0) {
            toast.success(data.message);
        } else {
            toast.warning(`تم استيراد ${data.results.success} من ${data.results.total} وصفة`);
        }
    } catch (error) {
        console.error('Import failed:', error);
        toast.error('فشل في الاستيراد');
    } finally {
        isImporting.value = false;
    }
};

const handleReset = () => {
    recipes.value = [];
    fileName.value = null;
    result.value = null;
    parseError.value = null;
    if (fileInputRef.value) {
        fileInputRef.value.value = '';
    }
};

const jsonExample = `[
  {
    "name": "اسم الوصفة",
    "author": "اسم الكاتب",
    "image_link": "https://drive.google.com/open?id=...",
    "time_needed": "٣٠ دقيقة",
    "servings": "٤ أشخاص",
    "city": "شامية",
    "difficulty": "سهلة",
    "ingredients": [
      { "amount": "2", "unit": "كوب", "name": "طحين", "group": "المكونات" }
    ],
    "steps": {
      "التحضير": ["الخطوة الأولى", "الخطوة الثانية"]
    }
  }
]`;
</script>

<template>
    <DashboardLayout>
        <Head title="استيراد الوصفات" />

        <div class="space-y-6">
            <h2 class="text-2xl font-bold tracking-tight">استيراد الوصفات</h2>

            <!-- Unauthorized Alert -->
            <Alert v-if="!isAdmin" variant="destructive">
                <AlertTriangle class="h-4 w-4" />
                <AlertTitle>غير مصرح</AlertTitle>
                <AlertDescription>
                    هذه الصفحة متاحة للمسؤولين فقط.
                </AlertDescription>
            </Alert>

            <template v-else>
                <!-- File Upload Card -->
                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <FileJson class="h-5 w-5" />
                            رفع ملف JSON
                        </CardTitle>
                        <CardDescription>
                            اختر ملف JSON يحتوي على مصفوفة من الوصفات بالتنسيق المطلوب
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="flex items-center gap-4">
                            <input
                                ref="fileInputRef"
                                type="file"
                                accept=".json,application/json"
                                @change="handleFileSelect"
                                class="hidden"
                                id="json-file-input"
                            />
                            <Button
                                variant="outline"
                                @click="fileInputRef?.click()"
                                class="gap-2"
                            >
                                <Upload class="h-4 w-4" />
                                اختر ملف
                            </Button>
                            <span v-if="fileName" class="text-sm text-muted-foreground">
                                {{ fileName }}
                            </span>
                        </div>

                        <!-- Parse Error -->
                        <Alert v-if="parseError" variant="destructive">
                            <XCircle class="h-4 w-4" />
                            <AlertTitle>خطأ في الملف</AlertTitle>
                            <AlertDescription>{{ parseError }}</AlertDescription>
                        </Alert>

                        <!-- Ready to Import -->
                        <Alert v-if="recipes.length > 0 && !result">
                            <CheckCircle class="h-4 w-4" />
                            <AlertTitle>جاهز للاستيراد</AlertTitle>
                            <AlertDescription>
                                تم العثور على {{ recipes.length }} وصفة:
                                <ul class="mt-2 max-h-40 overflow-auto text-sm list-disc list-inside">
                                    <li v-for="(recipe, i) in recipes.slice(0, 10)" :key="i">
                                        {{ recipe.name }}
                                    </li>
                                    <li v-if="recipes.length > 10" class="text-muted-foreground">
                                        و {{ recipes.length - 10 }} وصفات أخرى...
                                    </li>
                                </ul>
                            </AlertDescription>
                        </Alert>

                        <!-- Importing Progress -->
                        <div v-if="isImporting" class="space-y-2">
                            <div class="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 class="h-4 w-4 animate-spin" />
                                جاري الاستيراد... قد يستغرق هذا بعض الوقت
                            </div>
                            <Progress :value="undefined" class="h-2" />
                        </div>

                        <!-- Import Result -->
                        <Alert v-if="result" :variant="result.failed === 0 ? 'default' : 'destructive'">
                            <CheckCircle v-if="result.failed === 0" class="h-4 w-4" />
                            <AlertTriangle v-else class="h-4 w-4" />
                            <AlertTitle>نتيجة الاستيراد</AlertTitle>
                            <AlertDescription>
                                <div class="mt-2 space-y-1">
                                    <div>الإجمالي: {{ result.total }}</div>
                                    <div class="text-green-600">نجحت: {{ result.success }}</div>
                                    <template v-if="result.failed > 0">
                                        <div class="text-red-600">فشلت: {{ result.failed }}</div>
                                        <ul class="mt-2 text-sm list-disc list-inside max-h-40 overflow-auto">
                                            <li v-for="(err, i) in result.errors" :key="i">
                                                <strong>{{ err.name }}</strong>: {{ err.error }}
                                            </li>
                                        </ul>
                                    </template>
                                </div>
                            </AlertDescription>
                        </Alert>

                        <!-- Action Buttons -->
                        <div class="flex gap-2">
                            <Button
                                @click="handleImport"
                                :disabled="recipes.length === 0 || isImporting"
                                class="gap-2"
                            >
                                <Loader2 v-if="isImporting" class="h-4 w-4 animate-spin" />
                                <Upload v-else class="h-4 w-4" />
                                {{ isImporting ? 'جاري الاستيراد...' : 'بدء الاستيراد' }}
                            </Button>
                            <Button
                                v-if="recipes.length > 0 || result"
                                variant="outline"
                                @click="handleReset"
                            >
                                إعادة تعيين
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <!-- Format Documentation Card -->
                <Card>
                    <CardHeader>
                        <CardTitle>تنسيق الملف المطلوب</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre class="bg-muted p-4 rounded-lg text-sm overflow-auto text-left" dir="ltr">{{ jsonExample }}</pre>
                    </CardContent>
                </Card>
            </template>
        </div>
    </DashboardLayout>
</template>
