'use client';

import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';

interface MexicoLandingCTAProps {
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
}

export default function MexicoLandingCTA({ className, style, children }: MexicoLandingCTAProps) {
    const { addToCart } = useCart();
    const router = useRouter();

    const handleBuyNow = async () => {
        await addToCart({
            courseId: 'cmmfhyxbg0000x698qxjdy165',
            title: 'Alerta Temprana en Protección Ejecutiva - México',
            price: 14800,
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
