
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking Progress Data in Database...');

    // Check for completed lessons
    const completedLessons = await prisma.lessonProgress.count({
        where: { completed: true }
    });

    // Check for enrollments with progress > 0
    const activeEnrollments = await prisma.enrollment.count({
        where: { progress: { gt: 0 } }
    });

    console.log(`📊 Progress Statistics:`);
    console.log(`   Completed Lessons (Global): ${completedLessons}`);
    console.log(`   Enrollments with Progress: ${activeEnrollments}`);

    if (activeEnrollments > 0) {
        const sample = await prisma.enrollment.findFirst({
            where: { progress: { gt: 0 } },
            include: { user: { select: { email: true } }, course: { select: { title: true } } }
        });
        console.log('\n📝 Sample Active User:', {
            email: sample?.user.email,
            course: sample?.course.title,
            progress: `${sample?.progress}%`
        });
    } else {
        console.log('\n⚠️  No progress found. All enrollments appear to be at 0%.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
