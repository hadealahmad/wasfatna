import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { api } from '@/lib/api';
import { RecipeCard as RecipeCardType } from '@/types';
import { Badge } from '@/components/ui/badge';
import { RecipeGrid } from '@/components/recipes/RecipeGrid';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Share2, Lock, Globe } from 'lucide-react';
import { ListActions } from '@/components/features/lists/ListActions'; // Will create this for Edit/Publish
import { ReportModal } from '@/components/reports/ReportModal';

interface ListPageProps {
    params: Promise<{ id: string }>;
}

interface User {
    id: number;
    name: string;
    avatar?: string;
}

interface ListDetail {
    id: number;
    user_id: number;
    name: string;
    slug: string | null;
    description: string | null;
    cover_image: string | null;
    is_default: boolean;
    is_public: boolean;
    status: string;
    created_at: string;
    user: User;
    recipes: RecipeCardType[];
}

export async function generateMetadata({ params }: ListPageProps): Promise<Metadata> {
    const { id } = await params;
    try {
        const data = await api.lists.get(id) as ListDetail;
        return {
            title: data.name,
            description: data.description || `قائمة وصفات ${data.name} بواسطة ${data.user.name}`,
            openGraph: {
                title: data.name,
                description: data.description || undefined,
                images: data.cover_image ? [data.cover_image] : undefined,
            },
        };
    } catch {
        return {
            title: 'القائمة غير موجودة',
        };
    }
}

async function getList(id: string) {
    let token: string | undefined;
    try {
        const cookieStore = await cookies();
        token = cookieStore.get('auth_token')?.value;
    } catch {
        // Ignore
    }

    try {
        return await api.lists.get(id, token) as ListDetail;
    } catch (e: any) {
        if (e.status === 404) return null;
        if (e.status === 403) return 'unauthorized';
        return null; // Handle others as not found for now
    }
}

export default async function ListPage({ params }: ListPageProps) {
    const { id } = await params;
    const list = await getList(id);

    if (list === 'unauthorized') {
        return (
            <div className="container mx-auto py-16 text-center px-4 md:px-6">
                <span className="text-6xl mb-4 block">🔒</span>
                <h1 className="text-2xl font-bold mb-2">قائمة خاصة</h1>
                <p className="text-muted-foreground">هذه القائمة خاصة ولا يمكنك عرضها.</p>
            </div>
        );
    }

    if (!list || typeof list === 'string') {
        notFound();
    }

    // Determine if current user is owner (done via client component usually, but we can verify ownership logic via ID match if we had user ID)
    // But for SSR, we might just pass data to client component `ListActions` which checks token/user.

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            {/* Header */}
            <div className="mb-8 p-6 bg-muted/30 rounded-2xl border border-border/50">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* Cover Image */}
                    <div className="relative w-full md:w-32 h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                        {list.cover_image ? (
                            <Image
                                src={list.cover_image}
                                alt={list.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">
                                📋
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">{list.name}</h1>
                            {list.is_public ? (
                                <Badge variant="secondary" className="gap-1">
                                    <Globe className="w-3 h-3" />
                                    عامة
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="gap-1">
                                    <Lock className="w-3 h-3" />
                                    خاصة
                                </Badge>
                            )}
                        </div>
                        {list.description && (
                            <p className="text-muted-foreground max-w-2xl">{list.description}</p>
                        )}

                        <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
                            <span>بواسطة</span>
                            <div className="flex items-center gap-1 font-medium text-foreground">
                                <Avatar className="w-5 h-5">
                                    <AvatarImage src={list.user.avatar} />
                                    <AvatarFallback>{list.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{list.user.name}</span>
                            </div>
                            <span>•</span>
                            <span>{list.recipes.length} وصفة</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {list.is_public && (
                            <Button variant="outline" size="icon">
                                <Share2 className="w-4 h-4" />
                            </Button>
                        )}
                        <ListActions list={list} />
                        <ReportModal reportableId={list.id} reportableType="list" />
                    </div>
                </div>
            </div>

            {/* Recipes Grid */}
            <RecipeGrid
                recipes={list.recipes}
                emptyMessage="هذه القائمة فارغة."
            />
        </div>
    );
}
