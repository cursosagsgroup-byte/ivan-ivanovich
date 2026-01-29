
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Debugging Student Counts...\n');

    // 1. Fetch first 10 students (mimic dashboard default view)
    const students = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        include: { _count: { select: { enrollments: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10
    });

    console.log(`Found ${students.length} students (Top 10 new):`);
    for (const s of students) {
        console.log(`- ${s.email} | Role: ${s.role} | Enrollments: ${s._count.enrollments}`);
    }

    // 2. Fetch a specific user known to have enrollments (e.g. from wpgw_users)
    // Let's pick one from migration logs: cge5891@gmail.com
    const knownUser = await prisma.user.findFirst({
        where: { email: 'cge5891@gmail.com' },
        include: { _count: { select: { enrollments: true } }, enrollments: true }
    });

    if (knownUser) {
        console.log(`\nSpecific Check (cge5891@gmail.com):`);
        console.log(`- Role: ${knownUser.role}`);
        console.log(`- Enrollments Count: ${knownUser._count.enrollments}`);
        console.log(`- Enrollment IDs: ${knownUser.enrollments.map(e => e.id).join(', ')}`);
    } else {
        console.log('\n❌ Reference user cge5891@gmail.com not found.');
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
