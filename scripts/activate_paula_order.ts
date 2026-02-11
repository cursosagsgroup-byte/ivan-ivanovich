
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'paauu.3@gmail.com';
    console.log(`Activating order for: ${email}`);

    // 1. Find the pending order
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
        console.log('No pending order found.');
        return;
    }

    const order = user.orders[0];
    console.log(`Found pending order: ${order.id}`);

    // 2. Mark order as completed
    await prisma.order.update({
        where: { id: order.id },
        data: { status: 'completed' }
    });
    console.log('✅ Order marked as completed.');

    // 3. Create a fake "Manual Fix" payment record so everything looks consistent
    await prisma.payment.create({
        data: {
            orderId: order.id,
            gateway: 'manual_fix',
            transactionId: 'manual_fix_' + Date.now(),
            amount: 2500,
            currency: 'MXN',
            status: 'completed',
            gatewayResponse: '{"note": "Manually activated by support after webhook failure"}',
        }
    });
    console.log('✅ Payment record created (manual fix).');

    // 4. Enroll user in courses
    const fullOrder = await prisma.order.findUnique({
        where: { id: order.id },
        include: { items: true }
    });

    if (fullOrder && fullOrder.items) {
        for (const item of fullOrder.items) {
            const existingEnrollment = await prisma.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: fullOrder.userId,
                        courseId: item.courseId
                    }
                }
            });

            if (!existingEnrollment) {
                await prisma.enrollment.create({
                    data: {
                        userId: fullOrder.userId,
                        courseId: item.courseId,
                        progress: 0
                    }
                });
                console.log(`✅ Enrolled in course: ${item.courseId}`);
            } else {
                console.log(`User already enrolled in: ${item.courseId}`);
            }
        }
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
