import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const stripeConfig = await prisma.paymentConfig.findUnique({
            where: { gateway: 'stripe' },
        });

        if (!stripeConfig || !stripeConfig.enabled) {
            return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
        }

        // Only return public key (safe to expose)
        return NextResponse.json({
            publicKey: stripeConfig.publicKey,
        });
    } catch (error) {
        console.error('Error fetching Stripe config:', error);
        return NextResponse.json({ error: 'Failed to load config' }, { status: 500 });
    }
}
