
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const lessonTitle = 'Borrador de la lección';
    console.log(`Inspecting lesson: "${lessonTitle}" (OPTIMIZED)...`);

    const lessons = await prisma.lesson.findMany({
        where: { title: lessonTitle },
        select: { id: true, module: { select: { courseId: true, course: { select: { title: true } } } } }
    });

    if (lessons.length === 0) {
        console.log("No lesson found.");
        return;
    }

    for (const lesson of lessons) {
        console.log(`\nChecking Course: ${lesson.module.course.title} (ID: ${lesson.module.courseId})`);

        // Find users enrolled in this course with high progress (>90%)
        const enrolledUsers = await prisma.enrollment.findMany({
            where: {
                courseId: lesson.module.courseId,
                progress: { gt: 90 }
            },
            select: {
                userId: true,
                progress: true,
                user: { select: { email: true, name: true } }
            }
        });

        console.log(`Found ${enrolledUsers.length} users with >90% progress.`);

        // Find who has completed this specific lesson
        const completedProgress = await prisma.lessonProgress.findMany({
            where: {
                lessonId: lesson.id,
                completed: true,
                userId: { in: enrolledUsers.map(u => u.userId) }
            },
            select: { userId: true }
        });

        const completedUserIds = new Set(completedProgress.map(lz => lz.userId));

        const stuckUsers = enrolledUsers.filter(u => !completedUserIds.has(u.userId));

        if (stuckUsers.length > 0) {
            console.log(`Found ${stuckUsers.length} STUCK users:`);
            console.table(stuckUsers.map(u => ({
                Name: u.user.name,
                Email: u.user.email,
                Progress: u.progress
            })));
        } else {
            console.log("No stuck users found.");
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
