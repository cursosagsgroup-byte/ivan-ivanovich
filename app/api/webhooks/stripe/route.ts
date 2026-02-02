import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
    try {
        // Get Stripe credentials from database
        const stripeConfig = await prisma.paymentConfig.findUnique({
            where: { gateway: 'stripe' },
        });

        if (!stripeConfig || !stripeConfig.enabled) {
            return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
        }

        if (!stripeConfig.secretKey || !stripeConfig.webhookSecret) {
            return NextResponse.json({ error: 'Stripe credentials missing' }, { status: 503 });
        }

        // Initialize Stripe with credentials from database
        const stripe = new Stripe(stripeConfig.secretKey, {
            apiVersion: '2025-12-15.clover',
        });

        const body = await req.text();
        const headersList = await headers();
        const signature = headersList.get('stripe-signature');

        if (!signature) {
            return NextResponse.json({ error: 'No signature' }, { status: 400 });
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, stripeConfig.webhookSecret);
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

        // Get order from metadata
        const orderId = session.metadata?.orderId;

        if (!orderId) {
            console.error('No orderId in session metadata');
            return;
        }

        // Get order with items to enroll user in courses
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });

        if (!order) {
            console.error(`Order ${orderId} not found`);
            return;
        }

        // Update order status
        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'completed',
            },
        });

        // Increment coupon usage if applicable
        if (order.couponId) {
            await prisma.coupon.update({
                where: { id: order.couponId },
                data: {
                    usedCount: {
                        increment: 1
                    }
                }
            });
        }

        // Enroll user in courses
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

        console.log(`✅ Order ${orderId} completed and user enrolled`);
    } catch (error) {
        console.error('Error handling checkout completed:', error);
    }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    try {
        console.log('✅ Payment succeeded:', paymentIntent.id);

        let orderId = paymentIntent.metadata.orderId;

        // Fallback: If metadata is missing, try to find matching pending order by email/amount
        if (!orderId) {
            console.log('⚠️ No orderId in metadata. Attempting to match by email and amount...');

            // Get email from payment intent (receipt_email or from latest_charge if expanded, but we only have the event object here)
            // Note: In webhook event, latest_charge is usually an ID, not expanded. 
            // We rely on receipt_email or billing_details if available.
            let email = paymentIntent.receipt_email;

            if (!email && (paymentIntent as any).charges?.data?.length > 0) {
                const charge = (paymentIntent as any).charges.data[0];
                email = charge.billing_details?.email || charge.receipt_email;
            }

            if (email) {
                const amountUnit = paymentIntent.amount / 100;

                // Find recent pending order
                const matchingOrder = await prisma.order.findFirst({
                    where: {
                        status: 'pending',
                        total: amountUnit,
                        user: {
                            email: {
                                equals: email,
                                mode: 'insensitive'
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                });

                if (matchingOrder) {
                    console.log(`✅ Found matching pending order ${matchingOrder.id} for email ${email}`);
                    orderId = matchingOrder.id;
                }
            }
        }

        if (!orderId) {
            console.error('❌ Could not link PaymentIntent to any Order (No metadata & no email match)');
            return;
        }

        // Get order
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });

        if (!order) {
            console.error(`Order ${orderId} not found`);
            return;
        }

        // Create Payment record
        await prisma.payment.create({
            data: {
                orderId: order.id,
                gateway: 'stripe',
                transactionId: paymentIntent.id,
                amount: paymentIntent.amount / 100, // Convert back to main currency unit
                currency: paymentIntent.currency.toUpperCase(),
                status: 'completed',
                gatewayResponse: JSON.stringify(paymentIntent),
            },
        });

        // Update order status
        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'completed',
            },
        });

        // Increment coupon usage if applicable
        if (order.couponId) {
            await prisma.coupon.update({
                where: { id: order.couponId },
                data: {
                    usedCount: {
                        increment: 1
                    }
                }
            });
        }

        // Enroll user in courses
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

        console.log(`✅ Order ${orderId} completed and user enrolled via PaymentIntent`);

    } catch (error) {
        console.error('Error handling payment succeeded:', error);
    }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    try {
        console.log('❌ Payment failed:', paymentIntent.id);

        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    status: 'failed',
                },
            });

            // Record failed payment attempt
            await prisma.payment.create({
                data: {
                    orderId: orderId,
                    gateway: 'stripe',
                    transactionId: paymentIntent.id,
                    amount: paymentIntent.amount / 100,
                    currency: paymentIntent.currency,
                    status: 'failed',
                    gatewayResponse: JSON.stringify(paymentIntent),
                },
            });
            console.log(`❌ Order ${orderId} marked as payment failed`);
        } else {
            console.error('No orderId in failed payment intent metadata');
        }

    } catch (error) {
        console.error('Error handling payment failed:', error);
    }
}
