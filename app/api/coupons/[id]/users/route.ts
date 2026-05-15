import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        // Check if user is admin
        const adminUser = await prisma.user.findUnique({
            where: { email: session?.user?.email || '' }
        });

        if (adminUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Await params carefully to handle both Next.js 14 and 15 signatures
        const params = await context.params;
        const couponId = params.id;

        // Fetch orders that used this coupon
        const orders = await prisma.order.findMany({
            where: {
                couponId: couponId,
                status: 'completed'
            },
            include: {
                user: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const users = orders.map(order => ({
            orderId: order.id,
            orderNumber: order.orderNumber,
            date: order.createdAt,
            userId: order.user.id,
            name: order.user.name,
            email: order.user.email,
            billingName: order.billingName,
            billingEmail: order.billingEmail,
            total: order.total,
            currency: order.currency
        }));

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching coupon users:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
