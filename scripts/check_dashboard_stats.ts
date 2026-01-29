
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('📊 Dashboard Data Preview...\n');

    // 1. Student Count (as per dashboard)
    const studentCount = await prisma.user.count({ where: { role: 'STUDENT' } });
    console.log(`[Dashboard] Total Students (User role): ${studentCount}`);

    // 2. Active Enrollments
    const enrollmentCount = await prisma.enrollment.count();
    console.log(`[Real] Total Enrollments: ${enrollmentCount}`);

    // 3. Certified (Graduates)
    const graduates = await prisma.enrollment.count({ where: { progress: 100 } });
    console.log(`[Real] Graduates (100%): ${graduates}`);

    // 4. Breakdown by Course
    const courses = await prisma.course.findMany({
        include: { _count: { select: { enrollments: true } } }
    });
    console.log('\nCourse Breakdown:');
    courses.forEach(c => {
        console.log(`- ${c.title}: ${c._count.enrollments}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
