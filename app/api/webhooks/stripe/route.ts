import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import {
    SEMINARIO_ONLINE_COURSE_ID,
    SEMINARIO_BONUS_COURSE_IDS,
    SEMINARIO_WHATSAPP_GROUP_URL,
} from '@/lib/course-constants';

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

        // Si la orden ya estaba completada, este webhook es un reintento → evita
        // re-enviar el correo de bienvenida del Seminario.
        const alreadyCompleted = order.status === 'completed';

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

        // Bundle del Seminario: si la orden incluye el Seminario, da acceso a los
        // cursos bono y envía el correo con WhatsApp (solo en el primer procesamiento).
        if (!alreadyCompleted && order.items.some((i) => i.courseId === SEMINARIO_ONLINE_COURSE_ID)) {
            await fulfillSeminarioBundle(order);
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

        // Si la orden ya estaba completada, este webhook es un reintento → evita
        // re-enviar el correo de bienvenida del Seminario.
        const alreadyCompleted = order.status === 'completed';

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

        // Bundle del Seminario: si la orden incluye el Seminario, da acceso a los
        // cursos bono y envía el correo con WhatsApp (solo en el primer procesamiento).
        if (!alreadyCompleted && order.items.some((i) => i.courseId === SEMINARIO_ONLINE_COURSE_ID)) {
            await fulfillSeminarioBundle(order);
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

// Al comprar el Seminario: inscribe en los cursos bono (Team Leader + Contravigilancia
// online, idempotente) y envía el correo de bienvenida con acceso + grupo de WhatsApp.
async function fulfillSeminarioBundle(order: any) {
    try {
        for (const courseId of SEMINARIO_BONUS_COURSE_IDS) {
            const existing = await prisma.enrollment.findUnique({
                where: { userId_courseId: { userId: order.userId, courseId } },
            });

            if (!existing) {
                await prisma.enrollment.create({
                    data: { userId: order.userId, courseId, progress: 0 },
                });
                console.log(`🎁 Seminario bonus: enrolled user ${order.userId} in course ${courseId}`);
            }
        }

        await sendSeminarioWelcomeEmail(order);
    } catch (error) {
        console.error('Error fulfilling seminario bundle:', error);
    }
}

async function sendSeminarioWelcomeEmail(order: any) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('SMTP credentials not configured. Seminario welcome email not sent.');
        return;
    }

    try {
        const bonusCourses = await prisma.course.findMany({
            where: { id: { in: SEMINARIO_BONUS_COURSE_IDS } },
            select: { title: true },
        });

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        const accountUrl = `${process.env.NEXTAUTH_URL || 'https://ivanivanovich.com'}/mi-cuenta`;
        const coursesList = [
            'Seminario Online en Vivo · Protección Ejecutiva',
            ...bonusCourses.map((c) => c.title),
        ]
            .map((t) => `<li style="margin-bottom:6px;">${t}</li>`)
            .join('');

        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Ivan Ivanovich Academy" <noreply@ivanivanovich.com>',
            to: order.billingEmail,
            subject: '🎟️ Tu acceso al Seminario + cursos de regalo · Ivan Ivanovich',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color:#333;">
                    <h1 style="color:#B70126;">¡Bienvenido al Seminario!</h1>
                    <p>Hola ${order.billingName || ''},</p>
                    <p>Tu compra fue confirmada y <strong>ya tienes acceso</strong> a estos cursos en línea:</p>
                    <ul style="background:#f9f9f9; padding:20px 20px 20px 40px; border-radius:8px;">
                        ${coursesList}
                    </ul>
                    <p>Ingresa con tu correo <strong>${order.billingEmail}</strong> y la contraseña que creaste al momento de la compra.</p>
                    <div style="text-align:center; margin:28px 0;">
                        <a href="${accountUrl}" style="background-color:#B70126; color:#fff; padding:12px 24px; text-decoration:none; border-radius:5px; font-weight:bold;">Ir a Mis Cursos</a>
                    </div>
                    <hr style="border:none; border-top:1px solid #eee; margin:28px 0;">
                    <h3 style="color:#128C7E;">Únete a nuestro grupo de WhatsApp</h3>
                    <p>Ahí recibirás los avisos del seminario en vivo, materiales y soporte directo.</p>
                    <div style="text-align:center; margin:20px 0;">
                        <a href="${SEMINARIO_WHATSAPP_GROUP_URL}" style="background-color:#25D366; color:#fff; padding:12px 24px; text-decoration:none; border-radius:5px; font-weight:bold;">Unirme al grupo de WhatsApp</a>
                    </div>
                    <p style="font-size:14px; color:#666;">Si tienes alguna pregunta, responde a este correo.</p>
                </div>
            `,
        });
        console.log(`✅ Seminario welcome email sent to ${order.billingEmail}`);
    } catch (error) {
        console.error('Error sending seminario welcome email:', error);
    }
}
