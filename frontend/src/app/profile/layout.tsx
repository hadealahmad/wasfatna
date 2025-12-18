import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'الملف الشخصي',
    description: 'إدارة حسابك الشخصي وإعداداتك في موقع وصفاتنا.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
