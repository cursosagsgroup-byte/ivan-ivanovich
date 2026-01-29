
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    console.log(`Checking activity since: ${fifteenDaysAgo.toISOString()}`);

    const newUsers = await prisma.user.findMany({
        where: {
            createdAt: {
                gte: fifteenDaysAgo,
            },
            role: 'STUDENT',
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
        }
    });

    console.log(`\nNew Students (Registered): ${newUsers.length}`);
    newUsers.forEach(u => console.log(`- ${u.name || 'No Name'} (${u.email}) at ${u.createdAt.toISOString()}`));

    const newEnrollments = await prisma.enrollment.findMany({
        where: {
            enrolledAt: {
                gte: fifteenDaysAgo,
            },
        },
        include: {
            user: true,
            course: true,
        }
    });

    console.log(`\nNew Enrollments: ${newEnrollments.length}`);
    newEnrollments.forEach(e => {
        console.log(`- User: ${e.user.email}, Course: ${e.course.title}, Date: ${e.enrolledAt.toISOString()}`);
    });

    const newOrders = await prisma.order.findMany({
        where: {
            createdAt: { gte: fifteenDaysAgo },
        },
        include: { user: true }
    });
    console.log(`\nNew Orders: ${newOrders.length}`);
    newOrders.forEach(o => console.log(`- Order #${o.orderNumber}: ${o.total} ${o.currency} by ${o.user.email}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
