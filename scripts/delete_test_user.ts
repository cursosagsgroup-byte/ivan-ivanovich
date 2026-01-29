
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@ketingmedia.com';
    console.log(`Searching for user: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: { orders: true, enrollments: true }
    });

    if (!user) {
        console.log('User not found.');
        return;
    }

    console.log(`User found: ${user.id} (${user.name})`);
    console.log(`- Orders: ${user.orders.length}`);
    console.log(`- Enrollments: ${user.enrollments.length}`);

    // Delete related data
    console.log('Deleting related data...');

    // Delete Enrollments
    const enrollments = await prisma.enrollment.deleteMany({ where: { userId: user.id } });
    console.log(`Deleted ${enrollments.count} enrollments.`);

    // Delete Order Items (indirectly via Orders, but safer to be explicit if no cascade)
    // Actually, typical Prisma cascade handles OrderItems if Order is deleted, but let's check.
    // If not, we iterate orders.
    for (const order of user.orders) {
        await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
    }
    console.log('Deleted order items.');

    // Delete Orders
    const orders = await prisma.order.deleteMany({ where: { userId: user.id } });
    console.log(`Deleted ${orders.count} orders.`);

    // Delete Accounts & Sessions (NextAuth)
    await prisma.account.deleteMany({ where: { userId: user.id } });
    await prisma.session.deleteMany({ where: { userId: user.id } });
    console.log('Deleted accounts and sessions.');

    // Delete User
    await prisma.user.delete({ where: { id: user.id } });
    console.log('✅ User deleted successfully.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
