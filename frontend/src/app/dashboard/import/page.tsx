'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, FileJson, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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

export default function ImportPage() {
    const { token, isAdmin } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [result, setResult] = useState<ImportResult | null>(null);
    const [parseError, setParseError] = useState<string | null>(null);

    if (!isAdmin) {
        return (
            <div className="space-y-6">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>غير مصرح</AlertTitle>
                    <AlertDescription>
                        هذه الصفحة متاحة للمسؤولين فقط.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setParseError(null);
        setResult(null);
        setFileName(file.name);

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

                setRecipes(parsed);
            } catch (err) {
                setParseError(err instanceof Error ? err.message : 'خطأ في قراءة الملف');
                setRecipes([]);
            }
        };
        reader.readAsText(file);
    };

    const handleImport = async () => {
        if (!token || recipes.length === 0) return;

        setIsImporting(true);
        setResult(null);

        try {
            const response = await api.admin.importRecipes(token, recipes);
            setResult(response.results as ImportResult);

            if (response.results.failed === 0) {
                toast.success(response.message);
            } else {
                toast.warning(`تم استيراد ${response.results.success} من ${response.results.total} وصفة`);
            }
        } catch (error) {
            console.error('Import failed:', error);
            toast.error('فشل في الاستيراد');
        } finally {
            setIsImporting(false);
        }
    };

    const handleReset = () => {
        setRecipes([]);
        setFileName(null);
        setResult(null);
        setParseError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">استيراد الوصفات</h2>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileJson className="h-5 w-5" />
                        رفع ملف JSON
                    </CardTitle>
                    <CardDescription>
                        اختر ملف JSON يحتوي على مصفوفة من الوصفات بالتنسيق المطلوب
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,application/json"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="json-file-input"
                        />
                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            اختر ملف
                        </Button>
                        {fileName && (
                            <span className="text-sm text-muted-foreground">
                                {fileName}
                            </span>
                        )}
                    </div>

                    {parseError && (
                        <Alert variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertTitle>خطأ في الملف</AlertTitle>
                            <AlertDescription>{parseError}</AlertDescription>
                        </Alert>
                    )}

                    {recipes.length > 0 && !result && (
                        <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertTitle>جاهز للاستيراد</AlertTitle>
                            <AlertDescription>
                                تم العثور على {recipes.length} وصفة:
                                <ul className="mt-2 max-h-40 overflow-auto text-sm list-disc list-inside">
                                    {recipes.slice(0, 10).map((recipe, i) => (
                                        <li key={i}>{recipe.name}</li>
                                    ))}
                                    {recipes.length > 10 && (
                                        <li className="text-muted-foreground">
                                            و {recipes.length - 10} وصفات أخرى...
                                        </li>
                                    )}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    {isImporting && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                جاري الاستيراد... قد يستغرق هذا بعض الوقت
                            </div>
                            <Progress value={undefined} className="h-2" />
                        </div>
                    )}

                    {result && (
                        <Alert variant={result.failed === 0 ? 'default' : 'destructive'}>
                            {result.failed === 0 ? (
                                <CheckCircle className="h-4 w-4" />
                            ) : (
                                <AlertTriangle className="h-4 w-4" />
                            )}
                            <AlertTitle>نتيجة الاستيراد</AlertTitle>
                            <AlertDescription>
                                <div className="mt-2 space-y-1">
                                    <div>الإجمالي: {result.total}</div>
                                    <div className="text-green-600">نجحت: {result.success}</div>
                                    {result.failed > 0 && (
                                        <>
                                            <div className="text-red-600">فشلت: {result.failed}</div>
                                            <ul className="mt-2 text-sm list-disc list-inside max-h-40 overflow-auto">
                                                {result.errors.map((err, i) => (
                                                    <li key={i}>
                                                        <strong>{err.name}</strong>: {err.error}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex gap-2">
                        <Button
                            onClick={handleImport}
                            disabled={recipes.length === 0 || isImporting}
                            className="gap-2"
                        >
                            {isImporting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Upload className="h-4 w-4" />
                            )}
                            {isImporting ? 'جاري الاستيراد...' : 'بدء الاستيراد'}
                        </Button>
                        {(recipes.length > 0 || result) && (
                            <Button variant="outline" onClick={handleReset}>
                                إعادة تعيين
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>تنسيق الملف المطلوب</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto text-left" dir="ltr">
                        {`[
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
]`}
                    </pre>
                </CardContent>
            </Card>
        </div>
    );
}
