'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function StudentSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    useEffect(() => {
        setSearchTerm(searchParams.get('search') || '');
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());

        if (searchTerm.trim()) {
            params.set('search', searchTerm.trim());
            params.delete('page'); // Reset to page 1 when searching
        } else {
            params.delete('search');
        }

        router.push(`/admin/students?${params.toString()}`);
    };

    const handleClear = () => {
        setSearchTerm('');
        const params = new URLSearchParams(searchParams.toString());
        params.delete('search');
        params.delete('page');
        router.push(`/admin/students?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="relative flex items-center gap-2">
            <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    placeholder="Buscar por nombre o email..."
                />
            </div>
            <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
                Buscar
            </button>
            {searchTerm && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                >
                    Limpiar
                </button>
            )}
        </form>
    );
}
