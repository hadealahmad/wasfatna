'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AddRecipeButtonProps {
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    showIcon?: boolean;
    children?: React.ReactNode;
}

export function AddRecipeButton({
    className = '',
    variant = 'default',
    size = 'default',
    showIcon = true,
    children
}: AddRecipeButtonProps) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const handleClick = async () => {
        if (isAuthenticated) {
            router.push('/recipes/new');
        } else {
            // Save redirect intent
            localStorage.setItem('login_redirect', '/recipes/new');

            // Start Google Login
            try {
                const response = await api.auth.getGoogleUrl() as { url: string };
                window.location.href = response.url;
            } catch (error) {
                console.error("Login failed:", error);
            }
        }
    };

    if (isAuthenticated) {
        return (
            <Link href="/recipes/new">
                <Button variant={variant} size={size} className={className}>
                    {showIcon && <PlusCircle className="ml-2 h-4 w-4" />}
                    {children || 'أضف وصفة'}
                </Button>
            </Link>
        );
    }

    return (
        <Button variant={variant} size={size} className={className} onClick={handleClick}>
            {showIcon && <PlusCircle className="ml-2 h-4 w-4" />}
            {children || 'أضف وصفة'}
        </Button>
    );
}
