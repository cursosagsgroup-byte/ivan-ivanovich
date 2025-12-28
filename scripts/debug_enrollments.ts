
import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- DEBUGGING ENROLLMENTS ---');

    // 1. Counts
    const userCount = await prisma.user.count({ where: { role: 'STUDENT' } });
    const enrollmentCount = await prisma.enrollment.count();
    const orderCount = await prisma.order.count({ where: { status: 'completed' } });

    console.log(`Total Students: ${userCount}`);
    console.log(`Total Enrollments: ${enrollmentCount}`);
    console.log(`Total Completed Orders: ${orderCount}`);

    // 2. Users with Enrollments
    const usersWithEnrollments = await prisma.user.findMany({
        where: { role: 'STUDENT', enrollments: { some: {} } },
        take: 5,
        include: { _count: { select: { enrollments: true } } },
        orderBy: { enrollments: { _count: 'desc' } }
    });

    console.log('\n--- Top 5 Enrolled Students ---');
    if (usersWithEnrollments.length === 0) {
        console.log('NO students trace enrollments.');
    } else {
        usersWithEnrollments.forEach(u => {
            console.log(`- ${u.email} (${u.name}): ${u._count.enrollments} enrollments`);
        });
    }

    // 3. Users with Orders but NO Enrollments (The "Missing" ones)
    // This is tricky in prisma without raw query or iterating.
    // We'll get users who have orders but enrollment count is 0.

    const usersWithOrders = await prisma.user.findMany({
        where: {
            role: 'STUDENT',
            orders: { some: { status: 'completed' } },
            enrollments: { none: {} }
        },
        take: 5,
        select: { email: true, name: true, orders: { where: { status: 'completed' } } }
    });

    console.log('\n--- Students with Orders but NO Enrollments ---');
    if (usersWithOrders.length === 0) {
        console.log('No discrepancies found (everyone with an order has at least one enrollment).');
    } else {
        usersWithOrders.forEach(u => {
            console.log(`- ${u.email} (${u.name}): Has ${u.orders.length} completed orders but 0 enrollments.`);
        });
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
