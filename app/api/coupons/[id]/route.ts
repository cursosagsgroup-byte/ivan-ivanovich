import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        // Check if user is admin
        const user = await prisma.user.findUnique({
            where: { email: session?.user?.email || '' }
        });

        if (user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.coupon.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error deleting coupon:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        // Check if user is admin
        const user = await prisma.user.findUnique({
            where: { email: session?.user?.email || '' }
        });

        if (user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();

        const coupon = await prisma.coupon.update({
            where: { id },
            data: {
                isActive: data.isActive
            }
        });

        return NextResponse.json(coupon);

    } catch (error) {
        console.error('Error updating coupon:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
