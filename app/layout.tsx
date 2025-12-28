import type { Metadata } from "next";
import { Montserrat, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import AuthProvider from "@/components/AuthProvider";
import { CartProvider } from '@/lib/cart-context';
import CartSlidePanel from '@/components/cart/CartSlidePanel';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { SpeedInsights } from "@vercel/speed-insights/next"

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-montserrat",
    display: 'swap',
});

const bebasNeue = Bebas_Neue({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-bebas",
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL('https://ivanivanovich.com'),
    title: {
        default: "Ivan Ivanovich - Academia de Protección Ejecutiva",
        template: "%s | Ivan Ivanovich"
    },
    description: "Academia de Protección Ejecutiva reconocida entre las 9 mejores del mundo. Cursos certificados de Team Leader y Contravigilancia con instructor de nivel internacional.",
    keywords: ["protección ejecutiva", "seguridad privada", "team leader", "contravigilancia", "curso protección ejecutiva", "academia seguridad", "ivan ivanovich", "executive protection"],
    authors: [{ name: "Ivan Ivanovich" }],
    creator: "Ivan Ivanovich",
    publisher: "Ivan Ivanovich Academia",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'es_ES',
        alternateLocale: ['en_US'],
        url: 'https://ivanivanovich.com',
        siteName: 'Ivan Ivanovich Academia',
        title: 'Ivan Ivanovich - Academia de Protección Ejecutiva',
        description: 'Academia de Protección Ejecutiva reconocida entre las 9 mejores del mundo',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Ivan Ivanovich Academia de Protección Ejecutiva',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ivan Ivanovich - Academia de Protección Ejecutiva',
        description: 'Academia de Protección Ejecutiva reconocida entre las 9 mejores del mundo',
        images: ['/og-image.jpg'],
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
    verification: {
        google: 'your-google-verification-code', // Add your actual code from Google Search Console
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    let locale = cookieStore.get('NEXT_LOCALE')?.value || 'es';

    // If user is logged in, use their language preference
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { language: true },
        });
        if (user?.language) {
            locale = user.language;
        }
    }

    return (
        <html lang={locale}>
            <body className={`${montserrat.variable} ${bebasNeue.variable} antialiased`}>
                <AuthProvider>
                    <LanguageProvider initialLanguage={locale}>
                        <CartProvider>
                            {children}
                            <CartSlidePanel />
                            <WhatsAppButton />
                            <SpeedInsights />
                            <Toaster position="bottom-right" />
                        </CartProvider>
                    </LanguageProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
