'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useTranslation } from '@/hooks/useTranslation';

export default function CartIcon() {
    const { t } = useTranslation();
    const { itemCount, openCart } = useCart();

    return (
        <button
            onClick={openCart}
            className="relative inline-flex items-center text-gray-900 hover:text-[#B70126] transition-colors"
            aria-label={t('cart.title')}
        >
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                </span>
            )}
        </button>
    );
}
