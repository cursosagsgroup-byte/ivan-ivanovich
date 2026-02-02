'use client';

import { useCart } from '@/lib/cart-context';
import { Shield } from 'lucide-react';

interface LandingCTAProps {
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
    showIcon?: boolean;
}

export default function LandingCTA({ className, style, children, showIcon = false }: LandingCTAProps) {
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

    return (
        <button
            onClick={handleAddToCart}
            className={className}
            style={style}
        >
            {children}
        </button>
    );
}
