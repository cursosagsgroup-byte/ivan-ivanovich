import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Local Stripe Webhook Test ---');

    // 1. Get Config
    const config = await prisma.paymentConfig.findUnique({ where: { gateway: 'stripe' } });
    if (!config || !config.secretKey || !config.webhookSecret) {
        throw new Error('Stripe configuration missing secretKey or webhookSecret');
    }

    const stripe = new Stripe(config.secretKey, { apiVersion: '2025-12-15.clover' as any });

    // 2. Setup Test Data (User, Course, Order)
    const user = await prisma.user.findFirst();
    const course = await prisma.course.findFirst({ where: { published: true } });
    if (!user || !course) throw new Error('Need at least one user and one published course in DB');

    const orderNumber = `TEST-WEBHOOK-${Date.now()}`;
    const order = await prisma.order.create({
        data: {
            userId: user.id,
            orderNumber,
            total: course.price,
            status: 'pending',
            billingName: 'Test Webhook User',
            billingEmail: user.email,
            items: {
                create: [{ courseId: course.id, price: course.price }]
            }
        }
    });

    console.log(`Created pending order: ${order.id} for user ${user.email} and course ${course.id}`);

    // If there is an existing enrollment, let's delete it so we can verify creation
    try {
        await prisma.enrollment.delete({
            where: {
                userId_courseId: { userId: user.id, courseId: course.id }
            }
        });
        console.log('Deleted existing enrollment for this test.');
    } catch (e) {
        // Ignored, might not exist
    }

    // 3. Construct Mock Webhook Event
    const payload = {
        id: `evt_test_${Date.now()}`,
        object: 'event',
        api_version: '2022-11-15',
        created: Math.floor(Date.now() / 1000),
        type: 'payment_intent.succeeded',
        data: {
            object: {
                id: `pi_test_${Date.now()}`,
                object: 'payment_intent',
                amount: course.price * 100, // in cents
                currency: 'mxn',
                status: 'succeeded',
                metadata: {
                    orderId: order.id
                }
            }
        }
    };

    const payloadString = JSON.stringify(payload);

    // 4. Generate Signature
    const signature = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: config.webhookSecret,
    });

    console.log('Sending webhook payload to http://localhost:3000/api/webhooks/stripe ...');

    // 5. Fire HTTP Request
    const response = await fetch('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'stripe-signature': signature
        },
        body: payloadString
    });

    const responseText = await response.text();
    console.log(`Response Status: ${response.status}`);
    console.log(`Response Body: ${responseText}`);

    if (response.ok) {
        // Wait 1s just in case async operations are pending, though we await them in route.ts
        await new Promise(r => setTimeout(r, 1000));

        // 6. Verify Database Changes
        const updatedOrder = await prisma.order.findUnique({ where: { id: order.id } });
        console.log(`Updated Order Status: ${updatedOrder?.status}`);

        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: { userId: user.id, courseId: course.id }
            }
        });

        const payment = await prisma.payment.findFirst({
            where: { orderId: order.id }
        });

        if (payment) {
            console.log('✅ Payment record created successfully.');
        } else {
            console.log('❌ Failed! Payment record was NOT created.');
        }

        if (enrollment) {
            console.log('✅ Success! User was automatically enrolled in the course.');
        } else {
            console.log('❌ Failed! Order status updated but user was NOT enrolled.');
        }

        // 7. Cleanup Test Data (Optional, but good to clean up test order)
        console.log('Cleaning up test order...');
        await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
        if (payment) await prisma.payment.delete({ where: { id: payment.id } });
        await prisma.order.delete({ where: { id: order.id } });
    } else {
        console.log('❌ Webhook failed to process.');
    }
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect()
    });
