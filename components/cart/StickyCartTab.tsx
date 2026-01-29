'use client';

import { useCart } from '@/lib/cart-context';
import { ShoppingCart } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { usePathname } from 'next/navigation';

export default function StickyCartTab() {
    const { items, openCart } = useCart();
    const { t } = useTranslation();
    const pathname = usePathname();

    // Don't show on checkout page
    if (pathname === '/checkout' || pathname?.startsWith('/checkout')) return null;

    if (items.length === 0) return null;

    return (
        <button
            onClick={openCart}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1 bg-[#B70126] text-white p-3 rounded-l-xl shadow-lg hover:bg-[#D9012D] transition-all duration-300 transform translate-x-0 hover:-translate-x-1"
            aria-label={t('cart.title')}
            style={{ writingMode: 'vertical-rl' }}
        >
            <div className="relative rotate-90 mb-2">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-white text-[#B70126] text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {items.length}
                </span>
            </div>
        </button>
    );
}
