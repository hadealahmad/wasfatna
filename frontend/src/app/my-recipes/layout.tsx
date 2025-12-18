import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'وصفاتي',
    description: 'إدارة وعرض جميع الوصفات التي أضفتها. تعديل وحذف ومتابعة حالة الموافقة على وصفاتك.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function MyRecipesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
