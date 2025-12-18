'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Pagination } from '@/types';
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
import { toast } from 'sonner';
import { MoreHorizontal, Trash, Edit, Plus } from 'lucide-react';

interface Tag {
    id: number;
    name: string;
    recipes_count: number;
}

interface UnifiedTagTableProps {
    tags: Tag[];
    onUpdate: () => void;
    pagination: Pagination;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    loading: boolean;
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
    onSort: (column: string) => void;
}

export function UnifiedTagTable({
    tags,
    onUpdate,
    pagination,
    onPageChange,
    onPerPageChange,
    loading,
    sortColumn,
    sortDirection,
    onSort
}: UnifiedTagTableProps) {
    const { token } = useAuth();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [name, setName] = useState('');

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(tags.map(t => t.id));
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
        setSelectedTag(null);
    };

    const handleOpenCreate = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (tag: Tag) => {
        setSelectedTag(tag);
        setName(tag.name);
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!token || !name.trim()) return;
        setIsLoading(true);
        try {
            if (selectedTag) {
                await api.admin.updateTag(token, selectedTag.id, name);
                toast.success('تم تحديث الوسم');
            } else {
                await api.admin.createTag(token, name);
                toast.success('تم إنشاء الوسم');
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
        if (!confirm(`هل أنت متأكد من حذف ${selectedIds.length} شارة؟ سيتم إزالتها من الوصفات المرتبطة.`)) return;

        setIsLoading(true);
        try {
            await api.admin.bulkTagActions(token, selectedIds);
            toast.success('تم حذف الوسوم');
            setSelectedIds([]);
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || 'فشل الحذف الجماعي');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSingle = async (tag: Tag) => {
        if (!token) return;
        if (!confirm(`هل أنت متأكد من حذف ${tag.name}؟ سيتم إزالته من الوصفات المرتبطة.`)) return;

        setIsLoading(true);
        try {
            await api.admin.deleteTag(token, tag.id);
            toast.success('تم حذف الوسم');
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
                    <Plus className="w-4 h-4 mr-1" /> إضافة وسم
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={tags.length > 0 && selectedIds.length === tags.length}
                                    onCheckedChange={(c) => handleSelectAll(!!c)}
                                />
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSort('name')}>
                                الاسم {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSort('recipes_count')}>
                                عدد الوصفات {sortColumn === 'recipes_count' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead>الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tags.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    لا توجد وسوم
                                </TableCell>
                            </TableRow>
                        ) : (
                            tags.map((tag) => (
                                <TableRow key={tag.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(tag.id)}
                                            onCheckedChange={(c) => handleSelectOne(tag.id, !!c)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {tag.name}
                                    </TableCell>
                                    <TableCell>
                                        {tag.recipes_count}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenEdit(tag)}>
                                                    <Edit className="h-4 w-4" /> تعديل
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteSingle(tag)} className="text-red-600">
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedTag ? 'تعديل وسم' : 'إضافة وسم جديد'}</DialogTitle>
                        <DialogDescription>
                            {selectedTag ? 'تعديل اسم الوسم' : 'ادخل اسم الوسم الجديد'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">اسم الوسم</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="مثال: نباتي"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            إلغاء
                        </Button>
                        <Button onClick={handleSubmit} disabled={!name.trim() || isLoading}>
                            {selectedTag ? 'حفظ التعديلات' : 'إنشاء'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
