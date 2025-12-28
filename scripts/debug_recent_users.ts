
import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- CHECKING RECENT USERS ---');

    const recentStudents = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { enrollments: true }
            }
        }
    });

    console.log('Top 20 most recent students:');
    recentStudents.forEach(u => {
        console.log(`- ${u.email} (Joined: ${u.createdAt.toISOString().split('T')[0]}): ${u._count.enrollments} enrollments`);
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
