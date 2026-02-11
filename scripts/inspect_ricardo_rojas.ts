import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- Searching for User "Ricardo" or "Rojas" ---');
    const users = await prisma.user.findMany({
        where: {
            OR: [
                { name: { contains: 'Ricardo', mode: 'insensitive' } },
                { name: { contains: 'Rojas', mode: 'insensitive' } },
                { email: { contains: 'ricardo', mode: 'insensitive' } },
                { email: { contains: 'rojas', mode: 'insensitive' } }
            ]
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
        },
        take: 10
    });

    if (users.length === 0) {
        console.log('No users found matching "Ricardo" or "Rojas"');
    } else {
        users.forEach(user => {
            console.log(`User found: ${user.name} (${user.email}) ID: ${user.id}`);
            if (user.orders.length === 0) {
                console.log('  No orders found for this user.');
            } else {
                user.orders.forEach(order => {
                    console.log(`  Order ${order.orderNumber} (ID: ${order.id}) - Status: ${order.status} - Amount: ${order.total} ${order.currency}`);
                    if (order.payment) {
                        console.log(`    Payment: ${order.payment.status} (Gateway: ${order.payment.gateway}) TransactionID: ${order.payment.transactionId}`);
                        console.log(`    Gateway Response: ${order.payment.gatewayResponse?.substring(0, 100)}...`);
                    } else {
                        console.log(`    No payment record linked.`);
                    }
                });
            }
        });
    }

    console.log('\n--- Checking Recent Pending Orders (System-wide) ---');
    const pendingOrders = await prisma.order.findMany({
        where: {
            status: 'pending'
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 5,
        include: {
            user: true,
            payment: true
        }
    });

    if (pendingOrders.length === 0) {
        console.log('No recent pending orders found system-wide.');
    } else {
        console.log(`Found ${pendingOrders.length} recent pending orders:`);
        pendingOrders.forEach(order => {
            console.log(`Order ${order.orderNumber} (ID: ${order.id}) - User: ${order.user.email} - Amount: ${order.total} ${order.currency} - Created: ${order.createdAt}`);
            if (order.payment) {
                console.log(`  Payment: ${order.payment.status} (Gateway: ${order.payment.gateway})`);
            } else {
                console.log(`  No payment record found.`);
            }
        });
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
