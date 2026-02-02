import LandingNavbar from '@/components/landing/LandingNavbar';
import PublicFooter from '@/components/public/PublicFooter';

export default function LandingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <LandingNavbar />
            <main className="flex-1">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
}
