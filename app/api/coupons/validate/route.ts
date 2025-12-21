import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { code, cartItems, email } = await req.json();

        if (!code) {
            return NextResponse.json({ valid: false, message: 'Code is required' }, { status: 400 });
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code },
            include: { course: true },
        });

        if (!coupon) {
            return NextResponse.json({ valid: false, message: 'Invalid coupon code' }, { status: 404 });
        }

        if (!coupon.isActive) {
            return NextResponse.json({ valid: false, message: 'Coupon is inactive' }, { status: 400 });
        }

        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return NextResponse.json({ valid: false, message: 'Coupon has expired' }, { status: 400 });
        }

        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
            return NextResponse.json({ valid: false, message: 'Coupon usage limit reached' }, { status: 400 });
        }

        if (coupon.maxUsesPerUser && email) {
            // Find user by email
            const user = await prisma.user.findUnique({ where: { email } });
            if (user) {
                const userUsage = await prisma.order.count({
                    where: {
                        userId: user.id,
                        couponId: coupon.id
                    }
                });
                if (userUsage >= coupon.maxUsesPerUser) {
                    return NextResponse.json({ valid: false, message: 'You have verified this coupon the maximum number of times' }, { status: 400 });
                }
            }
        }

        // Calculate discount
        let discountAmount = 0;
        let applicable = false;

        // If coupon is restricted to a course
        if (coupon.courseId) {
            // Check if cart contains the course
            const courseInCart = cartItems.find((item: any) => item.id === coupon.courseId || item.courseId === coupon.courseId);

            if (courseInCart) {
                applicable = true;
                if (coupon.discountType === 'PERCENTAGE') {
                    discountAmount = (courseInCart.price * coupon.discountValue) / 100;
                } else {
                    discountAmount = coupon.discountValue; // Fixed amount
                    if (discountAmount > courseInCart.price) discountAmount = courseInCart.price;
                }
            } else {
                return NextResponse.json({ valid: false, message: `This coupon is valid only for ${coupon.course?.title}` }, { status: 400 });
            }
        } else {
            // Global coupon
            applicable = true;
            const cartTotal = cartItems.reduce((sum: number, item: any) => sum + item.price, 0);

            if (coupon.discountType === 'PERCENTAGE') {
                discountAmount = (cartTotal * coupon.discountValue) / 100;
            } else {
                discountAmount = coupon.discountValue;
                if (discountAmount > cartTotal) discountAmount = cartTotal;
            }
        }

        return NextResponse.json({
            valid: true,
            discountAmount,
            coupon: {
                id: coupon.id,
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue
            }
        });

    } catch (error) {
        console.error('Error validating coupon:', error);
        return NextResponse.json({ valid: false, message: 'Internal server error' }, { status: 500 });
    }
}
