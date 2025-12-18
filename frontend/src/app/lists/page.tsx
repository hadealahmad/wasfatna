import { cookies } from 'next/headers';
import { api } from '@/lib/api';
import { ListCard } from '@/components/features/lists/ListCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface List {
    id: number;
    name: string;
    slug: string | null;
    description: string | null;
    cover_image: string | null;
    is_default: boolean;
    is_public: boolean;
    status: string;
    recipes_count: number;
}

interface PublicListsResponse {
    data: List[];
    current_page: number;
    last_page: number;
    total: number;
}

async function getPublicLists() {
    try {
        const response = await api.lists.getPublicLists() as PublicListsResponse;
        return response;
    } catch {
        return { data: [], current_page: 1, last_page: 1, total: 0 };
    }
}


export const metadata = {
    title: 'القوائم العامة',
    description: 'استكشف قوائم الوصفات التي أنشأها مجتمعنا.'
};

export default async function PublicListsPage() {
    const response = await getPublicLists();
    const lists = response.data;
    const isEmpty = lists.length === 0;

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-8">قوائم الوصفات العامة</h1>

            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 border-2 border-dashed rounded-3xl bg-muted/20">
                    <div className="bg-red-100 p-4 rounded-full">
                        <Heart className="w-12 h-12 text-red-500 fill-red-500" />
                    </div>
                    <div className="max-w-md space-y-2">
                        <h2 className="text-2xl font-bold">لا توجد قوائم عامة بعد</h2>
                        <p className="text-muted-foreground">
                            كن أول من يشارك قوائمه! تصفح الوصفات، اضغط على زر القلب ❤️، وأنشئ قائمة جديدة لمشاركتها مع الجميع.
                        </p>
                    </div>
                    <Button asChild size="lg" className="rounded-full">
                        <Link href="/">
                            تصفح الوصفات
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Render lists here when data is available */}
                    {lists.map((list) => (
                        <ListCard key={list.id} list={list} href={`/lists/${list.id}`} />
                    ))}
                </div>
            )}
        </div>
    );
}
