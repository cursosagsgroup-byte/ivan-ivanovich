
import { prisma } from '../lib/prisma';

async function main() {
    const courseCount = await prisma.course.count();
    const studentCount = await prisma.user.count({ where: { role: 'STUDENT' } });
    const enrollmentCount = await prisma.enrollment.count();

    console.log(`\n--- DATABASE STATS ---`);
    console.log(`Total Products (Courses availalbe): ${courseCount}`);
    console.log(`Total Students (Users): ${studentCount}`);
    console.log(`Total Enrollments (Active connections): ${enrollmentCount}`);
    console.log(`Gap (Students without course): ${studentCount - enrollmentCount}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
