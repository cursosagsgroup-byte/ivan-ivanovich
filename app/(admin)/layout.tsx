import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebarShell from "@/components/admin/AdminSidebarShell";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);

    // Strict Server-Side Validation using database role
    // This runs on the server before ANY UI is sent to the client
    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login');
    }

    return (
        <AdminSidebarShell>
            {children}
        </AdminSidebarShell>
    );
}
