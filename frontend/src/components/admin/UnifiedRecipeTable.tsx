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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
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
import { MoreHorizontal, Edit, Trash, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

interface UnifiedRecipeTableProps {
    recipes: AdminRecipe[];
    onUpdate: () => void;
    pagination: Pagination;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    loading: boolean;
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
    onSort: (column: string) => void;
}

export function UnifiedRecipeTable({
    recipes,
    onUpdate,
    pagination,
    onPageChange,
    onPerPageChange,
    loading,
    sortColumn,
    sortDirection,
    onSort
}: UnifiedRecipeTableProps) {
    const { token, user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Dialog states
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<AdminRecipe | null>(null);
    const [rejectReason, setRejectReason] = useState('');

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

    const handleBulkAction = async (action: 'delete' | 'publish' | 'unpublish' | 'change_status', status?: string) => {
        if (!token || selectedIds.length === 0) return;
        if (action === 'delete' && !confirm(`هل أنت متأكد من حذف ${selectedIds.length} وصفة؟`)) return;

        setIsLoading(true);
        try {
            await api.admin.bulkRecipeActions(token, selectedIds, action, status);
            toast.success('تم تنفيذ الإجراء بنجاح');
            setSelectedIds([]);
            onUpdate();
        } catch (error) {
            toast.error('حدث خطأ أثناء تنفيذ الإجراء');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSingleStatusChange = async (recipe: AdminRecipe, newStatus: string) => {
        if (!token) return;

        // If rejecting, show dialog
        if (newStatus === 'rejected') {
            setSelectedRecipe(recipe);
            setRejectDialogOpen(true);
            return;
        }

        setIsLoading(true);
        try {
            await api.admin.bulkRecipeActions(token, [recipe.id], 'change_status', newStatus);
            toast.success('تم تحديث حالة الوصفة');
            onUpdate();
        } catch (error) {
            toast.error('حدث خطأ أثناء تحديث الحالة');
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
            toast.error('فشل الرفض');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkAiTagging = async () => {
        if (!token || selectedIds.length === 0) return;

        setIsLoading(true);
        try {
            const result = await api.admin.bulkTag(token, selectedIds);
            if (result.success_count > 0) {
                toast.success(`تم تحديث وسوم ${result.success_count} وصفة بنجاح`);
            }
            if (result.errors && result.errors.length > 0) {
                toast.error(`حدثت أخطاء في ${result.errors.length} وصفات`);
                console.error('AI Tagging errors:', result.errors);
            }
            setSelectedIds([]);
            onUpdate();
        } catch (error) {
            toast.error('فشل عملية تنظيم الوسوم');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (recipe: AdminRecipe) => {
        if (!token || !isAdmin) return;
        if (!confirm('هل أنت متأكد من حذف هذه الوصفة؟')) return;

        setIsLoading(true);
        try {
            await api.admin.deleteRecipe(token, recipe.id);
            toast.success('تم حذف الوصفة');
            onUpdate();
        } catch (error) {
            toast.error('فشل الحذف');
        } finally {
            setIsLoading(false);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const colors: Record<string, string> = {
            approved: 'bg-green-100 text-green-800',
            pending: 'bg-amber-100 text-amber-800',
            rejected: 'bg-red-100 text-red-800',
            unpublished: 'bg-gray-100 text-gray-800',
        };
        const labels: Record<string, string> = {
            approved: 'منشورة',
            pending: 'بانتظار الموافقة',
            rejected: 'مرفوضة',
            unpublished: 'غير منشورة',
        };
        return <Badge className={colors[status] || 'bg-gray-100'}>{labels[status] || status}</Badge>;
    };

    if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

    return (
        <div>
            {selectedIds.length > 0 && (
                <div className="bg-muted p-4 rounded-lg mb-4 flex items-center justify-between">
                    <span className="font-medium text-sm">تم تحديد {selectedIds.length} عنصر</span>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleBulkAction('publish')} disabled={isLoading}>
                            نشر
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleBulkAction('unpublish')} disabled={isLoading}>
                            إلغاء النشر
                        </Button>
                        {isAdmin && (
                            <>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={handleBulkAiTagging}
                                    disabled={isLoading}
                                >
                                    ✨ تنظيم الوسوم
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')} disabled={isLoading}>
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
                                    checked={recipes.length > 0 && selectedIds.length === recipes.length}
                                    onCheckedChange={(c) => handleSelectAll(!!c)}
                                />
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSort('image')}>الصورة</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSort('name')}>
                                اسم الوصفة {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSort('user')}>المستخدم</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSort('status')}>
                                الحالة {sortColumn === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSort('tags_count')}>
                                الوسوم {sortColumn === 'tags_count' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead>الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recipes.map((recipe) => (
                            <TableRow key={recipe.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.includes(recipe.id)}
                                        onCheckedChange={(c) => handleSelectOne(recipe.id, !!c)}
                                    />
                                </TableCell>
                                <TableCell>
                                    {recipe.image_url ? (
                                        <img src={recipe.image_url} alt={recipe.name} className="w-10 h-10 rounded object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">🍽️</div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Link href={`/recipes/${recipe.slug}`} className="font-medium hover:underline" target="_blank">
                                        {recipe.name}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {recipe.user ? (
                                        <Link href={`/users/${recipe.user.id}`} className="flex items-center gap-2 hover:underline" target="_blank">
                                            {recipe.user.avatar ?
                                                <img src={recipe.user.avatar} className="w-6 h-6 rounded-full" /> :
                                                <div className="w-6 h-6 rounded-full bg-gray-300" />
                                            }
                                            <span className="text-sm">{recipe.user.name}</span>
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-300" />
                                            <span className="text-sm text-muted-foreground">مجهول</span>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                                                <StatusBadge status={recipe.status} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>تغيير الحالة</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup value={recipe.status} onValueChange={(v) => handleSingleStatusChange(recipe, v)}>
                                                <DropdownMenuRadioItem value="approved">منشورة</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="pending">بانتظار الموافقة</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="unpublished">غير منشورة</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="rejected">مرفوضة</DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell>
                                    {/* Tags Placeholder - Searchable dropdown logic would go here, simplified for now */}
                                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                                        {recipe.tags?.length || 0} وسوم
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/recipes/${recipe.slug}/edit`} target="_blank" className="cursor-pointer">
                                                    <Edit className="h-4 w-4" /> تعديل
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleSingleStatusChange(recipe, recipe.status === 'approved' ? 'unpublished' : 'approved')}>
                                                {recipe.status === 'approved' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                {recipe.status === 'approved' ? 'إلغاء النشر' : 'نشر'}
                                            </DropdownMenuItem>
                                            {isAdmin && (
                                                <DropdownMenuItem onClick={() => handleDelete(recipe)} className="text-red-600 focus:text-red-600">
                                                    <Trash className="h-4 w-4" /> حذف
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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

            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>رفض الوصفة</DialogTitle>
                        <DialogDescription>يرجى ذكر سبب الرفض</DialogDescription>
                    </DialogHeader>
                    <Textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="سبب الرفض..."
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>إلغاء</Button>
                        <Button variant="destructive" onClick={handleReject}>تأكيد الرفض</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
