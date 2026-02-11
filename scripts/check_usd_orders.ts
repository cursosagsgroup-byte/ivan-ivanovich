import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- Checking for Recent USD Orders ---');

    // Check orders created in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const usdOrders = await prisma.order.findMany({
        where: {
            currency: 'USD',
            createdAt: {
                gte: sevenDaysAgo
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 10
    });

    if (usdOrders.length === 0) {
        console.log('✅ No USD orders found in the last 7 days.');
    } else {
        console.log(`⚠️ Found ${usdOrders.length} USD orders in the last 7 days:`);
        usdOrders.forEach(order => {
            console.log(`Order ${order.orderNumber} (ID: ${order.id}) - Amount: ${order.total} USD - Created: ${order.createdAt} - Status: ${order.status}`);
        });
    }

    // Also check payments table
    console.log('\n--- Checking for Recent USD Payments ---');
    const usdPayments = await prisma.payment.findMany({
        where: {
            currency: 'USD',
            createdAt: {
                gte: sevenDaysAgo
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 10
    });

    if (usdPayments.length === 0) {
        console.log('✅ No USD payments found in the last 7 days.');
    } else {
        console.log(`⚠️ Found ${usdPayments.length} USD payments in the last 7 days:`);
        usdPayments.forEach(payment => {
            console.log(`Payment ID: ${payment.id} - Order ID: ${payment.orderId} - Amount: ${payment.amount} USD - Status: ${payment.status} - Created: ${payment.createdAt}`);
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
