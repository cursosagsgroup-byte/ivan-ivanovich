import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const urlParams = new URL(req.url).searchParams;

        // Mercado Pago can send type/topic in query params or in body body
        const type = body.type || urlParams.get('type') || urlParams.get('topic');
        const dataId = body.data?.id || urlParams.get('data.id') || urlParams.get('id');

        if (type !== 'payment' || !dataId) {
            return NextResponse.json({ received: true });
        }

        const mpConfig = await prisma.paymentConfig.findUnique({
            where: { gateway: 'mercadopago' },
        });

        if (!mpConfig || !mpConfig.enabled || !mpConfig.secretKey) {
            return NextResponse.json({ error: 'MP not configured' }, { status: 503 });
        }

        const client = new MercadoPagoConfig({ accessToken: mpConfig.secretKey });
        const paymentClient = new Payment(client);

        let paymentInfo;
        try {
            paymentInfo = await paymentClient.get({ id: dataId });
        } catch (e) {
            console.error('Error fetching Mercado Pago payment info', e);
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        if (paymentInfo.status === 'approved') {
            const orderId = paymentInfo.external_reference;

            if (!orderId) {
                console.error('No external_reference on MercadoPago payment');
                return NextResponse.json({ received: true }); // Missing reference, but we acknowledge receipt
            }

            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: { items: true },
            });

            if (!order) {
                console.error(`Order ${orderId} not found`);
                return NextResponse.json({ received: true });
            }

            // If already processed, ignore
            if (order.status === 'completed') {
                return NextResponse.json({ received: true });
            }

            // Update payment tracking record
            const existingPayment = await prisma.payment.findUnique({ where: { orderId: order.id } });

            if (existingPayment) {
                await prisma.payment.update({
                    where: { id: existingPayment.id },
                    data: {
                        status: 'completed',
                        gatewayResponse: JSON.stringify(paymentInfo)
                    }
                });
            } else {
                await prisma.payment.create({
                    data: {
                        orderId: order.id,
                        gateway: 'mercadopago',
                        transactionId: paymentInfo.id?.toString(),
                        amount: order.total,
                        currency: order.currency,
                        status: 'completed',
                        gatewayResponse: JSON.stringify(paymentInfo),
                    },
                });
            }

            // Mark order as complete
            await prisma.order.update({
                where: { id: orderId },
                data: { status: 'completed' },
            });

            // Handle coupon increments
            if (order.couponId) {
                await prisma.coupon.update({
                    where: { id: order.couponId },
                    data: {
                        usedCount: { increment: 1 }
                    }
                });
            }

            // Enroll user in their courses
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

            console.log(`✅ Order ${orderId} completed via MP Webhook`);
        } else if (paymentInfo.status === 'rejected' || paymentInfo.status === 'cancelled') {
            // Handle rejected
            const orderId = paymentInfo.external_reference;
            if (orderId) {
                await prisma.order.update({
                    where: { id: orderId },
                    data: { status: 'failed' },
                });
                console.log(`❌ Order ${orderId} marked as failed via MP Webhook`);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook MP error:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}
