import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export default function StudentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-900">
            <PublicNavbar />
            <main className="flex-1 pt-24 pb-12">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
}
