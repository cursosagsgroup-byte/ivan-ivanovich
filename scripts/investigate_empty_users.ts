
import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- INVESTIGATING "EMPTY" STUDENTS ---');

    // 1. Get users with NO enrollments
    // We'll fetch ID and Email
    const emptyUsers = await prisma.user.findMany({
        where: {
            role: 'STUDENT',
            enrollments: { none: {} }
        },
        select: { id: true, email: true, createdAt: true, orders: { select: { status: true, id: true } } }
    });

    console.log(`Total Empty Students: ${emptyUsers.length}`);

    // 2. Analyze by Domain
    const domainCounts: Record<string, number> = {};

    emptyUsers.forEach(u => {
        const domain = u.email.split('@')[1];
        if (domain) {
            domainCounts[domain] = (domainCounts[domain] || 0) + 1;
        }
    });

    // Sort domains by count
    const sortedDomains = Object.entries(domainCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 15);

    console.log('\nTop 15 Email Domains of Empty Users:');
    sortedDomains.forEach(([domain, count]) => {
        console.log(`- @${domain}: ${count} users`);
    });

    // 3. Check for Pending/Failed orders
    let usersWithPendingOrders = 0;
    emptyUsers.forEach(u => {
        if (u.orders.length > 0) {
            usersWithPendingOrders++;
        }
    });

    console.log(`\nUsers with Orders (Pending/Failed) but NO active Enrollment: ${usersWithPendingOrders}`);

    // 4. Sample check of a VW user (common case)
    const vwUser = emptyUsers.find(u => u.email.includes('vw.com.mx'));
    if (vwUser) {
        console.log(`\nSample VW User (${vwUser.email}) joined: ${vwUser.createdAt.toISOString()}`);
        console.log(`Orders found: ${vwUser.orders.length}`);
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
