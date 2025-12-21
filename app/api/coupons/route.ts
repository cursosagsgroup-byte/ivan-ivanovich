import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Check if user is admin
        const user = await prisma.user.findUnique({
            where: { email: session?.user?.email || '' }
        });

        if (user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' },
            include: { course: true }
        });

        return NextResponse.json(coupons);
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Check if user is admin
        const user = await prisma.user.findUnique({
            where: { email: session?.user?.email || '' }
        });

        if (user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();

        // Check if code exists
        const existing = await prisma.coupon.findUnique({
            where: { code: data.code }
        });

        if (existing) {
            return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: data.code,
                discountType: data.discountType || 'PERCENTAGE',
                discountValue: parseFloat(data.discountValue),
                maxUses: data.maxUses ? parseInt(data.maxUses) : null,
                maxUsesPerUser: data.maxUsesPerUser ? parseInt(data.maxUsesPerUser) : null,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
                courseId: data.courseId || null,
                isActive: true
            }
        });

        return NextResponse.json(coupon);

    } catch (error) {
        console.error('Error creating coupon:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
