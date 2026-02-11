import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- Searching for User "jlopez@afal.mx" ---');
    const user = await prisma.user.findFirst({
        where: {
            email: { contains: 'jlopez@afal.mx', mode: 'insensitive' }
        },
        include: {
            orders: {
                include: {
                    items: true,
                    payment: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    console.log('User found:', user.name, user.email, user.id);

    if (user.orders.length > 0) {
        user.orders.forEach(order => {
            console.log(`Order ${order.orderNumber} (ID: ${order.id}) - Status: ${order.status} - Amount: ${order.total} ${order.currency} - Created: ${order.createdAt}`);
            if (order.payment) {
                console.log(`  Payment: ${order.payment.status} (Gateway: ${order.payment.gateway}) TransactionID: ${order.payment.transactionId}`);
                console.log(`  Gateway Response: ${order.payment.gatewayResponse?.substring(0, 200)}...`);
            } else {
                console.log(`  No payment record linked.`);
            }
        });
    } else {
        console.log('No orders found for this user.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
