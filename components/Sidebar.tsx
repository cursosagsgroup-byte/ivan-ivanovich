'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Users, Settings, LogOut, GraduationCap, UserCircle, Ticket, CreditCard, Smartphone, ShoppingBag } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const adminNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Courses', href: '/admin/courses', icon: BookOpen },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
  { name: 'Blog', href: '/admin/blog', icon: BookOpen }, // Using BookOpen for now, or maybe FileText if available
  { name: 'Base de Datos', href: '/admin/database', icon: Users },
  { name: 'Pedidos', href: '/dashboard/orders', icon: ShoppingBag },
  { name: 'Pagos', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Marketing', href: '/marketing', icon: Users },
  { name: 'Bot WhatsApp', href: '/whatsapp_bot', icon: Smartphone },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const studentNavigation = [
  { name: 'Mi Cuenta', href: '/dashboard', icon: UserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isStudent = session?.user?.role === 'STUDENT';

  const navigation = isStudent ? studentNavigation : adminNavigation;

  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r border-border bg-white text-slate-900">
      <div className="flex h-16 items-center justify-center border-b border-border px-6">
        <h1 className="text-2xl font-bold text-primary">Keting Media</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                ? 'bg-primary/10 text-primary'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-500'
                  }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <div className="mb-4 px-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Signed in as</p>
          <p className="text-sm font-semibold text-slate-900 truncate">{session?.user?.name || 'User'}</p>
          <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        >
          <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" />
          Sign out
        </button>
      </div>
    </div>
  );
}
