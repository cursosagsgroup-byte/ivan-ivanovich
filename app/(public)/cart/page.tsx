'use client';

import { useCart } from '@/lib/cart-context';
import { Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

export default function CartPage() {
    const { items, total, removeFromCart, isLoading } = useCart();
    const { t } = useTranslation();

    if (items.length === 0) {
        return (
            <div className="bg-white min-h-screen">
                {/* Hero Section */}
                <div className="pt-32 pb-8 lg:pt-48 lg:pb-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-[90%]">
                    <div className="relative rounded-[30px] overflow-hidden bg-[#0B121F] isolate shadow-2xl">
                        <div className="absolute inset-0 -z-10 opacity-40">
                            <img
                                src="/course-hero-bg.png"
                                alt="Background"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="mx-auto max-w-full px-6 py-16 lg:px-12 lg:py-24 relative z-10">
                            <div className="text-center">
                                <div className="inline-block bg-[#B70126] rounded-full px-8 py-3 mb-6">
                                    <span className="text-white font-bold text-xl lg:text-2xl uppercase tracking-wide" style={{ fontFamily: 'var(--font-montserrat)' }}>
                                        {t('cart.title')}
                                    </span>
                                </div>
                                <h1 className="text-6xl lg:text-8xl font-normal text-white uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {t('cart.yourCart')}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Empty Cart */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <ShoppingBag className="w-24 h-24 text-slate-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('cart.empty')}</h2>
                    <p className="text-slate-500 mb-8">{t('cart.emptyDescription')}</p>
                    <Link
                        href="/educacion/cursos-online"
                        className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                        {t('cart.viewCourses')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="pt-32 pb-8 lg:pt-48 lg:pb-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-[90%]">
                <div className="relative rounded-[30px] overflow-hidden bg-[#0B121F] isolate shadow-2xl">
                    <div className="absolute inset-0 -z-10 opacity-40">
                        <img
                            src="/course-hero-bg.png"
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="mx-auto max-w-full px-6 py-16 lg:px-12 lg:py-24 relative z-10">
                        <div className="text-center">
                            <div className="inline-block bg-[#B70126] rounded-full px-8 py-3 mb-6">
                                <span className="text-white font-bold text-xl lg:text-2xl uppercase tracking-wide" style={{ fontFamily: 'var(--font-montserrat)' }}>
                                    {items.length} {items.length === 1 ? t('cart.course') : t('cart.courses')}
                                </span>
                            </div>
                            <h1 className="text-6xl lg:text-8xl font-normal text-white uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
                                {t('cart.yourCart')}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cart Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-6 flex gap-6">
                                {/* Course Image */}
                                <div className="flex-shrink-0 w-32 h-32 bg-slate-100 rounded-lg overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <ShoppingBag className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>

                                {/* Course Info */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</p>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFromCart(item.courseId)}
                                    disabled={isLoading}
                                    className="flex-shrink-0 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                                >
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">{t('cart.orderSummary')}</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-slate-600">
                                    <span>{t('cart.subtotal')}</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>{t('cart.taxes')}</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="border-t border-slate-300 pt-3">
                                    <div className="flex justify-between text-lg font-bold text-slate-900">
                                        <span>{t('cart.total')}</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full block text-center bg-primary text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold mb-4"
                            >
                                {t('cart.checkout')}
                            </Link>

                            <Link
                                href="/educacion/cursos-online"
                                className="w-full block text-center border border-slate-300 text-slate-700 py-3 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                            >
                                {t('cart.continueShopping')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
