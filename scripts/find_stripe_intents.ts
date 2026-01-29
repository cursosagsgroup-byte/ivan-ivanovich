import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();

async function main() {
    // 1. Get Stripe Config
    const stripeConfig = await prisma.paymentConfig.findUnique({
        where: { gateway: 'stripe' },
    });

    if (!stripeConfig || !stripeConfig.secretKey) {
        throw new Error('Stripe not configured');
    }

    const stripe = new Stripe(stripeConfig.secretKey, {
        apiVersion: '2025-12-15.clover',
    });

    // 2. Get Pending Orders
    const pendingOrders = await prisma.order.findMany({
        where: { status: 'pending' },
        include: { user: { select: { email: true } } }
    });

    console.log(`Found ${pendingOrders.length} pending orders in DB.`);

    // 3. List recent PaymentIntents
    console.log('Fetching recent PaymentIntents from Stripe...');
    const paymentIntents = await stripe.paymentIntents.list({
        limit: 50,
        expand: ['data.latest_charge'] // Expand charge to get billing details
    });

    console.log('--- Analysis of Stripe Payments ---');

    for (const pi of paymentIntents.data) {
        if (pi.status === 'succeeded') {
            const amount = pi.amount / 100;
            const orderIdMetadata = pi.metadata.orderId;

            // Try to find email from latest_charge
            let stripeEmail = pi.receipt_email;
            if (!stripeEmail && pi.latest_charge && typeof pi.latest_charge !== 'string') {
                stripeEmail = pi.latest_charge.billing_details?.email || pi.latest_charge.receipt_email;
            }

            // Find matching order by ID or Email+Amount
            let matchedOrder = null;

            if (orderIdMetadata) {
                matchedOrder = pendingOrders.find(o => o.id === orderIdMetadata);
            } else if (stripeEmail) {
                matchedOrder = pendingOrders.find(o =>
                    o.user.email.toLowerCase() === stripeEmail.toLowerCase() &&
                    o.total === amount
                );
            }

            if (matchedOrder) {
                console.log(`✅ [MATCH FOUND] 
    PaymentIntent: ${pi.id} ($${amount})
    Email (Stripe): ${stripeEmail}
    Order ID: ${matchedOrder.id}
    User: ${matchedOrder.user.email}
    Action: npx tsx scripts/process_pending_order.ts ${matchedOrder.id} ${pi.id}`);
            } else {
                console.log(`⚠️ [UNMATCHED] PaymentIntent ${pi.id} ($${amount}) - Email: ${stripeEmail} - Metadata OrderId: ${orderIdMetadata || 'MISSING'}`);
            }
        }
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch((error) => {
        console.error(error);
        prisma.$disconnect();
        process.exit(1);
    });
