'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Loader2, Edit, EyeOff, Send } from 'lucide-react';

interface RecipeControlsProps {
    recipeId: number;
    recipeSlug: string;
    ownerId?: number;
    status?: string;
    className?: string;
}

export function RecipeControls({ recipeId, recipeSlug, ownerId, status, className = '' }: RecipeControlsProps) {
    const { canModerate, user, token } = useAuth();
    const router = useRouter();
    const [isPublishing, setIsPublishing] = useState(false);
    const [isUnpublishing, setIsUnpublishing] = useState(false);

    // Check if user is owner or admin/moderator
    const isOwner = user?.id === ownerId;
    const canUnpublish = (isOwner || canModerate) && status === 'approved';
    const canPublish = canModerate && status !== 'approved';

    if (!canUnpublish && !canPublish && !isOwner) { // Show edit button for owner even if pending
        return null;
    }

    const handleUnpublish = async () => {
        if (!token || !confirm('هل أنت متأكد أنك تريد إلغاء نشر هذا الوصفة؟')) {
            return;
        }

        setIsUnpublishing(true);
        try {
            if (canModerate && !isOwner) {
                await api.admin.unpublishRecipe(token, recipeId);
            } else {
                await api.recipes.unpublish(token, recipeId);
            }

            router.push('/my-recipes');
            router.refresh();
        } catch (error) {
            console.error('Failed to unpublish recipe:', error);
            alert('حدث خطأ أثناء إلغاء النشر');
        } finally {
            setIsUnpublishing(false);
        }
    };

    const handlePublish = async () => {
        if (!token || !confirm('هل أنت متأكد أنك تريد نشر هذه الوصفة؟')) {
            return;
        }

        setIsPublishing(true);
        try {
            await api.admin.approveRecipe(token, recipeId);
            router.refresh();
        } catch (error) {
            console.error('Failed to publish recipe:', error);
            alert('حدث خطأ أثناء نشر الوصفة');
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className={`flex gap-2 ${className}`}>
            <Link href={`/recipes/${recipeSlug}/edit`}>
                <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="w-4 h-4" />
                    تعديل
                </Button>
            </Link>

            {canPublish && (
                <Button
                    variant="default" // Primary color for publish
                    size="sm"
                    className="gap-2"
                    onClick={handlePublish}
                    disabled={isPublishing}
                >
                    {isPublishing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4" />
                    )}
                    نشر الوصفة
                </Button>
            )}

            {canUnpublish && (
                <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={handleUnpublish}
                    disabled={isUnpublishing}
                >
                    {isUnpublishing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <EyeOff className="w-4 h-4" />
                    )}
                    إلغاء النشر
                </Button>
            )}
        </div>
    );
}
