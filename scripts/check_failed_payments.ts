
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'paauu.3@gmail.com';
    console.log(`Checking failed payments for: ${email}`);

    // Find user first
    const user = await prisma.user.findUnique({
        where: { email },
        include: { orders: { select: { id: true } } }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    const orderIds = user.orders.map(o => o.id);

    // Find any payments (successful or failed) linked to these orders
    const payments = await prisma.payment.findMany({
        where: {
            orderId: { in: orderIds }
        }
    });

    if (payments.length === 0) {
        console.log('No payment records found (failed or success) for this user.');
    } else {
        console.log('Found payments:');
        console.log(payments);
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
