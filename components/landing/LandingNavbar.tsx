'use client';

import Link from 'next/link';
import Image from 'next/image';
import CartIcon from '@/components/cart/CartIcon';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';

export default function LandingNavbar() {
    const [isDarkBg, setIsDarkBg] = useState(true);
    const { addToCart, openCart } = useCart();

    const handleAddToCart = async () => {
        await addToCart({
            courseId: 'cml1dc7d60000piral5rrf0to',
            title: 'Protección Ejecutiva, Operatividad General y Logística Protectiva',
            price: 16936.00,
            image: '/images/landing-pe/feature-section.jpg'
        });
        openCart();
    };

    useEffect(() => {
        const handleScroll = () => {
            // Use elementsFromPoint to pierce through fixed overlays (like the navbar itself)
            // Check center of screen, 100px down (below logo/nav height to hit content)
            const elements = document.elementsFromPoint(window.innerWidth / 2, 100);

            // Find the first element that is part of a themed section
            for (const el of elements) {
                const section = el.closest('[data-theme]');
                if (section) {
                    const theme = section.getAttribute('data-theme');
                    setIsDarkBg(theme === 'dark');
                    return; // Found the top-most content section, stop searching
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full bg-transparent py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo - Button Style - ALWAYS WHITE */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="block bg-white rounded-full px-6 py-3 shadow-lg hover:scale-105 transition-all">
                            <Image
                                src="/logo.png"
                                alt="Ivan Ivanovich - Executive Protection Academy"
                                width={200}
                                height={50}
                                className="w-auto h-10 md:h-12 transition-all"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Right Side: Button + Cart - ALWAYS TRANSPARENT GLASS */}
                    <div className="flex items-center gap-4 md:gap-6 rounded-full bg-white/10 backdrop-blur-sm p-2 border border-white/20 transition-all">
                        <button
                            onClick={handleAddToCart}
                            className="hidden sm:inline-flex items-center justify-center bg-[#B70126] hover:bg-[#90011E] text-white font-bold py-2 px-6 rounded-full transition-all text-sm md:text-base uppercase tracking-wider cursor-pointer"
                            style={{ fontFamily: 'var(--font-bebas)' }}
                        >
                            Reservar Mi Lugar
                        </button>

                        <div className="flex items-center px-2">
                            <CartIcon className={isDarkBg ? 'text-white' : 'text-gray-900'} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
