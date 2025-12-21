import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="bg-slate-900 min-h-screen flex flex-col">
            <PublicNavbar />
            <main className="flex-1">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
}
