
import { prisma } from '@/lib/prisma';

async function investigatePayments() {
    try {
        console.log('Searching for recent payments and orders...');

        // Find recent payments of amount 25
        const payments = await prisma.payment.findMany({
            where: {
                amount: {
                    in: [25, 2500] // Check both just in case
                },
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
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

        console.log(`Found ${payments.length} payments:`);
        payments.forEach(p => {
            console.log(`- ID: ${p.id}`);
            console.log(`  Amount: ${p.amount} ${p.currency}`);
            console.log(`  Status: ${p.status}`);
            console.log(`  Order: ${p.order?.orderNumber} (${p.order?.billingEmail})`);
            console.log(`  User: ${p.order?.user?.email}`);
            console.log(`  Time: ${p.createdAt.toISOString()}`);
            console.log('---');
        });

        // Also check orders logic
        const orders = await prisma.order.findMany({
            where: {
                OR: [
                    { total: 25 },
                    { total: 0 }
                ],
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        console.log(`\nRecent Orders (Total 0 or 25):`);
        orders.forEach(o => {
            console.log(`- Order: ${o.orderNumber}`);
            console.log(`  Total: ${o.total}`);
            console.log(`  Status: ${o.status}`);
            console.log(`  User: ${o.billingEmail}`);
            console.log('---');
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

investigatePayments();
