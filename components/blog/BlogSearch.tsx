'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function BlogSearch({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1'); // Reset to page 1 when searching

        if (term) {
            params.set('search', term);
        } else {
            params.delete('search');
        }

        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative flex flex-1 flex-shrink-0 max-w-md mx-auto mb-12">
            <label htmlFor="search" className="sr-only">
                Buscar
            </label>
            <input
                className="peer block w-full rounded-full border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 shadow-sm focus:border-[#B70126] focus:ring-[#B70126]"
                placeholder={placeholder}
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
                defaultValue={searchParams.get('search')?.toString()}
            />
            <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
    );
}
