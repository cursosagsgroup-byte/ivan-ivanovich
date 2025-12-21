'use client';

import { useCart } from '@/lib/cart-context';
import { ShoppingCart, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AddToCartButtonProps {
    course: {
        id: string | number;
        title: string;
        price: string | number;
        image: string;
    };
    className?: string;
    label?: string;
}

export default function AddToCartButton({ course, className = '', label = 'Inscribirse' }: AddToCartButtonProps) {
    const { addToCart, items, isLoading } = useCart();
    const [isInCart, setIsInCart] = useState(false);

    useEffect(() => {
        setIsInCart(items.some(item => item.courseId === String(course.id)));
    }, [items, course.id]);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if inside a Link
        e.stopPropagation();

        let priceNumber: number;
        if (typeof course.price === 'string') {
            priceNumber = parseFloat(course.price.replace('$', '').replace(',', ''));
        } else {
            priceNumber = course.price;
        }

        await addToCart({
            courseId: String(course.id),
            title: course.title,
            price: priceNumber,
            image: course.image
        });
    };

    return (
        <button
            onClick={!isInCart ? handleAddToCart : undefined}
            disabled={isLoading || isInCart}
            className={`flex items-center justify-center gap-2 font-semibold transition-all ${isInCart
                ? 'bg-green-600 text-white cursor-default hover:bg-green-700'
                : 'bg-[#B70126] text-white hover:bg-[#D9012D]'
                } ${className}`}
        >
            {isInCart ? (
                <>
                    <Check className="w-5 h-5" />
                    En el carrito
                </>
            ) : (
                <>
                    <ShoppingCart className="w-5 h-5" />
                    {label}
                </>
            )}
        </button>
    );
}
