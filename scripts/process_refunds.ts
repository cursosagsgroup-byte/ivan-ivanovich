
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

async function processRefunds() {
    try {
        console.log('Fetching Stripe configuration...');
        const stripeConfig = await prisma.paymentConfig.findUnique({
            where: { gateway: 'stripe' },
        });

        if (!stripeConfig || !stripeConfig.secretKey) {
            console.error('Stripe not configured or secret key missing.');
            return;
        }

        const stripe = new Stripe(stripeConfig.secretKey, {
            apiVersion: '2025-12-15.clover',
        });

        console.log('Fetching refundable charges...');
        // List recent charges again to be safe
        const charges = await stripe.charges.list({
            limit: 20,
        });

        // Filter exactly for the ones we saw: 25.00 MXN, succeeded, not refunded
        const refundableCharges = charges.data.filter(c => {
            return c.amount === 2500 && c.status === 'succeeded' && !c.refunded && c.currency.toLowerCase() === 'mxn';
        });

        if (refundableCharges.length === 0) {
            console.log('No refundable charges found. They might have been already refunded.');
            return;
        }

        console.log(`Processing ${refundableCharges.length} refunds...`);

        for (const charge of refundableCharges) {
            console.log(`\nRefunding Charge ID: ${charge.id} (Amount: ${charge.amount} ${charge.currency})`);
            try {
                const refund = await stripe.refunds.create({
                    charge: charge.id,
                    reason: 'duplicate',
                });
                console.log(`✅ Refund successful! Refund ID: ${refund.id}`);
            } catch (err: any) {
                console.error(`❌ Proccessing failed for ${charge.id}:`, err.message);
            }
        }

        console.log('\nAll refund attempts completed.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

processRefunds();
