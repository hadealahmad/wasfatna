import type { Metadata } from "next";
import Script from "next/script";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-arabic",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://food.syrian.zone'),
  title: {
    default: "وصفاتنا - مجتمع الطبخ السوري",
    template: "%s | وصفاتنا",
  },
  description: "اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق. شارك وصفاتك واستمتع بتجربة طهي فريدة مع مجتمعنا.",
  keywords: ["وصفات سورية", "طبخ سوري", "أكلات سورية", "مطبخ سوري", "طعام عربي", "وصفات عربية", "حلويات سورية", "مقبلات سورية"],
  authors: [{ name: "وصفاتنا" }],
  creator: "وصفاتنا",
  publisher: "وصفاتنا",
  openGraph: {
    type: 'website',
    locale: 'ar_SY',
    url: 'https://food.syrian.zone',
    siteName: 'وصفاتنا',
    title: 'وصفاتنا - مجتمع الطبخ السوري',
    description: 'اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق. شارك وصفاتك واستمتع بتجربة طهي فريدة مع مجتمعنا.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'وصفاتنا - مجتمع الطبخ السوري',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'وصفاتنا - مجتمع الطبخ السوري',
    description: 'اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق. شارك وصفاتك واستمتع بتجربة طهي فريدة مع مجتمعنا.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${ibmPlexArabic.variable} font-sans antialiased min-h-screen bg-background flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <GoogleAnalytics GA_MEASUREMENT_ID="G-JKT27FY67J" />
            <Header />
            <main className="flex-1 w-full">
              {children}
            </main>
            <footer className="border-t py-8 bg-muted/20">
              <div className="container mx-auto text-center text-sm text-muted-foreground">
                <p className="mb-2">
                  © 2024 وصفاتنا. جميع الحقوق محفوظة. | تم التطوير بواسطة{" "}
                  <a
                    href="https://hadealahmad.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    هادي الأحمد
                  </a>
                </p>
                <div className="flex justify-center gap-4">
                  <a href="/privacy" className="hover:text-primary transition-colors">
                    سياسة الخصوصية
                  </a>
                  <span>|</span>
                  <a href="/terms" className="hover:text-primary transition-colors">
                    الشروط والأحكام
                  </a>
                </div>
              </div>
            </footer>
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

