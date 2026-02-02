
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


async function main() {
    const email = 'paauu.3@gmail.com';
    console.log(`Investigating for email: ${email}`);

    // 1. Check User (Removed incorrect 'payments' include)
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            orders: {
                orderBy: { createdAt: 'desc' },
                include: {
                    payment: true,
                    items: {
                        include: {
                            course: true
                        }
                    }
                }
            }
        }
    });

    if (!user) {
        console.log('❌ User not found in database.');
        // Try searching by name just in case
        const similarUsers = await prisma.user.findMany({
            where: {
                OR: [
                    { email: { contains: 'paauu', mode: 'insensitive' } },
                    { name: { contains: 'Paula', mode: 'insensitive' } }
                ]
            },
            select: { id: true, email: true, name: true }
        });

        if (similarUsers.length > 0) {
            console.log('Found similar users:', similarUsers);
        }
        return;
    }

    console.log('✅ User found:', { id: user.id, name: user.name, email: user.email });

    // 2. Check Order History
    console.log('\n--- Order History ---');
    if (user.orders.length === 0) {
        console.log('No orders found.');
    } else {
        user.orders.forEach(order => {
            console.log(`Order ID: ${order.id}`);
            console.log(`Status: ${order.status}`);
            console.log(`Total: ${order.total} ${order.currency}`);
            console.log(`Created: ${order.createdAt}`);
            console.log(`Payment Status: ${order.payment ? order.payment.status : 'No Payment Record'}`);
            if (order.payment) {
                console.log(`  Gateway: ${order.payment.gateway}`);
                console.log(`  Payment ID: ${order.payment.id}`);
                console.log(`  Provider Transaction ID: ${order.payment.transactionId}`);
                console.log(`  Amount: ${order.payment.amount} ${order.payment.currency}`);
                if (order.payment.gatewayResponse) {
                    console.log(`  Gateway Response Snippet: ${order.payment.gatewayResponse.substring(0, 200)}...`);
                }
            }
            order.items.forEach(item => {
                console.log(`  - Item: ${item.course.title} (${item.price} ${order.currency})`);
            });
            console.log('-------------------');
        });
    }
}


main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
