import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const mpConfig = await prisma.paymentConfig.findUnique({
            where: { gateway: 'mercadopago' },
        });

        if (!mpConfig || !mpConfig.enabled || !mpConfig.publicKey) {
            return NextResponse.json({ error: 'Mercado Pago no está configurado o está inactivo' }, { status: 503 });
        }

        return NextResponse.json({
            publicKey: mpConfig.publicKey,
        });
    } catch (error) {
        console.error('Error fetching Mercado Pago config:', error);
        return NextResponse.json({ error: 'Failed to load config' }, { status: 500 });
    }
}
