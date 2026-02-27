import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const configs = await prisma.paymentConfig.findMany({
            where: { enabled: true }
        });

        const activeMethods = configs.map(c => c.gateway);

        return NextResponse.json({ activeMethods });
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        return NextResponse.json({ activeMethods: [] });
    }
}
