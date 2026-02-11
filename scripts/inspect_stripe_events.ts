import { prisma } from '../lib/prisma';
import Stripe from 'stripe';

async function main() {
    console.log('--- Fetching Stripe Config ---');
    const stripeConfig = await prisma.paymentConfig.findUnique({
        where: { gateway: 'stripe' },
    });

    if (!stripeConfig || !stripeConfig.secretKey) {
        console.error('Stripe config missing or no secret key.');
        return;
    }

    const stripe = new Stripe(stripeConfig.secretKey, {
        apiVersion: '2025-12-15.clover', // Using the version from route.ts
    });

    console.log('--- Listing Recent Stripe Events ---');
    try {
        const events = await stripe.events.list({
            limit: 10,
        });

        console.log(`Found ${events.data.length} events.`);

        for (const event of events.data) {
            console.log(`Event: ${event.type} (ID: ${event.id}) - Created: ${new Date(event.created * 1000).toISOString()}`);
            if (event.type === 'checkout.session.completed') {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log(`  Session ID: ${session.id}`);
                console.log(`  Customer Email: ${session.customer_details?.email}`);
                console.log(`  Amount Total: ${session.amount_total}`);
                console.log(`  Metadata:`, session.metadata);
            } else if (event.type.startsWith('payment_intent.')) {
                const pi = event.data.object as Stripe.PaymentIntent;
                console.log(`  PaymentIntent ID: ${pi.id}`);
                console.log(`  Amount: ${pi.amount} ${pi.currency}`);
                console.log(`  Status: ${pi.status}`);
                console.log(`  Metadata:`, pi.metadata);
                // Check for receipt email
                if (pi.receipt_email) console.log(`  Receipt Email: ${pi.receipt_email}`);

                // Check for last payment error if any
                if (event.type === 'payment_intent.payment_failed' && pi.last_payment_error) {
                    console.log(`  Error: ${pi.last_payment_error.message}`);
                    console.log(`  Decline Code: ${pi.last_payment_error.decline_code}`);
                }
            }
        }

    } catch (error: any) {
        console.error('Error fetching events from Stripe:', error.message);
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
