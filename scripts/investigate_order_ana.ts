
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'anakarenmoraneuroza@gmail.com';
    console.log(`Investigating user: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            orders: {
                orderBy: { createdAt: 'desc' },
                include: {
                    items: {
                        include: {
                            course: true
                        }
                    },
                    payment: true
                }
            }
        }
    });

    if (!user) {
        console.log('User not found.');
        return;
    }

    console.log(`User ID: ${user.id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Role: ${user.role}`);

    if (user.orders.length === 0) {
        console.log('No orders found for this user.');
    } else {
        console.log(`Found ${user.orders.length} orders:`);
        user.orders.forEach((order, index) => {
            console.log(`\nOrder #${index + 1}:`);
            console.log(`  ID: ${order.id}`);
            console.log(`  Order Number: ${order.orderNumber}`);
            console.log(`  Status: ${order.status}`);
            console.log(`  Total: ${order.total} ${order.currency}`);
            console.log(`  Created At: ${order.createdAt}`);
            console.log(`  Payment Method: ${order.paymentMethod}`);

            if (order.payment) {
                console.log(`  Payment Details:`);
                console.log(`    Gateway: ${order.payment.gateway}`);
                console.log(`    Status: ${order.payment.status}`);
                console.log(`    Transaction ID: ${order.payment.transactionId}`);
                console.log(`    Gateway Response: ${order.payment.gatewayResponse ? order.payment.gatewayResponse.substring(0, 200) + '...' : 'N/A'}`);
            } else {
                console.log(`  No payment record found for this order.`);
            }

            console.log(`  Items:`);
            order.items.forEach(item => {
                console.log(`    - ${item.course.title} (${item.price} ${order.currency})`);
            });
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
