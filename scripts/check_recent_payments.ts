
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const sevenDaysAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
    console.log(`Checking activity since: ${sevenDaysAgo.toISOString()}`);

    // 1. Check ALL Payments created in the last 24 hours
    const recentPayments = await prisma.payment.findMany({
        where: {
            createdAt: {
                gte: sevenDaysAgo
            }
        },
        include: {
            order: {
                include: {
                    user: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    console.log(`\n--- Recent Payments (Last 7 days): ${recentPayments.length} ---`);
    recentPayments.forEach(payment => {
        console.log(`[${payment.createdAt.toISOString()}] Status: ${payment.status} | Gateway: ${payment.gateway} | Amount: ${payment.amount} ${payment.currency} | User: ${payment.order.user.email} | Order: ${payment.order.orderNumber}`);
        if (payment.status === 'failed') {
            console.log(`   Response: ${payment.gatewayResponse?.substring(0, 100)}...`);
        }
    });

    // 2. Check ALL Orders created in the last 24 hours
    const recentOrders = await prisma.order.findMany({
        where: {
            createdAt: {
                gte: sevenDaysAgo
            }
        },
        include: {
            user: true,
            payment: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    console.log(`\n--- Recent Orders (Last 7 days): ${recentOrders.length} ---`);
    recentOrders.forEach(order => {
        const hasPayment = order.payment ? 'YES' : 'NO';
        console.log(`[${order.createdAt.toISOString()}] Order: ${order.orderNumber} | Status: ${order.status} | User: ${order.user.email} | Method: ${order.paymentMethod} | Payment Record: ${hasPayment}`);
    });

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
