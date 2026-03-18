'use client';

import { useCart } from '@/lib/cart-context';

interface ContravigilanciaLandingCTAProps {
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
}

export default function ContravigilanciaLandingCTA({ className, style, children }: ContravigilanciaLandingCTAProps) {
    const { addToCart, openCart } = useCart();

    const handleAddToCart = async () => {
        await addToCart({
            courseId: 'cmio13v7u000164w1bhkqj8ej',
            title: 'Contravigilancia Para Protección Ejecutiva',
            price: 2500,
            image: '/curso-contravigilancia.jpg'
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
