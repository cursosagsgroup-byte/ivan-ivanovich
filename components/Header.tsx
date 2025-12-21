'use client';

import { Bell, User, LogOut, Menu } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface HeaderProps {
    onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border bg-white px-6 shadow-sm">
            <div className="flex flex-1 items-center gap-4">
                <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700 md:hidden"
                    onClick={onMenuClick}
                >
                    <span className="sr-only">Open sidebar</span>
                    <Menu className="h-6 w-6" aria-hidden="true" />
                </button>
                <h2 className="text-lg font-semibold text-slate-900">Dashboard</h2>
            </div>
            <div className="ml-4 flex items-center space-x-4">
                <button className="relative rounded-full bg-white p-1 text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-6 w-6" aria-hidden="true" />
                    <span className="absolute right-1 top-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>
                <div className="relative ml-3">
                    <div className="flex items-center space-x-3">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-medium text-slate-900">Admin User</span>
                            <span className="text-xs text-slate-500">Administrator</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <User className="h-5 w-5" />
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="ml-2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                title="Cerrar Sesión"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
