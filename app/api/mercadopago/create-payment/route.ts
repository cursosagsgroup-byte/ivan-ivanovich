import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { formData, orderId } = body;

        const configEntry = await prisma.paymentConfig.findUnique({
            where: { gateway: 'mercadopago' }
        });

        if (!configEntry || !configEntry.enabled || !configEntry.secretKey) {
            return NextResponse.json({ error: 'Mercado Pago no está configurado o está inactivo' }, { status: 400 });
        }

        const client = new MercadoPagoConfig({ accessToken: configEntry.secretKey, options: { timeout: 15000 } });
        const payment = new Payment(client);

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
        }

        // Configuración para el pago con Bricks (Card Payment)
        const paymentData = {
            body: {
                transaction_amount: formData.transaction_amount,
                token: formData.token,
                description: `Pedido ${order.orderNumber} - Ivan Ivanovich`,
                installments: formData.installments,
                payment_method_id: formData.payment_method_id,
                issuer_id: formData.issuer_id,
                payer: {
                    email: formData.payer.email,
                    identification: formData.payer.identification
                },
                external_reference: orderId, // Esto enviará el ID de la orden en el Webhook
            }
        };

        const result = await payment.create(paymentData);

        // Save initial transaction state
        await prisma.payment.create({
            data: {
                orderId: order.id,
                gateway: 'mercadopago',
                transactionId: result.id?.toString(),
                amount: order.total,
                currency: order.currency,
                status: result.status || 'pending',
                gatewayResponse: JSON.stringify(result)
            }
        });

        if (result.status === 'approved' || result.status === 'in_process' || result.status === 'pending') {
            return NextResponse.json({ status: result.status, id: result.id });
        } else {
            return NextResponse.json({ error: `Pago rechazado o fallido: ${result.status_detail}` }, { status: 400 });
        }
    } catch (error: any) {
        console.error('MercadoPago error:', error);
        return NextResponse.json({ error: error.message || 'Error procesando el pago' }, { status: 500 });
    }
}
