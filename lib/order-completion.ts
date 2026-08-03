import { prisma } from '@/lib/prisma';
import { fulfillSeminarioBundle, orderHasSeminario } from '@/lib/seminario-fulfillment';

/**
 * Completa una orden pagada: estado, cupón, inscripciones y bundle del seminario.
 * Idempotente: si la orden ya está completada no hace nada, y las inscripciones
 * se crean solo si no existen. Es el mismo camino que ejecuta el webhook de
 * MercadoPago; existe como helper para poder completarla también en línea cuando
 * la pasarela confirma el pago de forma síncrona (Bricks devuelve "approved" al
 * momento) y no depender de que el webhook llegue.
 */
export async function completePaidOrder(orderId: string, paymentMethod?: string) {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
    });

    if (!order) throw new Error(`Order ${orderId} not found`);
    if (order.status === 'completed') return order;

    await prisma.order.update({
        where: { id: orderId },
        data: {
            status: 'completed',
            ...(paymentMethod ? { paymentMethod } : {}),
        },
    });

    if (order.couponId) {
        await prisma.coupon.update({
            where: { id: order.couponId },
            data: { usedCount: { increment: 1 } },
        });
    }

    for (const item of order.items) {
        const existing = await prisma.enrollment.findUnique({
            where: { userId_courseId: { userId: order.userId, courseId: item.courseId } },
        });
        if (!existing) {
            await prisma.enrollment.create({
                data: { userId: order.userId, courseId: item.courseId, progress: 0 },
            });
        }
    }

    if (orderHasSeminario(order.items)) {
        await fulfillSeminarioBundle(order);
    }

    return order;
}
