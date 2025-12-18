'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { City, Ingredient, Recipe, Difficulty, IngredientItem } from '@/types';
import { compressImage, validateImageFile } from '@/lib/image-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminUser } from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { TagInput } from '@/components/TagInput';
import { Combobox } from '@/components/ui/combobox';
import { toast } from 'sonner';

interface RecipeFormProps {
    cities: City[];
    initialData?: Recipe;
}

const difficulties = [
    'سهلة جداً',
    'سهلة',
    'متوسطة',
    'صعبة',
    'صعبة جداً',
];

export function RecipeForm({ cities, initialData }: RecipeFormProps) {
    const router = useRouter();
    const { token, isAuthenticated, isLoading, isAdmin } = useAuth();
    const isEditing = !!initialData;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAiProcessing, setIsAiProcessing] = useState(false);
    const [users, setUsers] = useState<AdminUser[]>([]);

    // Initialize state with initialData if available
    const [name, setName] = useState(initialData?.name || '');
    const [authorId, setAuthorId] = useState(initialData?.user?.id ? String(initialData.user.id) : '');
    const [isManualAuthor, setIsManualAuthor] = useState(initialData?.is_anonymous || false);
    const [manualAuthorName, setManualAuthorName] = useState(
        initialData?.is_anonymous && initialData?.author_name
            ? initialData.author_name
            : ''
    );
    const [servings, setServings] = useState(initialData?.servings || '');
    const [cityId, setCityId] = useState(
        initialData?.city && initialData.city_slug
            ? String(cities.find(c => c.slug === initialData.city_slug)?.id || '')
            : ''
    );
    const [difficulty, setDifficulty] = useState<Difficulty>(initialData?.difficulty || 'متوسطة');
    const [tags, setTags] = useState<string[]>(initialData?.tags?.map(t => t.name) || []);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);

    // Parse time needed
    const getInitialTimeEntries = () => {
        if (!initialData?.time_needed) return [{ step: '', duration: '' }];
        if (typeof initialData.time_needed === 'string') {
            return [{ step: '', duration: initialData.time_needed }];
        }
        return Object.entries(initialData.time_needed).map(([step, duration]) => ({
            step,
            duration: String(duration)
        }));
    };

    const [timeEntries, setTimeEntries] = useState<{ step: string; duration: string }[]>(
        getInitialTimeEntries()
    );

    // Parse Ingredients
    const getInitialIngredients = () => {
        if (!initialData?.ingredients) return [{ name: '', items: [{ amount: '', unit: '', name: '', descriptor: '' }] }];

        // Handle Array format (New API or Legacy Strings)
        if (Array.isArray(initialData.ingredients)) {
            if (initialData.ingredients.length === 0) {
                return [{ name: '', items: [{ amount: '', unit: '', name: '', descriptor: '' }] }];
            }

            const firstItem = initialData.ingredients[0];

            // New Ordered Group Format
            if (firstItem && typeof firstItem === 'object' && 'name' in firstItem && 'items' in firstItem) {
                return (initialData.ingredients as { name: string; items: IngredientItem[] }[]).map(group => ({
                    name: group.name,
                    items: group.items.map(i => ({
                        amount: i.amount || '',
                        unit: i.unit || '',
                        name: i.name || '',
                        descriptor: i.descriptor || ''
                    }))
                }));
            }

            // Check if it's structured objects (New API flattened)
            if (typeof firstItem === 'object' && firstItem !== null && 'name' in firstItem) {
                const grouped: Record<string, { amount: string; unit: string; name: string; descriptor: string }[]> = {};
                const groupsOrder: string[] = []; // To preserve order of appearance

                (initialData.ingredients as any[]).forEach(item => {
                    // Use 'المكونات' as default if group is null/empty
                    const groupName = item.group || '';
                    if (!grouped[groupName]) {
                        grouped[groupName] = [];
                        groupsOrder.push(groupName);
                    }

                    grouped[groupName].push({
                        amount: item.amount || '',
                        unit: item.unit || '',
                        name: item.name || '',
                        descriptor: item.descriptor || '' // descriptor is the field name
                    });
                });

                return groupsOrder.map(name => ({
                    name,
                    items: grouped[name]
                }));
            }

            // Legacy Strings
            return [{
                name: '',
                items: initialData.ingredients.map(ing => ({
                    amount: '',
                    unit: '',
                    name: typeof ing === 'string' ? ing : '',
                    descriptor: ''
                }))
            }];
        }

        // Handle Object format (Legacy Grouped Strings - Map)
        return Object.entries(initialData.ingredients).map(([name, items]) => ({
            name,
            items: (Array.isArray(items) ? items : [String(items)]).map(ing => ({
                amount: '',
                unit: '',
                name: typeof ing === 'string' ? ing : '',
                descriptor: ''
            }))
        }));
    };

    const [ingredientGroups, setIngredientGroups] = useState<{
        name: string;
        items: { amount: string; unit: string; name: string; descriptor: string }[]
    }[]>(
        getInitialIngredients()
    );

    // Parse Steps
    const getInitialSteps = () => {
        if (!initialData?.steps) return [{ name: '', items: [''] }];
        if (Array.isArray(initialData.steps)) {
            // Check for new ordered group format
            if (initialData.steps.length > 0 && typeof initialData.steps[0] === 'object' && 'name' in initialData.steps[0]) {
                return (initialData.steps as { name: string; items: string[] }[]).map(group => ({
                    name: group.name,
                    items: group.items
                }));
            }
            // Simple array of strings
            return [{ name: '', items: initialData.steps as string[] }];
        }
        // Legacy Object format
        return Object.entries(initialData.steps).map(([name, items]) => ({
            name,
            items: Array.isArray(items) ? items : [String(items)] // Ensure items is array
        }));
    };

    const [stepGroups, setStepGroups] = useState<{ name: string; items: string[] }[]>(
        getInitialSteps()
    );

    // Ingredient autocomplete
    const [currentIngredientInput, setCurrentIngredientInput] = useState('');
    const [ingredientSuggestions, setIngredientSuggestions] = useState<Ingredient[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [isLoading, isAuthenticated, router]);

    // Fetch users for admin
    useEffect(() => {
        if (isAdmin && token) {
            api.admin.getUsers(token).then(res => {
                if (res && typeof res === 'object' && 'users' in res) {
                    // @ts-ignore
                    setUsers(res.users.data);
                }
            }).catch(console.error);
        }
    }, [isAdmin, token]);

    // Search ingredients
    const searchIngredients = useCallback(async (query: string) => {
        if (query.length < 2) {
            setIngredientSuggestions([]);
            return;
        }

        try {
            const response = await api.ingredients.search(query) as { ingredients: Ingredient[] };
            setIngredientSuggestions(response.ingredients);
        } catch {
            setIngredientSuggestions([]);
        }
    }, []);

    // AI Processing
    const handleAiProcess = async () => {
        if (!token || !isAdmin) return;

        // Collect current raw text content to send to AI
        const rawIngredients = ingredientGroups.map(g =>
            g.items.map(i => `${i.amount} ${i.unit} ${i.name} ${i.descriptor}`).filter(t => t.trim().length > 3).join('\n')
        ).join('\n\n');

        const rawSteps = stepGroups.map(g =>
            g.items.join('\n')
        ).join('\n\n');

        if (!rawIngredients.trim() && !rawSteps.trim()) {
            toast.error('الرجاء تعبئة بعض المكونات أو الخطوات أولاً');
            return;
        }

        setIsAiProcessing(true);
        toast.loading('جاري المعالجة بالذكاء الاصطناعي...');

        try {
            const result = await api.admin.processWithAi(token, {
                ingredients: rawIngredients,
                steps: rawSteps,
                locale: 'ar' // Assuming Arabic content mostly
            });

            // Update state with structured data
            if (result.ingredientGroups && Array.isArray(result.ingredientGroups)) {
                setIngredientGroups(result.ingredientGroups.map((group: any) => ({
                    name: group.name || 'Main',
                    items: Array.isArray(group.items) ? group.items.map((item: any) => ({
                        amount: item.amount || '',
                        unit: item.unit || '',
                        name: item.name || item.item || '',
                        descriptor: item.descriptor || ''
                    })) : []
                })));
            }

            if (result.stepGroups && Array.isArray(result.stepGroups)) {
                setStepGroups(result.stepGroups.map((group: any) => ({
                    name: group.name || 'Main',
                    items: Array.isArray(group.items) ? group.items.map((s: any) => typeof s === 'string' ? s : JSON.stringify(s)) : []
                })));
            }

            if (result.tags && Array.isArray(result.tags)) {
                // Merge with existing tags, avoiding duplicates
                const newTags = Array.from(new Set([...tags, ...result.tags]));
                setTags(newTags);
            }

            toast.dismiss();
            toast.success('تم تنظيم البيانات بنجاح');

        } catch (error: any) {
            console.error('AI Processing Error:', error);
            toast.dismiss();

            // Try to extract a friendly message
            const message = error?.data?.error || error?.message || 'حدث خطأ أثناء المعالجة';
            toast.error(message);
        } finally {
            setIsAiProcessing(false);
        }
    };

    // Handle image selection
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validationError = validateImageFile(file);
        if (validationError) {
            toast.error(validationError);
            return;
        }

        // Show loading
        toast.loading('جاري معالجة الصورة...');

        const result = await compressImage(file);
        toast.dismiss();

        if (!result.success || !result.file) {
            toast.error(result.error || 'فشل في معالجة الصورة');
            return;
        }

        setImage(result.file);
        setImagePreview(URL.createObjectURL(result.file));
        toast.success('تم معالجة الصورة بنجاح');
    };

    // Time entries management
    const addTimeEntry = () => {
        setTimeEntries([...timeEntries, { step: '', duration: '' }]);
    };

    const updateTimeEntry = (index: number, field: 'step' | 'duration', value: string) => {
        const updated = [...timeEntries];
        updated[index][field] = value;
        setTimeEntries(updated);
    };

    // Ingredient groups management
    const addIngredientGroup = () => {
        setIngredientGroups([...ingredientGroups, { name: '', items: [{ amount: '', unit: '', name: '', descriptor: '' }] }]);
    };

    const addIngredientItem = (groupIndex: number) => {
        const updated = [...ingredientGroups];
        updated[groupIndex].items.push({ amount: '', unit: '', name: '', descriptor: '' });
        setIngredientGroups(updated);
    };

    const updateIngredientGroup = (groupIndex: number, name: string) => {
        const updated = [...ingredientGroups];
        updated[groupIndex].name = name;
        setIngredientGroups(updated);
    };

    const updateIngredientItem = (groupIndex: number, itemIndex: number, field: 'amount' | 'unit' | 'name' | 'descriptor', value: string) => {
        const updated = [...ingredientGroups];
        updated[groupIndex].items[itemIndex][field] = value;
        setIngredientGroups(updated);

        // Search for suggestions only when typing ingredient name
        if (field === 'name') {
            setCurrentIngredientInput(value);
            searchIngredients(value);
            setShowSuggestions(true);
        }
    };

    // Step groups management
    const addStepGroup = () => {
        setStepGroups([...stepGroups, { name: '', items: [''] }]);
    };

    const addStepItem = (groupIndex: number) => {
        const updated = [...stepGroups];
        updated[groupIndex].items.push('');
        setStepGroups(updated);
    };

    const updateStepGroup = (groupIndex: number, name: string) => {
        const updated = [...stepGroups];
        updated[groupIndex].name = name;
        setStepGroups(updated);
    };

    const updateStepItem = (groupIndex: number, itemIndex: number, value: string) => {
        const updated = [...stepGroups];
        updated[groupIndex].items[itemIndex] = value;
        setStepGroups(updated);
    };

    // Build data structures
    const buildTimeNeeded = () => {
        const validEntries = timeEntries.filter(e => e.step && e.duration);
        if (validEntries.length === 0) return null;
        if (validEntries.length === 1 && !validEntries[0].step) {
            return validEntries[0].duration;
        }
        return Object.fromEntries(validEntries.map(e => [e.step, e.duration]));
    };

    const buildIngredients = () => {
        // If only one group with no name, return flat array of items (Legacy/Simple format)
        if (ingredientGroups.length === 1 && !ingredientGroups[0].name) {
            return ingredientGroups[0].items
                .filter(i => i.name.trim())
                .map(i => ({
                    amount: i.amount,
                    unit: i.unit,
                    name: i.name,
                    descriptor: i.descriptor
                }));
        }

        // Return Ordered Array of Groups (New Format)
        return ingredientGroups
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
        // If only one group with no name, return flat array (Legacy/Simple format)
        if (stepGroups.length === 1 && !stepGroups[0].name) {
            return stepGroups[0].items.filter(s => s.trim());
        }

        // Return Ordered Array of Groups (New Format)
        return stepGroups
            .filter(g => g.items.some(s => s.trim()))
            .map(g => ({
                name: g.name || 'الخطوات',
                items: g.items.filter(s => s.trim())
            }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error('يجب تسجيل الدخول أولاً');
            return;
        }

        if (!name.trim()) {
            toast.error('يرجى إدخال اسم الوصفة');
            return;
        }

        const ingredients = buildIngredients();
        const steps = buildSteps();

        if ((Array.isArray(ingredients) && ingredients.length === 0) ||
            (typeof ingredients === 'object' && Object.keys(ingredients).length === 0)) {
            toast.error('يرجى إضافة المكونات');
            return;
        }

        if ((Array.isArray(steps) && steps.length === 0) ||
            (typeof steps === 'object' && Object.keys(steps).length === 0)) {
            toast.error('يرجى إضافة خطوات التحضير');
            return;
        }

        // Image validation for new recipes
        if (!isEditing && !image) {
            toast.error('يرجى إضافة صورة للوصفة');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('difficulty', difficulty);
            formData.append('ingredients', JSON.stringify(ingredients));
            formData.append('steps', JSON.stringify(steps));
            formData.append('tags', JSON.stringify(tags));

            if (servings) formData.append('servings', servings);
            if (cityId) formData.append('city_id', cityId);
            if (image) formData.append('image', image);

            if (isAdmin) {
                if (isManualAuthor) {
                    if (!manualAuthorName.trim()) {
                        toast.error('يرجى إدخال اسم المؤلف');
                        setIsSubmitting(false);
                        return;
                    }
                    formData.append('manual_author_name', manualAuthorName);
                } else if (authorId) {
                    formData.append('user_id', authorId);
                }
            }

            const timeNeeded = buildTimeNeeded();
            if (timeNeeded) formData.append('time_needed', JSON.stringify(timeNeeded));

            if (isEditing && initialData) {
                await api.recipes.update(token, initialData.id, formData);
                if (initialData.status === 'approved' && !isAdmin) {
                    toast.success('تم تحديث الوصفة وإرسالها للمراجعة');
                } else {
                    toast.success('تم تحديث الوصفة بنجاح');
                }
            } else {
                await api.recipes.create(token, formData);
                if (isAdmin) {
                    toast.success('تم نشر الوصفة بنجاح');
                } else {
                    toast.success('تم إرسال الوصفة للمراجعة');
                }
            }

            // Redirect appropriately
            if (isAdmin) {
                router.push('/dashboard');
            } else {
                router.push('/my-recipes');
            }
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : isEditing ? 'فشل في تحديث الوصفة' : 'فشل في إرسال الوصفة');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? 'تعديل الوصفة' : 'معلومات الوصفة'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {isAdmin && (
                        <div className="bg-muted/50 border rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">✨</span>
                                    <h3 className="font-semibold">مساعد الذكاء الاصطناعي</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    استخدم الذكاء الاصطناعي لتنظيم المكونات والخطوات واقتراح الوسوم تلقائياً.
                                </p>
                            </div>
                            <Button
                                type="button"
                                onClick={handleAiProcess}
                                disabled={isAiProcessing}
                                variant="secondary"
                                className="shrink-0"
                            >
                                {isAiProcessing ? 'جاري المعالجة...' : 'تنظيم المحتوى'}
                            </Button>
                        </div>
                    )}

                    <div>
                        <Label htmlFor="name" className="text-base mb-2 block">اسم الوصفة *</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="مثال: منسف رز"
                            required
                            className="h-12 text-base bg-background"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Label htmlFor="city" className="text-base mb-2 block">المدينة</Label>
                            <Combobox
                                options={cities.map(c => ({ value: String(c.id), label: c.name }))}
                                value={cityId}
                                onChange={setCityId}
                                placeholder="اختر المدينة"
                                searchPlaceholder="بحث في المدن..."
                                className="w-full bg-background h-12 text-base"
                            />
                        </div>

                        <div>
                            <Label htmlFor="difficulty" className="text-base mb-2 block">مستوى الصعوبة *</Label>
                            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                                <SelectTrigger size="lg" className="w-full bg-background h-12 text-base">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {difficulties.map((d) => (
                                        <SelectItem key={d} value={d} className="text-base py-3">{d}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                    </div>

                    <div className="md:col-span-3">
                        <Label className="text-base mb-2 block">الوسوم</Label>
                        <TagInput
                            value={tags}
                            onChange={setTags}
                            placeholder="اختر أو اضف وسوم..."
                        />
                    </div>

                    <div>
                        <Label htmlFor="servings" className="text-base mb-2 block">عدد الحصص</Label>
                        <Input
                            id="servings"
                            value={servings}
                            onChange={(e) => setServings(e.target.value)}
                            placeholder="مثال: 4-6 أشخاص"
                            className="h-12 text-base bg-background"
                        />
                    </div>


                    {isAdmin && (
                        <div className="mt-4 p-4 border rounded-lg bg-muted/10">
                            <div className="flex items-center gap-2 mb-4">
                                <input
                                    type="checkbox"
                                    id="isManualAuthor"
                                    checked={isManualAuthor}
                                    onChange={(e) => setIsManualAuthor(e.target.checked)}
                                    className="w-4 h-4 accent-primary"
                                />
                                <Label htmlFor="isManualAuthor" className="cursor-pointer select-none">
                                    مؤلف خارجي / غير مسجل
                                </Label>
                            </div>

                            {isManualAuthor ? (
                                <div>
                                    <Label htmlFor="manualAuthorName" className="text-base mb-2 block">اسم المؤلف</Label>
                                    <Input
                                        id="manualAuthorName"
                                        value={manualAuthorName}
                                        onChange={(e) => setManualAuthorName(e.target.value)}
                                        placeholder="أدخل اسم المؤلف..."
                                        className="h-12 text-base bg-background"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <Label htmlFor="author" className="text-base mb-2 block">المؤلف (مستخدم مسجل)</Label>
                                    <Select value={authorId} onValueChange={setAuthorId}>
                                        <SelectTrigger size="lg" className="w-full bg-background h-12 text-base">
                                            <SelectValue placeholder="اختر المؤلف" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map((user) => (
                                                <SelectItem key={user.id} value={String(user.id)} className="text-base py-3">
                                                    {user.name} ({user.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Image Upload */}
                    <div>
                        <Label className="text-base mb-2 block">صورة الوصفة</Label>
                        <div className="mt-2">
                            {imagePreview ? (
                                <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border bg-background">
                                    <img src={imagePreview} alt="معاينة" className="object-cover w-full h-full" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => { setImage(null); setImagePreview(null); }}
                                    >
                                        حذف
                                    </Button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full max-w-md h-52 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors bg-background">
                                    <span className="text-4xl mb-4">📷</span>
                                    <span className="text-base text-muted-foreground font-medium">اضغط لاختيار صورة</span>
                                    <span className="text-sm text-muted-foreground mt-2">(الحد الأقصى 1 ميغابايت)</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Time Needed */}
            <Card>
                <CardHeader>
                    <CardTitle>الوقت المطلوب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {timeEntries.map((entry, index) => (
                        <div key={index} className="grid grid-cols-2 gap-4">
                            <Input
                                placeholder="المرحلة (مثال: التحضير)"
                                value={entry.step}
                                onChange={(e) => updateTimeEntry(index, 'step', e.target.value)}
                                className="h-12 text-base bg-background"
                            />
                            <Input
                                placeholder="المدة (مثال: 30 دقيقة)"
                                value={entry.duration}
                                onChange={(e) => updateTimeEntry(index, 'duration', e.target.value)}
                                className="h-12 text-base bg-background"
                            />
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addTimeEntry} className="h-10">
                        + إضافة مرحلة
                    </Button>
                </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
                <CardHeader>
                    <CardTitle>المكونات *</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {ingredientGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-4 p-5 border rounded-xl bg-muted/20">
                            {ingredientGroups.length > 1 && (
                                <Input
                                    placeholder="اسم المجموعة (مثال: العجينة)"
                                    value={group.name}
                                    onChange={(e) => updateIngredientGroup(groupIndex, e.target.value)}
                                    className="font-semibold h-12 text-base bg-background mb-2"
                                />
                            )}
                            {group.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="space-y-2">
                                    <div className="grid grid-cols-4 gap-2">
                                        <Input
                                            placeholder="الكمية"
                                            value={item.amount}
                                            onChange={(e) => updateIngredientItem(groupIndex, itemIndex, 'amount', e.target.value)}
                                            className="h-11 text-base bg-background"
                                        />
                                        <Input
                                            placeholder="الوحدة"
                                            value={item.unit}
                                            onChange={(e) => updateIngredientItem(groupIndex, itemIndex, 'unit', e.target.value)}
                                            className="h-11 text-base bg-background"
                                        />
                                        <div className="relative col-span-2">
                                            <Input
                                                placeholder="المكون *"
                                                value={item.name}
                                                onChange={(e) => updateIngredientItem(groupIndex, itemIndex, 'name', e.target.value)}
                                                className="h-11 text-base bg-background"
                                            />
                                            {showSuggestions && ingredientSuggestions.length > 0 && currentIngredientInput === item.name && (
                                                <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-lg overflow-hidden">
                                                    {ingredientSuggestions.slice(0, 5).map((suggestion) => (
                                                        <button
                                                            key={suggestion.id}
                                                            type="button"
                                                            className="w-full px-4 py-3 text-right hover:bg-muted text-base"
                                                            onClick={() => {
                                                                updateIngredientItem(groupIndex, itemIndex, 'name', suggestion.name);
                                                                setShowSuggestions(false);
                                                            }}
                                                        >
                                                            {suggestion.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Input
                                        placeholder="وصف إضافي (اختياري)"
                                        value={item.descriptor}
                                        onChange={(e) => updateIngredientItem(groupIndex, itemIndex, 'descriptor', e.target.value)}
                                        className="h-10 text-sm bg-background text-muted-foreground"
                                    />
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => addIngredientItem(groupIndex)}
                                className="text-muted-foreground hover:text-primary"
                            >
                                + مكون جديد
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addIngredientGroup} className="w-full h-12 border-dashed">
                        + مجموعة مكونات جديدة
                    </Button>
                </CardContent>
            </Card>

            {/* Steps */}
            <Card>
                <CardHeader>
                    <CardTitle>طريقة التحضير *</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {stepGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-4 p-5 border rounded-xl bg-muted/20">
                            {stepGroups.length > 1 && (
                                <Input
                                    placeholder="اسم المرحلة (مثال: تحضير الصلصة)"
                                    value={group.name}
                                    onChange={(e) => updateStepGroup(groupIndex, e.target.value)}
                                    className="font-semibold h-12 text-base bg-background mb-2"
                                />
                            )}
                            {group.items.map((item, itemIndex) => (
                                <Textarea
                                    key={itemIndex}
                                    placeholder={`الخطوة ${itemIndex + 1}`}
                                    value={item}
                                    onChange={(e) => updateStepItem(groupIndex, itemIndex, e.target.value)}
                                    rows={3}
                                    className="text-base bg-background resize-y min-h-[100px]"
                                />
                            ))}
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => addStepItem(groupIndex)}
                                className="text-muted-foreground hover:text-primary"
                            >
                                + خطوة جديدة
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addStepGroup} className="w-full h-12 border-dashed">
                        + مرحلة جديدة
                    </Button>
                </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    إلغاء
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                        ? (isEditing ? 'جاري التحديث...' : 'جاري الإرسال...')
                        : (isEditing
                            ? (isAdmin ? 'تحديث الوصفة' : 'تحديث وإرسال للمراجعة')
                            : (isAdmin ? 'نشر الوصفة' : 'إرسال للمراجعة')
                        )
                    }
                </Button>
            </div>
        </form >
    );
}
