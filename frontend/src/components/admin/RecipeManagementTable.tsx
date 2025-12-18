'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { AdminRecipe, Pagination } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

interface RecipeManagementTableProps {
    recipes: AdminRecipe[];
    onUpdate: () => void;
    pagination: Pagination;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    loading: boolean;
}

export function RecipeManagementTable({
    recipes,
    onUpdate,
    pagination,
    onPageChange,
    onPerPageChange,
    loading
}: RecipeManagementTableProps) {
    const { token, user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [selectedRecipe, setSelectedRecipe] = useState<AdminRecipe | null>(null);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Bulk Selection State
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(recipes.map(r => r.id));
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

    const handleBulkApprove = async () => {
        if (!token || selectedIds.length === 0) return;
        setIsLoading(true);
        try {
            // Process sequentially to avoid overwhelming server
            for (const id of selectedIds) {
                await api.admin.approveRecipe(token, id);
            }
            toast.success(`تمت الموافقة على ${selectedIds.length} وصفة`);
            setSelectedIds([]);
            onUpdate();
        } catch (error) {
            toast.error('حدث خطأ أثناء الموافقة الجماعية');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkUnpublish = async () => {
        if (!token || selectedIds.length === 0) return;
        setIsLoading(true);
        try {
            for (const id of selectedIds) {
                await api.admin.unpublishRecipe(token, id);
            }
            toast.success(`تم إلغاء نشر ${selectedIds.length} وصفة`);
            setSelectedIds([]);
            onUpdate();
        } catch (error) {
            toast.error('حدث خطأ أثناء إلغاء النشر الجماعي');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        if (!token || !isAdmin || selectedIds.length === 0) return;
        if (!confirm(`هل أنت متأكد من حذف ${selectedIds.length} وصفة؟ لا يمكن التراجع عن هذا الإجراء.`)) return;

        setIsLoading(true);
        try {
            for (const id of selectedIds) {
                await api.admin.deleteRecipe(token, id);
            }
            toast.success(`تم حذف ${selectedIds.length} وصفة`);
            setSelectedIds([]);
            onUpdate();
        } catch (error) {
            toast.error('حدث خطأ أثناء الحذف الجماعي');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkAiTag = async () => {
        if (!token || !isAdmin || selectedIds.length === 0) return;

        setIsLoading(true);
        toast.info('جاري المعالجة بالذكاء الاصطناعي... قد يستغرق هذا وقتاً');

        try {
            const result = await api.admin.bulkTag(token, selectedIds);

            if (result.errors && result.errors.length > 0) {
                console.error('Bulk tag errors:', result.errors);
                toast.warning(`تمت المعالجة مع بعض الأخطاء. نجاح: ${result.success_count}/${result.total}`);
            } else {
                toast.success(`تم تحديث الوسوم لـ ${result.success_count} وصفة بنجاح`);
            }
            setSelectedIds([]);
            onUpdate();
        } catch (error) {
            console.error('Bulk tag failed', error);
            toast.error('حدث خطأ أثناء المعالجة الجماعية');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (recipe: AdminRecipe) => {
        if (!token) return;
        setIsLoading(true);
        try {
            await api.admin.approveRecipe(token, recipe.id);
            toast.success('تمت الموافقة على الوصفة');
            onUpdate();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'فشل في الموافقة');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        if (!token || !selectedRecipe || !rejectReason.trim()) return;
        setIsLoading(true);
        try {
            await api.admin.rejectRecipe(token, selectedRecipe.id, rejectReason);
            toast.success('تم رفض الوصفة');
            setRejectDialogOpen(false);
            setRejectReason('');
            setSelectedRecipe(null);
            onUpdate();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'فشل في الرفض');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnpublish = async (recipe: AdminRecipe) => {
        if (!token) return;
        setIsLoading(true);
        try {
            await api.admin.unpublishRecipe(token, recipe.id);
            toast.success('تم إلغاء نشر الوصفة');
            onUpdate();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'فشل في إلغاء النشر');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (recipe: AdminRecipe) => {
        if (!token || !isAdmin) return;
        if (!confirm('هل أنت متأكد من حذف هذه الوصفة؟ لا يمكن التراجع عن هذا الإجراء.')) return;

        setIsLoading(true);
        try {
            await api.admin.deleteRecipe(token, recipe.id);
            toast.success('تم حذف الوصفة');
            onUpdate();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'فشل في الحذف');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: string, needsReapproval: boolean) => {
        if (needsReapproval) {
            return <Badge className="bg-orange-100 text-orange-800">تحتاج إعادة موافقة</Badge>;
        }
        switch (status) {
            case 'pending':
                return <Badge className="bg-amber-100 text-amber-800">بانتظار الموافقة</Badge>;
            case 'approved':
                return <Badge className="bg-green-100 text-green-800">منشورة</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800">مرفوضة</Badge>;
            case 'unpublished':
                return <Badge className="bg-gray-100 text-gray-800">غير منشورة</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loading) {
        return <div className="py-8 text-center">جاري التحميل...</div>;
    }

    if (recipes.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                لا توجد وصفات
            </div>
        );
    }

    return (
        <>
            {selectedIds.length > 0 && (
                <div className="bg-muted p-4 rounded-md mb-4 flex items-center justify-between">
                    <span className="font-medium text-sm">تم تحديد {selectedIds.length} عنصر</span>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={handleBulkApprove} disabled={isLoading}>
                            موافقة
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleBulkUnpublish} disabled={isLoading}>
                            إلغاء النشر
                        </Button>
                        {isAdmin && (
                            <>
                                <Button size="sm" variant="secondary" onClick={handleBulkAiTag} disabled={isLoading} className="gap-1">
                                    <span>✨</span> تنظيم الوسوم
                                </Button>
                                <Button size="sm" variant="destructive" onClick={handleBulkDelete} disabled={isLoading}>
                                    حذف
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedIds.length === recipes.length && recipes.length > 0}
                                    onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
                                />
                            </TableHead>
                            <TableHead>الوصفة</TableHead>
                            <TableHead>المؤلف</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead>التاريخ</TableHead>
                            <TableHead className="text-left">الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recipes.map((recipe) => (
                            <TableRow key={recipe.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.includes(recipe.id)}
                                        onCheckedChange={(checked: boolean) => handleSelectOne(recipe.id, checked)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        {recipe.image_url ? (
                                            <img
                                                src={recipe.image_url}
                                                alt={recipe.name}
                                                className="w-12 h-12 rounded object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                                                🍽️
                                            </div>
                                        )}
                                        <div>
                                            <Link
                                                href={`/recipes/${recipe.slug}`}
                                                className="font-medium hover:underline"
                                                target="_blank"
                                            >
                                                {recipe.name}
                                            </Link>
                                            <div className="text-sm text-muted-foreground">
                                                {recipe.city && <span>📍 {recipe.city}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {recipe.user ? (
                                        <div>
                                            <div className="font-medium">{recipe.user.name}</div>
                                            <div className="text-sm text-muted-foreground">{recipe.user.email}</div>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground">{recipe.author_name}</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(recipe.status, recipe.needs_reapproval)}
                                    {recipe.rejection_reason && (
                                        <div className="text-xs text-red-600 mt-1">
                                            سبب الرفض: {recipe.rejection_reason}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {formatRelativeTime(recipe.created_at)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2 justify-end">
                                        <Link href={`/recipes/${recipe.slug}/edit`} target="_blank">
                                            <Button size="sm" variant="ghost">
                                                تعديل
                                            </Button>
                                        </Link>
                                        {(recipe.status === 'pending' || recipe.needs_reapproval || recipe.status === 'unpublished') && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleApprove(recipe)}
                                                    disabled={isLoading}
                                                >
                                                    {recipe.status === 'unpublished' ? 'إعادة نشر' : 'موافقة'}
                                                </Button>
                                                {recipe.status !== 'unpublished' && (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => {
                                                            setSelectedRecipe(recipe);
                                                            setRejectDialogOpen(true);
                                                        }}
                                                        disabled={isLoading}
                                                    >
                                                        رفض
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                        {recipe.status === 'approved' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleUnpublish(recipe)}
                                                disabled={isLoading}
                                            >
                                                إلغاء النشر
                                            </Button>
                                        )}
                                        {isAdmin && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(recipe)}
                                                disabled={isLoading}
                                            >
                                                حذف
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
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

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>رفض الوصفة</DialogTitle>
                        <DialogDescription>
                            يرجى توضيح سبب رفض الوصفة &quot;{selectedRecipe?.name}&quot;
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        placeholder="سبب الرفض..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={4}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                            إلغاء
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={!rejectReason.trim() || isLoading}
                        >
                            تأكيد الرفض
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
