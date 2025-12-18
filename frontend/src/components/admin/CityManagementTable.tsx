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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface CityManagementTableProps {
    cities: City[];
    onUpdate: () => void;
    pagination: Pagination;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    loading: boolean;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export function CityManagementTable({
    cities,
    onUpdate,
    pagination,
    onPageChange,
    onPerPageChange,
    loading
}: CityManagementTableProps) {
    const { token } = useAuth();
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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

    const handleOpenDelete = (city: City) => {
        setSelectedCity(city);
        setIsDeleteDialogOpen(true);
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
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'فشل العملية');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!token || !selectedCity) return;
        setIsLoading(true);
        try {
            await api.admin.deleteCity(token, selectedCity.id);
            toast.success('تم حذف المدينة');
            setIsDeleteDialogOpen(false);
            setSelectedCity(null);
            onUpdate();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'فشل الحذف');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">إدارة المدن</h3>
                <Button onClick={handleOpenCreate}>إضافة مدينة</Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>الاسم</TableHead>
                            <TableHead>الوصف</TableHead>
                            <TableHead>عدد الوصفات</TableHead>
                            <TableHead className="text-left">الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                    جاري التحميل...
                                </TableCell>
                            </TableRow>
                        ) : cities.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    لا توجد مدن
                                </TableCell>
                            </TableRow>
                        ) : (
                            cities.map((city) => (
                                <TableRow key={city.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {city.image_url && (
                                                <div className="relative h-10 w-10 overflow-hidden rounded-md">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={city.image_url}
                                                        alt={city.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <span className="font-medium">{city.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-md truncate">{city.description || '-'}</TableCell>
                                    <TableCell>{city.recipes_count || 0}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 justify-end">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleOpenEdit(city)}
                                            >
                                                تعديل
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleOpenDelete(city)}
                                            >
                                                حذف
                                            </Button>
                                        </div>
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
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
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

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>حذف المدينة</DialogTitle>
                        <DialogDescription>
                            هل أنت متأكد من حذف &quot;{selectedCity?.name}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
                            {selectedCity?.recipes_count && selectedCity.recipes_count > 0 && (
                                <div className="mt-2 text-red-600 font-medium">
                                    تنبيه: لا يمكن حذف مدينة تحتوي على وصفات ({selectedCity.recipes_count} وصفة).
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            إلغاء
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isLoading || (selectedCity?.recipes_count || 0) > 0}
                        >
                            تأكيد الحذف
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </>
    );
}
