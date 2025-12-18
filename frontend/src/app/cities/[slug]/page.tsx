export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { api } from '@/lib/api';
import { CityRecipesResponse } from '@/types';
import { RecipeGrid } from '@/components/recipes/RecipeGrid';
import { MapPin } from 'lucide-react';

interface CityPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
    const { slug } = await params;
    try {
        const data = await api.cities.getRecipes(slug) as CityRecipesResponse;
        const { city, pagination } = data;

        const title = `وصفات ${city.name}`;
        const description = city.description
            ? city.description
            : `اكتشف ${pagination.total} وصفة من ${city.name}. أشهى الأطباق والوصفات التقليدية والمحلية.`;
        const ogImage = city.image_url || '/og-image.png';

        return {
            title,
            description,
            openGraph: {
                title: `${title} | وصفاتنا`,
                description,
                type: 'website',
                url: `/cities/${slug}`,
                images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
            },
            twitter: {
                card: 'summary_large_image',
                title: `${title} | وصفاتنا`,
                description,
                images: [ogImage],
            },
        };
    } catch {
        return {
            title: 'مدينة غير موجودة',
            description: 'المدينة التي تبحث عنها غير موجودة',
        };
    }
}

async function getCityRecipes(slug: string) {
    try {
        return await api.cities.getRecipes(slug) as CityRecipesResponse;
    } catch {
        return null;
    }
}

export default async function CityPage({ params }: CityPageProps) {
    const { slug } = await params;
    const data = await getCityRecipes(slug);

    if (!data) {
        notFound();
    }

    const { city, recipes, pagination } = data;

    return (
        <div>
            {/* Hero */}
            <section className="border-b bg-background py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6 text-primary">
                        <MapPin className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                        وصفات {city.name}
                    </h1>
                    {city.description && (
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mb-4">
                            {city.description}
                        </p>
                    )}
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                        {pagination.total} وصفة
                    </div>
                </div>
            </section>

            {/* Recipes */}
            <section className="container mx-auto py-12 px-4 md:px-6">
                <RecipeGrid
                    recipes={recipes}
                    emptyMessage={`لا توجد وصفات من ${city.name} بعد`}
                />
            </section>
        </div>
    );
}
