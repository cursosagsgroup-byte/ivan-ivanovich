import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE - Remove item from cart
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { cart: true }
        });

        if (!user || !user.cart) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
        }

        await prisma.cartItem.deleteMany({
            where: {
                cartId: user.cart.id,
                courseId: courseId,
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error removing from cart:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
