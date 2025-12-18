'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { City, Pagination } from '@/types';
import { Button } from '@/components/ui/button';
import { PaginationControls } from '@/components/ui/PaginationControls';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { MoreHorizontal, Trash, Edit, Plus } from 'lucide-react';

interface UnifiedCityTableProps {
    cities: City[];
    onUpdate: () => void;
    pagination: Pagination;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    loading: boolean;
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
    onSort: (column: string) => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export function UnifiedCityTable({
    cities,
    onUpdate,
    pagination,
    onPageChange,
    onPerPageChange,
    loading,
    sortColumn,
    sortDirection,
    onSort
}: UnifiedCityTableProps) {
    const { token } = useAuth();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(cities.map(c => c.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setImageFile(null);
        setImagePreview(null);
        setSelectedCity(null);
    };

    const handleOpenCreate = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (city: City) => {
        setSelectedCity(city);
        setName(city.name);
        setDescription(city.description || '');
        setImagePreview(city.image_url || null);
        setImageFile(null);
        setIsDialogOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            toast.error('حجم الصورة يجب أن لا يتجاوز 2 ميجابايت');
            return;
        }

        setImageFile(file);
        const objectUrl = URL.createObjectURL(file);
        setImagePreview(objectUrl);
    };

    const handleSubmit = async () => {
        if (!token || !name.trim()) return;
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            if (description) formData.append('description', description);
            if (imageFile) formData.append('image', imageFile);

            if (selectedCity) {
                await api.admin.updateCity(token, selectedCity.id, formData);
                toast.success('تم تحديث المدينة');
            } else {
                await api.admin.createCity(token, formData);
                toast.success('تم إنشاء المدينة');
            }
            setIsDialogOpen(false);
            resetForm();
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || 'فشل العملية');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        if (!token || selectedIds.length === 0) return;
        if (!confirm(`هل أنت متأكد من حذف ${selectedIds.length} مدينة؟ سيتم نقل الوصفات إلى المدينة الافتراضية.`)) return;

        setIsLoading(true);
        try {
            await api.admin.bulkCityActions(token, selectedIds, 'delete');
            toast.success('تم حذف المدن');
            setSelectedIds([]);
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || 'فشل الحذف الجماعي');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSingle = async (city: City) => {
        if (!token) return;
        if (!confirm(`هل أنت متأكد من حذف ${city.name}؟ سيتم نقل الوصفات إلى المدينة الافتراضية.`)) return;

        setIsLoading(true);
        try {
            await api.admin.deleteCity(token, city.id);
            toast.success('تم حذف المدينة');
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || 'فشل الحذف');
        } finally {
            setIsLoading(false);
        }
    };


    if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                {selectedIds.length > 0 ? (
                    <div className="bg-muted px-4 py-2 rounded-lg flex items-center gap-4">
                        <span className="font-medium text-sm">تم تحديد {selectedIds.length}</span>
                        <Button size="sm" variant="destructive" onClick={handleBulkDelete} disabled={isLoading}>
                            <Trash className="w-4 h-4 mr-1" /> حذف المحدد
                        </Button>
                    </div>
                ) : (
                    <div></div> // Spacer
                )}
                <Button onClick={handleOpenCreate}>
                    <Plus className="w-4 h-4 mr-1" /> إضافة مدينة
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={cities.length > 0 && selectedIds.length === cities.length}
                                    onCheckedChange={(c) => handleSelectAll(!!c)}
                                />
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSort('name')}>
                                المدينة {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead>الوصف</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSort('recipes_count')}>
                                الوصفات {sortColumn === 'recipes_count' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead>الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cities.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    لا توجد مدن
                                </TableCell>
                            </TableRow>
                        ) : (
                            cities.map((city) => (
                                <TableRow key={city.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(city.id)}
                                            onCheckedChange={(c) => handleSelectOne(city.id, !!c)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {city.image_url ? (
                                                <img src={city.image_url} alt={city.name} className="w-10 h-10 rounded object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">🏙️</div>
                                            )}
                                            <span className="font-medium">{city.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate text-muted-foreground">
                                        {city.description || '-'}
                                    </TableCell>
                                    <TableCell>
                                        {city.recipes_count}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenEdit(city)}>
                                                    <Edit className="h-4 w-4" /> تعديل
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteSingle(city)} className="text-red-600">
                                                    <Trash className="h-4 w-4" /> حذف
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <PaginationControls
                currentPage={pagination.current_page}
                totalPages={pagination.last_page}
                perPage={pagination.per_page}
                totalItems={pagination.total}
                onPageChange={onPageChange}
                onPerPageChange={onPerPageChange}
            />

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{selectedCity ? 'تعديل مدينة' : 'إضافة مدينة جديدة'}</DialogTitle>
                        <DialogDescription>
                            {selectedCity ? 'تعديل بيانات المدينة' : 'أدخل بيانات المدينة الجديدة'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">اسم المدينة</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="مثال: دمشق"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">صورة المدينة (اختياري)</label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {imagePreview && (
                                <div className="mt-2 relative h-40 w-full overflow-hidden rounded-md border">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">وصف (اختياري)</label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="وصف قصير عن المدينة ومطبخها..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            إلغاء
                        </Button>
                        <Button onClick={handleSubmit} disabled={!name.trim() || isLoading}>
                            {selectedCity ? 'حفظ التعديلات' : 'إنشاء'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
