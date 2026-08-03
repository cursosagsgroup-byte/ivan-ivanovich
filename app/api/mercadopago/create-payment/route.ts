import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { completePaidOrder } from '@/lib/order-completion';

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

        // notification_url solo funciona con URLs públicas https; en local se omite.
        const baseUrl = process.env.NEXTAUTH_URL || '';
        const notificationUrl = baseUrl.startsWith('https://')
            ? `${baseUrl}/api/webhooks/mercadopago`
            : undefined;

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
                ...(notificationUrl ? { notification_url: notificationUrl } : {}),
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

        if (result.status === 'approved') {
            // Bricks confirma tarjetas de forma síncrona: completamos la orden aquí
            // mismo (inscripción + correo) sin depender de que llegue el webhook.
            // El pago de Sergio Barrientos (ago 2026) se perdió por confiar solo en él.
            try {
                await completePaidOrder(orderId, 'mercadopago');
            } catch (completionError) {
                // El cobro ya se hizo: no convertimos esto en error para el cliente.
                // El webhook (idempotente) sirve de segundo intento.
                console.error(`Pago MP ${result.id} aprobado pero la orden ${orderId} no se pudo completar:`, completionError);
            }
            return NextResponse.json({ status: result.status, id: result.id });
        } else if (result.status === 'in_process' || result.status === 'pending') {
            return NextResponse.json({ status: result.status, id: result.id });
        } else {
            return NextResponse.json({ error: `Pago rechazado o fallido: ${result.status_detail}` }, { status: 400 });
        }
    } catch (error: any) {
        console.error('MercadoPago error:', error);
        return NextResponse.json({ error: error.message || 'Error procesando el pago' }, { status: 500 });
    }
}
