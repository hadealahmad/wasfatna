import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'البحث في الوصفات',
    description: 'ابحث عن وصفاتك المفضلة بحسب المكونات أو المدينة أو مستوى الصعوبة. آلاف الوصفات السورية في متناول يدك.',
    openGraph: {
        title: 'البحث في الوصفات | وصفاتنا',
        description: 'ابحث عن وصفاتك المفضلة بحسب المكونات أو المدينة أو مستوى الصعوبة.',
        type: 'website',
        url: '/search',
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'البحث في وصفاتنا' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'البحث في الوصفات | وصفاتنا',
        description: 'ابحث عن وصفاتك المفضلة بحسب المكونات أو المدينة أو مستوى الصعوبة.',
        images: ['/og-image.png'],
    },
};

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
