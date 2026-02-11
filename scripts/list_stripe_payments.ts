
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Successful Stripe Payments ---');
    const payments = await prisma.payment.findMany({
        where: { gateway: 'stripe', status: 'completed' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { order: { include: { user: true } } }
    });

    if (payments.length === 0) {
        console.log('No successful Stripe payments found.');
    } else {
        payments.forEach(p => {
            console.log(`Date: ${p.createdAt}`);
            console.log(`Amount: ${p.amount} ${p.currency}`);
            console.log(`User: ${p.order.user.email}`);
            console.log(`Transaction: ${p.transactionId}`);
            console.log('---');
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
