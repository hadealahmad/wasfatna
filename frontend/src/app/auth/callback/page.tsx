'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { User } from '@/types';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = searchParams.get('token');
        const userJson = searchParams.get('user');
        const code = searchParams.get('code');

        const handleSuccess = (token: string, user: User) => {
            login(token, user);

            // Check for redirect url in local storage
            const redirectUrl = localStorage.getItem('login_redirect');
            if (redirectUrl) {
                localStorage.removeItem('login_redirect');
                router.push(redirectUrl);
            } else {
                router.push('/');
            }
        };

        if (token && userJson) {
            try {
                const user = JSON.parse(userJson);
                handleSuccess(token, user);
                return;
            } catch (err) {
                console.error('Failed to parse user data:', err);
            }
        }

        if (code) {
            const authenticate = async () => {
                try {
                    const response = await api.auth.callback(code) as { user: User; token: string };
                    handleSuccess(response.token, response.user);
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'فشل في تسجيل الدخول');
                }
            };
            authenticate();
        } else if (!token) {
            setError('رمز التفويض غير موجود');
        }
    }, [searchParams, login, router]);

    if (error) {
        return (
            <div className="container mx-auto py-16 text-center">
                <div className="text-6xl mb-4">❌</div>
                <h1 className="text-2xl font-bold mb-2 text-red-600">خطأ في تسجيل الدخول</h1>
                <p className="text-muted-foreground mb-4">{error}</p>
                <a href="/" className="text-primary hover:underline">العودة للرئيسية</a>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-16 text-center">
            <div className="animate-spin text-6xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold">جاري تسجيل الدخول...</h1>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto py-16 text-center">
                <div className="animate-spin text-6xl mb-4">⏳</div>
                <h1 className="text-2xl font-bold">جاري التحميل...</h1>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
