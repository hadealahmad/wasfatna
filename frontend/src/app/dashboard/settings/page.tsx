'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Save, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect, Option } from '@/components/ui/multi-select';

export default function SettingsPage() {
    const { token, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        gemini_api_key: '',
        gemini_model: '',
        default_city_id: '',
        randomizer_tags: [] as string[]
    });
    const [cities, setCities] = useState<{ id: number, name: string }[]>([]);
    const [aiModels, setAiModels] = useState<{ value: string, label: string }[]>([]);
    const [tags, setTags] = useState<Option[]>([]);

    // Import state
    const [importJson, setImportJson] = useState('');
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState<any>(null);

    useEffect(() => {
        if (!token) return;

        async function fetchData() {
            try {
                const [settingsRes, citiesRes, modelsRes, tagsRes] = await Promise.all([
                    api.admin.getSettings(token!),
                    api.admin.getCities(token!, { per_page: 100 }), // Fetch enough cities
                    api.admin.getAiModels(token!),
                    api.tags.list()
                ]);

                setSettings({
                    gemini_api_key: settingsRes.gemini_api_key || '',
                    gemini_model: settingsRes.gemini_model || '',
                    default_city_id: settingsRes.default_city_id || '',
                    randomizer_tags: Array.isArray(settingsRes.randomizer_tags) ? settingsRes.randomizer_tags.map(String) : []
                });

                // Handle cities response format
                const citiesData = (citiesRes as any).cities || [];
                setCities(citiesData);

                // Fetch and format tags - api.tags.list return unknown, need to check structure or assume from TagController.
                // TagController index returns simple array of tags objects or paginated?
                // backend TagController::index returns `response()->json($tags)` where $tags is collection.
                // api.ts: tags.list() returns `fetchApi<unknown>`.
                // Let's assume it returns array of {id, name, ...}
                const tagsData = (tagsRes as any[]).map((t: any) => ({ label: t.name, value: String(t.id) }));
                setTags(tagsData);

                setAiModels(modelsRes.models);
            } catch (error) {
                console.error('Failed to load settings:', error);
                toast.error('فشل تحميل الإعدادات');
            }
        }
        fetchData();
    }, [token]);

    const handleTagsChange = (selected: string[]) => {
        setSettings({ ...settings, randomizer_tags: selected });
    };

    const handleSaveSettings = async () => {
        if (!token) return;
        setLoading(true);
        try {
            await api.admin.updateSettings(token, {
                gemini_api_key: settings.gemini_api_key,
                gemini_model: settings.gemini_model,
                default_city_id: settings.default_city_id ? Number(settings.default_city_id) : undefined,
                randomizer_tags: settings.randomizer_tags.map(Number)
            });
            toast.success('تم حفظ الإعدادات');
        } catch (error: any) {
            toast.error(error.message || 'فشل حفظ الإعدادات');
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async () => {
        if (!token || !importJson.trim()) return;

        let recipes;
        try {
            recipes = JSON.parse(importJson);
            if (!Array.isArray(recipes)) throw new Error('يجب أن يكون الملف مصفوفة من الوصفات');
        } catch (e) {
            toast.error('صيغة JSON غير صحيحة');
            return;
        }

        setImporting(true);
        setImportResult(null);
        try {
            const result = await api.admin.importRecipes(token, recipes);
            setImportResult(result);
            toast.success(result.message);
            setImportJson('');
        } catch (error: any) {
            toast.error(error.message || 'فشل الاستيراد');
            if (error instanceof ApiError && (error.data as any)?.results?.errors) {
                // Check if raw errors provided
            }
        } finally {
            setImporting(false);
        }
    };

    if (user && user.role !== 'admin') {
        return <div className="p-8 text-center text-red-500">غير مصرح لك بالوصول إلى هذه الصفحة</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">الإعدادات</h2>

            <Tabs defaultValue="general" className="w-full">
                <TabsList>
                    <TabsTrigger value="general">عام</TabsTrigger>
                    <TabsTrigger value="ai">AI إعدادات</TabsTrigger>
                    <TabsTrigger value="import">استيراد وصفات</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>الإعدادات العامة</CardTitle>
                            <CardDescription>تكوين الإعدادات الأساسية للموقع</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="default_city">المدينة الافتراضية</Label>
                                <Select
                                    value={String(settings.default_city_id)}
                                    onValueChange={(val) => setSettings({ ...settings, default_city_id: val })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="اختر مدينة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map(city => (
                                            <SelectItem key={city.id} value={String(city.id)}>{city.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    هذه المدينة ستكون الوجهة الافتراضية للوصفات المحذوفة مدنها.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>الوسوم المستخدمة في العشوائي</Label>
                                <MultiSelect
                                    options={tags}
                                    selected={settings.randomizer_tags}
                                    onChange={handleTagsChange}
                                    placeholder="اختر الوسوم..."
                                />
                                <p className="text-xs text-muted-foreground">
                                    الوصفات التي تحتوي على أحد هذه الوسوم ستظهر في صفحة العشوائي. اتركها فارغة لعرض الكل (أو حسب المنطق الحالي).
                                    (Logic implemented: If selected, filter by these tags. If empty, show all approved recipes?)
                                    Actually looking at backend logic: if (!empty($randomizerTags))... so if empty, no filter applied.
                                </p>
                            </div>
                            <Button onClick={handleSaveSettings} disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                حفظ التغييرات
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ai" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>إعدادات الذكاء الاصطناعي</CardTitle>
                            <CardDescription>تكوين مفتاح API ونموذج Gemini</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="api_key">Gemini API Key</Label>
                                <Input
                                    id="api_key"
                                    type="password"
                                    value={settings.gemini_api_key}
                                    onChange={(e) => setSettings({ ...settings, gemini_api_key: e.target.value })}
                                    placeholder="AIza..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="model">Gemini Model</Label>
                                <Select
                                    value={settings.gemini_model}
                                    onValueChange={(val) => setSettings({ ...settings, gemini_model: val })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="اختر النموذج" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {aiModels.map(model => (
                                            <SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleSaveSettings} disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                حفظ التغييرات
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="import" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>استيراد وصفات</CardTitle>
                            <CardDescription>استيراد وصفات من ملف JSON</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>بيانات JSON</Label>
                                <Textarea
                                    value={importJson}
                                    onChange={(e) => setImportJson(e.target.value)}
                                    placeholder='[{"name": "...", "ingredients": ...}]'
                                    className="h-64 font-mono text-sm"
                                />
                            </div>
                            <Button onClick={handleImport} disabled={importing || !importJson.trim()}>
                                {importing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري الاستيراد...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" /> استيراد الوصفات
                                    </>
                                )}
                            </Button>

                            {importResult && (
                                <div className="mt-4 p-4 bg-muted rounded-md text-sm">
                                    <p className="font-bold">نتائج الاستيراد:</p>
                                    <ul className="list-disc list-inside mt-2">
                                        <li>الإجمالي: {importResult.results.total}</li>
                                        <li className="text-green-600">نجاح: {importResult.results.success}</li>
                                        <li className="text-red-600">فشل: {importResult.results.failed}</li>
                                    </ul>
                                    {importResult.results.errors && importResult.results.errors.length > 0 && (
                                        <div className="mt-2 text-red-600">
                                            <p className="font-semibold">الأخطاء:</p>
                                            <ul className="list-disc list-inside max-h-40 overflow-y-auto">
                                                {importResult.results.errors.map((err: any, idx: number) => (
                                                    <li key={idx}>وصفة #{err.index} ({err.name}): {err.error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
