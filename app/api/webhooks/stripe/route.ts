import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = headers().get('stripe-signature');

        if (!signature) {
            return NextResponse.json({ error: 'No signature' }, { status: 400 });
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: any) {
            console.error('⚠️  Webhook signature verification failed.', err.message);
            return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutCompleted(session);
                break;
            }

            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await handlePaymentSucceeded(paymentIntent);
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await handlePaymentFailed(paymentIntent);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    try {
        console.log('✅ Checkout completed:', session.id);

        // Get order from metadata (you'll need to add this when creating checkout)
        const orderId = session.metadata?.orderId;

        if (!orderId) {
            console.error('No orderId in session metadata');
            return;
        }

        // Update order status
        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'completed',
                paymentIntentId: session.payment_intent as string,
            },
        });

        console.log(`✅ Order ${orderId} marked as completed`);
    } catch (error) {
        console.error('Error handling checkout completed:', error);
    }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    try {
        console.log('✅ Payment succeeded:', paymentIntent.id);

        // Find order by payment intent ID
        const order = await prisma.order.findFirst({
            where: { paymentIntentId: paymentIntent.id },
            include: { items: true },
        });

        if (!order) {
            console.error('Order not found for payment intent:', paymentIntent.id);
            return;
        }

        // Update order status
        await prisma.order.update({
            where: { id: order.id },
            data: { status: 'completed' },
        });

        // Enroll user in courses if not already enrolled
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
            }
        }
    } catch (error) {
        console.error('Error handling payment succeeded:', error);
    }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    try {
        console.log('❌ Payment failed:', paymentIntent.id);

        const order = await prisma.order.findFirst({
            where: { paymentIntentId: paymentIntent.id },
        });

        if (!order) {
            console.error('Order not found for payment intent:', paymentIntent.id);
            return;
        }

        await prisma.order.update({
            where: { id: order.id },
            data: { status: 'failed' },
        });

        console.log(`❌ Order ${order.id} marked as failed`);
    } catch (error) {
        console.error('Error handling payment failed:', error);
    }
}
