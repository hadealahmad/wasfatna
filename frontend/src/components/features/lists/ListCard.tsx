import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Globe, Image as ImageIcon } from 'lucide-react';

interface ListCardProps {
    list: {
        id: number;
        name: string;
        slug: string | null;
        description: string | null;
        cover_image: string | null;
        is_default: boolean;
        is_public: boolean;
        status: string;
        recipes_count: number;
    };
    href: string;
}

export function ListCard({ list, href }: ListCardProps) {
    return (
        <Link href={href}>
            <Card className="h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="aspect-video relative bg-slate-100 flex items-center justify-center overflow-hidden">
                    {list.cover_image ? (
                        <img
                            src={list.cover_image}
                            alt={list.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <ImageIcon className="text-slate-300 h-10 w-10" />
                    )}
                    {list.is_public ? (
                        <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white">
                            <Globe className="h-3 w-3" />
                        </div>
                    ) : (
                        <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white">
                            <Lock className="h-3 w-3" />
                        </div>
                    )}
                </div>
                <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-1">{list.name}</CardTitle>
                        {list.is_default && <Badge variant="secondary" className="text-xs">افتراضي</Badge>}
                    </div>
                </CardHeader>
                <CardContent className="p-4 py-2 text-sm text-gray-500 min-h-[40px]">
                    <p className="line-clamp-2">{list.description || 'لا يوجد وصف'}</p>
                </CardContent>
                <CardFooter className="p-4 pt-2 text-xs text-gray-400 flex justify-between">
                    <span>{list.recipes_count} وصفة</span>
                    <span>
                        {list.status === 'review' && <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">قيد المراجعة</Badge>}
                        {list.status === 'rejected' && <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">مرفوض</Badge>}
                    </span>
                </CardFooter>
            </Card>
        </Link>
    );
}
