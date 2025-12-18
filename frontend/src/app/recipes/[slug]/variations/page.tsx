import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { api } from '@/lib/api';
import { VariationsResponse } from '@/types';
import { RecipeGrid } from '@/components/recipes/RecipeGrid';

interface VariationsPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: VariationsPageProps): Promise<Metadata> {
    const { slug } = await params;
    try {
        const data = await api.recipes.getVariations(slug) as VariationsResponse;

        const title = `طرق تحضير ${data.dish_name}`;
        const description = `اكتشف ${data.recipes.length} طريقة مختلفة لتحضير ${data.dish_name}. قارن بين الوصفات واختر الأنسب لك.`;

        return {
            title,
            description,
            openGraph: {
                title: `${title} | وصفاتنا`,
                description,
                type: 'website',
                url: `/recipes/${slug}/variations`,
                images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }],
            },
            twitter: {
                card: 'summary_large_image',
                title: `${title} | وصفاتنا`,
                description,
                images: ['/og-image.png'],
            },
        };
    } catch {
        return {
            title: 'طرق التحضير',
            description: 'استعراض طرق مختلفة لتحضير هذا الطبق',
        };
    }
}

async function getVariations(slug: string, token?: string) {
    try {
        return await api.recipes.getVariations(slug, token) as VariationsResponse;
    } catch {
        return null;
    }
}

export default async function VariationsPage({ params }: VariationsPageProps) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const data = await getVariations(slug, token);

    if (!data) {
        notFound();
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    طرق تحضير: {data.dish_name}
                </h1>
                <p className="text-muted-foreground">
                    عثرنا على {data.recipes.length} طريقة مختلفة لتحضير هذا الطبق
                </p>
            </div>

            <RecipeGrid recipes={data.recipes} />
        </div>
    );
}
