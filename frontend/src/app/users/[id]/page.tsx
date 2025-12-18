import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { api } from '@/lib/api';
import { UserRecipesResponse } from '@/types';
import { RecipeGrid } from '@/components/recipes/RecipeGrid';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: UserPageProps): Promise<Metadata> {
    const { id } = await params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
        return {
            title: 'مستخدم غير موجود',
            description: 'الصفحة التي تبحث عنها غير موجودة',
        };
    }

    try {
        const data = await api.users.getRecipes(userId) as UserRecipesResponse;
        const { user, pagination } = data;

        const title = `وصفات ${user.name}`;
        const description = `اكتشف ${pagination.total} وصفة شاركها ${user.name} مع مجتمع وصفاتنا.`;
        const ogImage = user.avatar || '/og-image.png';

        return {
            title,
            description,
            openGraph: {
                title: `${title} | وصفاتنا`,
                description,
                type: 'profile',
                url: `/users/${id}`,
                images: [{ url: ogImage, width: 400, height: 400, alt: user.name }],
            },
            twitter: {
                card: 'summary',
                title: `${title} | وصفاتنا`,
                description,
                images: [ogImage],
            },
        };
    } catch {
        return {
            title: 'مستخدم غير موجود',
            description: 'الصفحة التي تبحث عنها غير موجودة',
        };
    }
}

async function getUserRecipes(id: number) {
    try {
        return await api.users.getRecipes(id) as UserRecipesResponse;
    } catch {
        return null;
    }
}

export default async function UserPage({ params }: UserPageProps) {
    const { id } = await params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
        notFound();
    }

    const data = await getUserRecipes(userId);

    if (!data) {
        notFound();
    }

    const { user, recipes, pagination } = data;

    return (
        <div>
            {/* Profile Header */}
            <section className="border-b bg-background py-16">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col items-center text-center">
                        <Avatar className="w-24 h-24 border mb-4">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                                {user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{user.name}</h1>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                            {pagination.total} وصفة
                        </div>
                    </div>
                </div>
            </section>

            {/* User Recipes */}
            <section className="container mx-auto py-12 px-4 md:px-6">
                <h2 className="text-2xl font-bold mb-8">وصفات {user.name}</h2>
                <RecipeGrid
                    recipes={recipes}
                    emptyMessage="لم يضف هذا المستخدم وصفات بعد"
                />
            </section>
        </div>
    );
}
