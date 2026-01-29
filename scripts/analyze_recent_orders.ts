import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const orders = await prisma.order.findMany({
        take: 50,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            user: {
                select: {
                    email: true,
                    name: true
                }
            },
            payment: true,
            coupon: true
        }
    });

    console.log('--- Resumen de Últimas 50 Órdenes ---');
    orders.forEach(order => {
        const paymentInfo = order.payment
            ? `Payment: ${order.payment.status} (${order.payment.gateway})`
            : 'No Payment Record';

        const couponInfo = order.coupon
            ? `Coupon: ${order.coupon.code} (-${order.discountTotal})`
            : 'No Coupon';

        console.log(`
ID: ${order.id}
User: ${order.user.email}
Status: ${order.status}
Total: ${order.total} ${order.currency}
Date: ${order.createdAt.toISOString()}
${paymentInfo}
${couponInfo}
-------------------------------------------`);
    });
}

main()
    .then(() => prisma.$disconnect())
    .catch((error) => {
        console.error(error);
        prisma.$disconnect();
        process.exit(1);
    });
