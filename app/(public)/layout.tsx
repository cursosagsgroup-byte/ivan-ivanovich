import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import FloatingLanguageSwitcher from '@/components/FloatingLanguageSwitcher';
import StickyCartTab from '@/components/cart/StickyCartTab';

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="bg-slate-900 min-h-screen flex flex-col">
            <PublicNavbar />
            <FloatingLanguageSwitcher />
            <StickyCartTab />
            <main className="flex-1">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
}
