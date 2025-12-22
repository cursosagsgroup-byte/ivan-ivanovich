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
    title: "Ivan Ivanovich - Academia de Protección Ejecutiva",
    description: "Academia de Protección Ejecutiva reconocida entre las 9 mejores del mundo",
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
                            <Toaster position="bottom-right" />
                        </CartProvider>
                    </LanguageProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
