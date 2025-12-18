import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'تعديل الوصفة',
    description: 'تعديل تفاصيل الوصفة - المكونات وطريقة التحضير والصورة.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function EditRecipeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
