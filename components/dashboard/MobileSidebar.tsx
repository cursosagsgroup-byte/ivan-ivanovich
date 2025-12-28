'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Users, Settings, LogOut, GraduationCap, UserCircle, Ticket, CreditCard, Smartphone, X, ShoppingBag } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

const adminNavigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Courses', href: '/admin/courses', icon: BookOpen },
    { name: 'Students', href: '/admin/students', icon: Users },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
    { name: 'Blog', href: '/admin/blog', icon: BookOpen },
    { name: 'Base de Datos', href: '/admin/database', icon: Users },
    { name: 'Pedidos', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Pagos', href: '/admin/payments', icon: CreditCard },
    { name: 'Marketing', href: '/admin/marketing', icon: Users },
    { name: 'Bot WhatsApp', href: '/admin/whatsapp_bot', icon: Smartphone },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

const studentNavigation = [
    { name: 'Mi Cuenta', href: '/mi-cuenta', icon: UserCircle },
];

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const isStudent = session?.user?.role === 'STUDENT';

    const navigation = isStudent ? studentNavigation : adminNavigation;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex sm:hidden">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Sidebar Panel */}
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4 transition-transform duration-300 ease-in-out transform translate-x-0">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={onClose}
                    >
                        <span className="sr-only">Close sidebar</span>
                        <X className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex flex-shrink-0 items-center px-4">
                    {/* Reusing the logo or title style from Sidebar.tsx */}
                    <h1 className="text-2xl font-bold text-primary">Keting Media</h1>
                </div>

                <div className="mt-5 h-0 flex-1 overflow-y-auto">
                    <nav className="space-y-1 px-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`group flex items-center rounded-md px-2 py-2 text-base font-medium ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <item.icon
                                        className={`mr-4 h-6 w-6 flex-shrink-0 ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-500'
                                            }`}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="border-t border-border p-4">
                    <div className="mb-4 px-2">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">{session?.user?.name || 'User'}</p>
                        <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="group flex w-full items-center rounded-md px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                        <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );
}
