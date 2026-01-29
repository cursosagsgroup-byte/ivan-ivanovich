import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();

async function main() {
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        console.error('Usage: npx tsx scripts/process_pending_order.ts <ORDER_ID> <PAYMENT_INTENT_ID>');
        process.exit(1);
    }

    const [orderId, paymentIntentId] = args;

    console.log(`Processing Order: ${orderId} with PaymentIntent: ${paymentIntentId}`);

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

    // 2. Verify PaymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
        throw new Error(`PaymentIntent ${paymentIntentId} status is ${paymentIntent.status}, expected succeeded`);
    }

    // 3. Process Order (Replicating Webhook Logic)
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
    });

    if (!order) {
        throw new Error(`Order ${orderId} not found`);
    }

    if (order.status === 'completed') {
        console.log(`Order ${orderId} is already completed. Skipping.`);
        return;
    }

    // Create Payment Record
    const payment = await prisma.payment.create({
        data: {
            orderId: order.id,
            gateway: 'stripe',
            transactionId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            status: 'completed',
            gatewayResponse: JSON.stringify(paymentIntent),
        },
    });
    console.log('✅ Payment record created');

    // Update Order Status
    await prisma.order.update({
        where: { id: orderId },
        data: { status: 'completed' },
    });
    console.log('✅ Order status updated to completed');

    // Update Coupon
    if (order.couponId) {
        await prisma.coupon.update({
            where: { id: order.couponId },
            data: { usedCount: { increment: 1 } }
        });
        console.log('✅ Coupon usage incremented');
    }

    // Enroll User
    for (const item of order.items) {
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: order.userId,
                    courseId: item.courseId,
                },
            },
        });

        if (!existingEnrollment) {
            await prisma.enrollment.create({
                data: {
                    userId: order.userId,
                    courseId: item.courseId,
                    progress: 0,
                },
            });
            console.log(`✅ Enrolled user ${order.userId} in course ${item.courseId}`);
        } else {
            console.log(`⚠️ User ${order.userId} already enrolled in course ${item.courseId}`);
        }
    }

    console.log('🎉 Order processing complete!');
}

main()
    .then(() => prisma.$disconnect())
    .catch((error) => {
        console.error(error);
        prisma.$disconnect();
        process.exit(1);
    });
