export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { api } from '@/lib/api';
import { CitiesResponse } from '@/types';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export const metadata: Metadata = {
    title: 'المدن والمناطق',
    description: 'استكشف المطبخ المحلي لكل مدينة سورية وتعرف على أشهر أطباقها. وصفات من دمشق وحلب وحمص واللاذقية وغيرها.',
    openGraph: {
        title: 'المدن والمناطق | وصفاتنا',
        description: 'استكشف المطبخ المحلي لكل مدينة سورية وتعرف على أشهر أطباقها.',
        type: 'website',
        url: '/cities',
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'المدن والمناطق السورية' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'المدن والمناطق | وصفاتنا',
        description: 'استكشف المطبخ المحلي لكل مدينة سورية وتعرف على أشهر أطباقها.',
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

export default async function CitiesPage() {
    const { cities } = await getCities();

    return (
        <div className="container mx-auto py-12 md:py-24 px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    المدن والمناطق
                </h1>
                <p className="text-muted-foreground text-lg max-w-[800px]">
                    استكشف المطبخ المحلي لكل مدينة وتعرف على أشهر أطباقها
                </p>
            </div>

            {cities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/20">
                    <MapPin className="w-16 h-16 mb-4 text-muted-foreground/30" />
                    <p className="text-xl font-medium text-muted-foreground">لا توجد مدن مسجلة بعد</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {cities.map((city) => (
                        <Link
                            key={city.id}
                            href={`/cities/${city.slug}`}
                            className="group flex flex-col items-center justify-center p-8 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50"
                        >
                            <div className="h-16 w-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                                <MapPin className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-semibold mb-2">{city.name}</h2>
                            <p className="text-sm text-muted-foreground">{city.recipes_count || 0} وصفة</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
