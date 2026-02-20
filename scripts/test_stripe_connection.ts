
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();

async function main() {
    console.log('Testing Stripe Connection...');

    const config = await prisma.paymentConfig.findUnique({
        where: { gateway: 'stripe' }
    });

    if (!config || !config.secretKey) {
        console.error('Stripe not configured or missing secret key.');
        return;
    }

    const stripe = new Stripe(config.secretKey, {
        apiVersion: '2025-12-15.clover' as any, // Cast to any to avoid strict type checking issues if types correspond to older version
    });

    try {
        // Try to list 1 payment intent to verify credentials
        const paymentIntents = await stripe.paymentIntents.list({ limit: 1 });
        console.log('✅ Connection Successful!');
        console.log(`Retrieved ${paymentIntents.data.length} payment intents.`);
    } catch (error: any) {
        console.error('❌ Connection Failed:', error.message);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
