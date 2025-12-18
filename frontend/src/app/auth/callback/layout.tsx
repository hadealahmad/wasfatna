import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'تسجيل الدخول',
    description: 'جاري تسجيل الدخول إلى موقع وصفاتنا.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function AuthCallbackLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
