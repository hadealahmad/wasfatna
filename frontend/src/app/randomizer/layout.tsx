import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'شو طابخين اليوم؟',
    description: 'محتار شو تطبخ اليوم؟ دوّر عجلة الحظ واترك القرار لنا! اختر وصفة عشوائية من مجموعة الوصفات السورية الشهية.',
    openGraph: {
        title: 'شو طابخين اليوم؟ | وصفاتنا',
        description: 'محتار شو تطبخ اليوم؟ دوّر عجلة الحظ واترك القرار لنا!',
        type: 'website',
        url: '/randomizer',
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'عجلة الوصفات العشوائية' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'شو طابخين اليوم؟ | وصفاتنا',
        description: 'محتار شو تطبخ اليوم؟ دوّر عجلة الحظ واترك القرار لنا!',
        images: ['/og-image.png'],
    },
};

export default function RandomizerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
