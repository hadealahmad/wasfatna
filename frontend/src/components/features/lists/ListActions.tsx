'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Share, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface List {
    id: number;
    user_id: number;
    name: string;
    description: string | null;
    cover_image: string | null;
    is_default: boolean;
    is_public: boolean;
    status: string;
    recipes_count?: number; // might not be here in detail view
    recipes: any[];
}

export function ListActions({ list }: { list: List }) {
    const { user, token } = useAuth();
    const router = useRouter();

    // Dialog States
    const [editOpen, setEditOpen] = useState(false);
    const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
    const [unpublishConfirmOpen, setUnpublishConfirmOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Edit Form State
    const [name, setName] = useState(list.name);
    const [description, setDescription] = useState(list.description || '');
    const [coverImage, setCoverImage] = useState<File | null>(null);

    // If not owner, don't show actions at all
    if (!user || user.id !== list.user_id) {
        return null;
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        if (description) formData.append('description', description);
        if (coverImage) formData.append('cover_image', coverImage);

        try {
            await api.lists.update(token, list.id, formData);
            toast.success('تم تحديث القائمة');
            setEditOpen(false);
            router.refresh();
        } catch (error) {
            toast.error('فشل تحديث القائمة');
        } finally {
            setLoading(false);
        }
    };

    const handlePublishRequest = async () => {
        if (!token) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('request_publish', '1');

        try {
            await api.lists.update(token, list.id, formData);
            toast.success('تم إرسال طلب النشر للمراجعة');
            setPublishConfirmOpen(false);
            router.refresh();
        } catch (error: any) {
            const msg = error?.data?.message || 'فشل طلب النشر';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        // Use window location but ensure we act only on client
        if (typeof window !== 'undefined') {
            const url = `${window.location.protocol}//${window.location.host}/lists/${list.id}`;
            navigator.clipboard.writeText(url);
            toast.success('تم نسخ رابط القائمة');
        }
    };

    const handleUnpublish = async () => {
        if (!token) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('is_public', '0');

        try {
            await api.lists.update(token, list.id, formData);
            toast.success('تم إلغاء نشر القائمة');
            setUnpublishConfirmOpen(false);
            router.refresh();
        } catch (error) {
            toast.error('فشل إلغاء النشر');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!token) return;
        setLoading(true);
        try {
            await api.lists.delete(token, list.id);
            toast.success('تم حذف القائمة');
            router.push('/my-lists');
        } catch (error) {
            toast.error('فشل حذف القائمة');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Share Button */}
            <Button variant="outline" size="icon" onClick={handleShare} title="مشاركة">
                <Share className="w-4 h-4" />
            </Button>

            {/* Edit Button */}
            <Button variant="outline" className="gap-2" onClick={() => setEditOpen(true)}>
                <Edit className="w-4 h-4" />
                تعديل
            </Button>

            {/* Publish Button (for Drafts) */}
            {!list.is_default && !list.is_public && list.status === 'draft' && (
                <Button className="gap-2" onClick={() => setPublishConfirmOpen(true)}>
                    <Upload className="w-4 h-4" />
                    نشر
                </Button>
            )}

            {/* In Review Status */}
            {list.status === 'review' && (
                <Button variant="secondary" disabled className="gap-2 opacity-80">
                    <Upload className="w-4 h-4" />
                    قيد المراجعة
                </Button>
            )}

            {/* Unpublish Button for Approved/Public Lists */}
            {list.is_public && list.status === 'approved' && (
                <Button variant="secondary" className="gap-2 text-orange-600 hover:text-orange-700" onClick={() => setUnpublishConfirmOpen(true)}>
                    <Upload className="w-4 h-4 rotate-180" />
                    إلغاء النشر
                </Button>
            )}

            {/* Delete Button (Not for default lists) */}
            {!list.is_default && (
                <Button variant="destructive" className="gap-2" onClick={() => setDeleteConfirmOpen(true)}>
                    <Trash2 className="w-4 h-4" />
                    حذف
                </Button>
            )}

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-md" dir="rtl">
                    <DialogHeader>
                        <DialogTitle>تعديل القائمة</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>اسم القائمة</Label>
                            <Input value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>الوصف</Label>
                            <Input value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>صورة الغلاف</Label>
                            <Input type="file" accept="image/*" onChange={e => setCoverImage(e.target.files?.[0] || null)} />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>إلغاء</Button>
                            <Button type="submit" disabled={loading}>حفظ</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Publish Confirm Dialog */}
            <Dialog open={publishConfirmOpen} onOpenChange={setPublishConfirmOpen}>
                <DialogContent className="sm:max-w-md" dir="rtl">
                    <DialogHeader>
                        <DialogTitle>نشر القائمة</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <p className="text-muted-foreground">
                            سيتم إرسال القائمة للمراجعة قبل نشرها للعامة. هل أنت متأكد؟
                            <br />
                            <span className="text-xs text-orange-500">تأكد من وجود صورة غلاف ووجود أكثر من وصفة.</span>
                        </p>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="ghost" onClick={() => setPublishConfirmOpen(false)}>إلغاء</Button>
                            <Button onClick={handlePublishRequest} disabled={loading}>تأكيد النشر</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Unpublish Confirm Dialog */}
            <Dialog open={unpublishConfirmOpen} onOpenChange={setUnpublishConfirmOpen}>
                <DialogContent className="sm:max-w-md" dir="rtl">
                    <DialogHeader>
                        <DialogTitle>إلغاء نشر القائمة</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <p className="text-muted-foreground">
                            ستصبح القائمة خاصة ولن تظهر للآخرين. يمكنك نشرها مرة أخرى لاحقاً.
                        </p>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="ghost" onClick={() => setUnpublishConfirmOpen(false)}>إلغاء</Button>
                            <Button onClick={handleUnpublish} disabled={loading}>تأكيد</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-md" dir="rtl">
                    <DialogHeader>
                        <DialogTitle>حذف القائمة</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <p className="text-muted-foreground">
                            هل أنت متأكد من رغبتك في حذف هذه القائمة؟ هذا الإجراء لا يمكن التراجع عنه.
                        </p>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)}>إلغاء</Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={loading}>حذف نهائي</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
