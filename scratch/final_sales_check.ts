import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- Analyzing Sales for [cml1dc7d60000piral5rrf0to] ---');
    const courseId = 'cml1dc7d60000piral5rrf0to';
    const courseTitle = 'Protección Ejecutiva, Operatividad General y Logística Protectiva';

    const orders = await prisma.order.findMany({
        where: {
            status: 'completed',
            items: {
                some: {
                    courseId: courseId
                }
            }
        },
        select: {
            orderNumber: true,
            total: true,
            currency: true,
            createdAt: true,
            billingName: true
        }
    });

    console.log(`Found ${orders.length} completed orders for "${courseTitle}":`);
    orders.forEach(o => {
        console.log(`- Order ${o.orderNumber}: ${o.total} ${o.currency}, Customer: ${o.billingName}, Date: ${o.createdAt}`);
    });

    // Also check for COSTA RICA one again just in case I missed something
    const costaRicaId = 'cmmdxl4jq00002djx81x89qm2';
    const crOrders = await prisma.order.findMany({
        where: {
            status: 'completed',
            items: {
                some: {
                    courseId: costaRicaId
                }
            }
        }
    });
    console.log(`\nCompleted orders for Costa Rica version: ${crOrders.length}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
