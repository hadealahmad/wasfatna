import { Metadata } from 'next';
import { api } from '@/lib/api';
import { CitiesResponse } from '@/types';
import { RecipeForm } from '@/components/recipes/RecipeForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'إضافة وصفة جديدة',
    description: 'شارك وصفتك المميزة مع مجتمع وصفاتنا. أضف المكونات وطريقة التحضير وصورة شهية لوصفتك.',
    openGraph: {
        title: 'إضافة وصفة جديدة | وصفاتنا',
        description: 'شارك وصفتك المميزة مع مجتمع وصفاتنا.',
        type: 'website',
        url: '/recipes/new',
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'أضف وصفة جديدة' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'إضافة وصفة جديدة | وصفاتنا',
        description: 'شارك وصفتك المميزة مع مجتمع وصفاتنا.',
        images: ['/og-image.png'],
    },
};

async function getCities() {
    try {
        return await api.cities.list() as CitiesResponse;
    } catch {
        return { cities: [] };
    }
}

export default async function NewRecipePage() {
    const { cities } = await getCities();

    return (
        <div className="container mx-auto py-8 max-w-4xl px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-8">إضافة وصفة جديدة</h1>
            <RecipeForm cities={cities} />
        </div>
    );
}
