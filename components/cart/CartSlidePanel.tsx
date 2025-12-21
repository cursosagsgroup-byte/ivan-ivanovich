'use client';

import { useCart } from '@/lib/cart-context';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function CartSlidePanel() {
    const { items, total, removeFromCart, isLoading, isCartOpen, closeCart } = useCart();
    const { t } = useTranslation();

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isCartOpen) {
                closeCart();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isCartOpen, closeCart]);

    if (!isCartOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* Slide Panel */}
            <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ease-out">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {t('cart.header')} ({items.length})
                    </h2>
                    <button
                        onClick={closeCart}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label={t('cart.close')}
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-col h-[calc(100%-80px)]">
                    {items.length === 0 ? (
                        // Empty State
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                            <ShoppingBag className="w-24 h-24 text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {t('cart.empty')}
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {t('cart.emptyDescription')}
                            </p>
                            <Link
                                href="/educacion/cursos-online"
                                onClick={closeCart}
                                className="inline-block bg-[#B70126] text-white px-6 py-3 rounded-lg hover:bg-[#D9012D] transition-colors font-semibold"
                            >
                                {t('cart.viewCourses')}
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                                    >
                                        {/* Course Image */}
                                        <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <ShoppingBag className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Course Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                                                {item.title}
                                            </h4>
                                            <p className="text-lg font-bold text-[#B70126]">
                                                ${item.price.toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromCart(item.courseId)}
                                            disabled={isLoading}
                                            className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            aria-label={t('cart.removeFromCart')}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Footer - Summary & Checkout */}
                            <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
                                {/* Total */}
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-semibold text-gray-700">{t('cart.total')}:</span>
                                    <span className="text-2xl font-bold text-gray-900">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>

                                {/* Checkout Button */}
                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="block w-full text-center bg-[#B70126] text-white py-4 rounded-lg hover:bg-red-800 transition-colors font-bold uppercase shadow-lg"
                                >
                                    {t('cart.checkout')}
                                </Link>

                                {/* Continue Shopping */}
                                <button
                                    onClick={closeCart}
                                    className="w-full text-center border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                                >
                                    {t('cart.continueShopping')}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

