
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking for Completed Enrollments...');

    // Check for 100% progress OR completedAt not null
    const completedEnrollments = await prisma.enrollment.findMany({
        where: {
            OR: [
                { progress: 100 },
                { completedAt: { not: null } }
            ]
        },
        include: {
            user: { select: { email: true, name: true } },
            course: { select: { title: true } }
        }
    });

    console.log(`📊 Found ${completedEnrollments.length} completed enrollments eligible for certificates.`);

    if (completedEnrollments.length > 0) {
        console.log('📝 Sample Eligible Users:', completedEnrollments.slice(0, 5).map(e => ({
            user: e.user.email,
            course: e.course.title,
            progress: e.progress,
            completedAt: e.completedAt
        })));
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
