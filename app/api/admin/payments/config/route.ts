import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const configs = await prisma.paymentConfig.findMany();

        // Mask secret keys for security
        const safeConfigs = configs.map(config => ({
            ...config,
            secretKey: config.secretKey ? '••••••••' : null,
            clientSecret: config.clientSecret ? '••••••••' : null,
            webhookSecret: config.webhookSecret ? '••••••••' : null,
        }));

        return NextResponse.json(safeConfigs);

    } catch (error) {
        console.error('Error fetching payment configs:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const { gateway, enabled, testMode, publicKey, secretKey, clientId, clientSecret, webhookSecret } = body;

        if (!gateway) {
            return NextResponse.json({ error: 'Gateway is required' }, { status: 400 });
        }

        // Check if config exists to handle secret key updates properly
        const existingConfig = await prisma.paymentConfig.findUnique({
            where: { gateway }
        });

        // Only update secrets if they are provided (and not the masked placeholder)
        const dataToUpdate: any = {
            enabled,
            testMode,
            publicKey, // Public keys can always be updated
            clientId,
        };

        // If secretKey is provided and not masked, update it
        if (secretKey && secretKey !== '••••••••') {
            dataToUpdate.secretKey = secretKey;
        }

        // If clientSecret is provided and not masked, update it
        if (clientSecret && clientSecret !== '••••••••') {
            dataToUpdate.clientSecret = clientSecret;
        }

        // If webhookSecret is provided and not masked, update it
        if (webhookSecret && webhookSecret !== '••••••••') {
            dataToUpdate.webhookSecret = webhookSecret;
        }

        const config = await prisma.paymentConfig.upsert({
            where: { gateway },
            update: dataToUpdate,
            create: {
                gateway,
                enabled: enabled || false,
                testMode: testMode || true,
                publicKey,
                secretKey: secretKey !== '••••••••' ? secretKey : undefined,
                clientId,
                clientSecret: clientSecret !== '••••••••' ? clientSecret : undefined,
                webhookSecret: webhookSecret !== '••••••••' ? webhookSecret : undefined,
            }
        });

        // Return the safe version
        return NextResponse.json({
            ...config,
            secretKey: config.secretKey ? '••••••••' : null,
            clientSecret: config.clientSecret ? '••••••••' : null,
            webhookSecret: config.webhookSecret ? '••••••••' : null,
        });

    } catch (error) {
        console.error('Error updating payment config:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
