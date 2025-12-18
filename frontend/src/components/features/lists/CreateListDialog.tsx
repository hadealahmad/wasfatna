'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

interface CreateListDialogProps {
    onSuccess?: (list: any) => void;
    trigger?: React.ReactNode;
}

export function CreateListDialog({ onSuccess, trigger }: CreateListDialogProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setLoading(true);
        try {
            const list = await api.lists.create(token, {
                name,
                description,
                is_public: false
            });
            toast.success('تم إنشاء القائمة بنجاح');
            setOpen(false);
            setName('');
            setDescription('');
            if (onSuccess) onSuccess(list);
        } catch (error) {
            toast.error('فشل في إنشاء القائمة');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        قائمة جديدة
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" dir="rtl">
                <DialogHeader>
                    <DialogTitle>إنشاء قائمة جديدة</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">اسم القائمة</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="مثال: وصفات الفطور"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">وصف (اختياري)</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="وصف مختصر للقائمة..."
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={loading || !name.trim()}>
                            {loading ? 'جاري الإنشاء...' : 'إنشاء'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
