
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

async function listRefundablePayments() {
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

        console.log('Fetching recent successful charges directly from Stripe...');
        // List recent charges (limit 20)
        const charges = await stripe.charges.list({
            limit: 20,
        });

        const recentCharges = charges.data.filter(c => {
            // Filter by amount (25.00 -> 2500 cents) and status succeeded, not refunded
            return c.amount === 2500 && c.status === 'succeeded' && !c.refunded;
        });

        if (recentCharges.length === 0) {
            console.log('No refundable charges of 25.00 found in the last batch.');
        } else {
            console.log(`\nFound ${recentCharges.length} REFUNDABLE charges of 25.00:\n`);
            recentCharges.forEach((c, index) => {
                const date = new Date(c.created * 1000).toLocaleString();
                console.log(`${index + 1}. ID: ${c.id}`);
                console.log(`   Amount: ${(c.amount / 100).toFixed(2)} ${c.currency.toUpperCase()}`);
                console.log(`   Email: ${c.receipt_email || c.billing_details?.email || 'N/A'}`);
                console.log(`   Date: ${date}`);
                console.log(`   PaymentIntent: ${c.payment_intent}`);
                console.log('---------------------------------------------------');
            });
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

listRefundablePayments();
