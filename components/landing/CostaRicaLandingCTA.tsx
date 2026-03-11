'use client';

import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';
import { COSTA_RICA_COURSE_ID } from '@/lib/course-constants';

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
            courseId: COSTA_RICA_COURSE_ID,
            title: 'Protección Ejecutiva, Operatividad General y Logística Protectiva - Costa Rica',
            price: 800,
            image: '/images/landing-pe/ivan-pensando.jpg'
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
