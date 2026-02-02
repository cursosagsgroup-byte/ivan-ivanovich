
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'paauu.3@gmail.com';
    console.log(`Fixing order currency for: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            orders: {
                where: { status: 'pending' },
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        }
    });

    if (!user || user.orders.length === 0) {
        console.log('No pending order found to fix.');
        return;
    }

    const order = user.orders[0];
    console.log(`Found pending order: ${order.id} with currency: ${order.currency}`);

    if (order.currency !== 'MXN') {
        await prisma.order.update({
            where: { id: order.id },
            data: { currency: 'MXN' }
        });
        console.log('✅ Updated order currency to MXN');
    } else {
        console.log('Order already has correct currency.');
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
