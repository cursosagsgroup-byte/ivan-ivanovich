'use client';

import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';

interface CostaRicaLandingCTAProps {
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
}

export default function CostaRicaLandingCTA({ className, style, children }: CostaRicaLandingCTAProps) {
    const { addToCart } = useCart();
    const router = useRouter();

    const handleBuyNow = async () => {
        await addToCart({
            courseId: 'cmmdxl4jq00002djx81x89qm2',
            title: 'Protección Ejecutiva, Operatividad General y Logística Protectiva - Costa Rica (800USD)',
            price: 14400,
            image: '/images/landing-pe/feature-section.jpg'
        });
        router.push('/checkout');
    };

    return (
        <button
            onClick={handleBuyNow}
            className={className}
            style={style}
        >
            {children}
        </button>
    );
}
