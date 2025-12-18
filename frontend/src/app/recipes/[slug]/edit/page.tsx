import { api } from '@/lib/api';
import { CitiesResponse, RecipeDetailResponse } from '@/types';
import { RecipeForm } from '@/components/recipes/RecipeForm';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ slug: string }>;
}

import { cookies } from 'next/headers';

async function getData(slug: string, token?: string) {
    try {
        const [recipeResponse, citiesResponse] = await Promise.all([
            api.recipes.get(slug, token) as Promise<RecipeDetailResponse>,
            api.cities.list() as Promise<CitiesResponse>
        ]);
        return {
            recipe: recipeResponse.recipe,
            cities: citiesResponse.cities
        };
    } catch (error) {
        return null;
    }
}

export default async function EditRecipePage({ params }: PageProps) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const data = await getData(slug, token);

    if (!data) {
        notFound();
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-8">تعديل الوصفة: {data.recipe.name}</h1>
            <RecipeForm cities={data.cities} initialData={data.recipe} />
        </div>
    );
}
