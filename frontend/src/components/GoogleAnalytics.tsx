'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, Suspense } from 'react';

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
    }
}

export function GoogleAnalytics({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
    return (
        <Suspense fallback={null}>
            <GoogleAnalyticsInner GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
        </Suspense>
    );
}

function GoogleAnalyticsInner({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

        // Add a small delay to ensure document.title is updated by Next.js
        const timeoutId = setTimeout(() => {
            if (typeof window.gtag !== 'undefined') {
                window.gtag('config', GA_MEASUREMENT_ID, {
                    page_path: url,
                    page_location: window.location.href,
                    page_title: document.title
                });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [pathname, searchParams, GA_MEASUREMENT_ID]);

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `,
                }}
            />
        </>
    );
}
