'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface CartItem {
    id: string;
    courseId: string;
    title: string;
    price: number;
    image?: string;
}

interface CartContextType {
    items: CartItem[];
    itemCount: number;
    total: number;
    addToCart: (course: Omit<CartItem, 'id'>) => Promise<void>;
    removeFromCart: (courseId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    isLoading: boolean;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from API when user logs in
    useEffect(() => {
        if (status === 'loading') return;

        const initCart = async () => {
            try {
                if (session?.user) {
                    await loadCart();
                } else {
                    // Load from localStorage for guests
                    const savedCart = localStorage.getItem('cart');
                    if (savedCart) {
                        setItems(JSON.parse(savedCart));
                    }
                }
            } finally {
                setIsLoading(false);
            }
        };

        initCart();
    }, [session, status]);


    // Save to localStorage for guests
    useEffect(() => {
        if (!session?.user) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, session]);

    const loadCart = async () => {
        try {
            const response = await fetch('/api/cart');
            if (response.ok) {
                const data = await response.json();
                setItems(data.items || []);
            }
        } catch (error) {
            console.error('Failed to load cart:', error);
        }
    };

    const addToCart = async (course: Omit<CartItem, 'id'>) => {
        console.log('[Cart] Adding to cart:', course);
        console.log('[Cart] Session:', session?.user ? 'Logged in' : 'Guest');
        setIsLoading(true);
        try {
            if (session?.user) {
                // Add to database
                console.log('[Cart] Adding to database...');
                const response = await fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ courseId: course.courseId }),
                });

                if (response.ok) {
                    console.log('[Cart] Successfully added to database');
                    await loadCart();
                    setIsCartOpen(true); // Auto-open cart panel
                } else {
                    console.error('[Cart] Failed to add to database:', await response.text());
                }
            } else {
                // Add to local state for guests
                console.log('[Cart] Adding to local state...');
                const newItem: CartItem = {
                    id: Date.now().toString(),
                    ...course,
                };
                setItems(prev => {
                    const updated = [...prev, newItem];
                    console.log('[Cart] Updated items:', updated);
                    return updated;
                });
                setIsCartOpen(true); // Auto-open cart panel
            }
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCart = async (courseId: string) => {
        setIsLoading(true);
        try {
            if (session?.user) {
                // Remove from database
                const response = await fetch(`/api/cart/${courseId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    await loadCart();
                }
            } else {
                // Remove from local state
                setItems(prev => prev.filter(item => item.courseId !== courseId));
            }
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearCart = async () => {
        setIsLoading(true);
        try {
            if (session?.user) {
                await fetch('/api/cart', { method: 'DELETE' });
            }
            setItems([]);
        } catch (error) {
            console.error('Failed to clear cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const itemCount = items.length;
    const total = items.reduce((sum, item) => sum + item.price, 0);

    return (
        <CartContext.Provider value={{ items, itemCount, total, addToCart, removeFromCart, clearCart, isLoading, isCartOpen, openCart, closeCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
