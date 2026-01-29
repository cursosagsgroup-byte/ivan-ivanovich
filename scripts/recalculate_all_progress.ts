
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 STARTING GLOBAL PROGRESS RECALCULATION...');

    const enrollments = await prisma.enrollment.findMany({
        include: {
            user: true,
            course: {
                include: {
                    modules: {
                        include: {
                            lessons: true,
                            quizzes: true
                        }
                    }
                }
            }
        }
    });

    console.log(`Found ${enrollments.length} enrollments to check.`);

    let updatedCount = 0;

    for (const enrollment of enrollments) {
        let totalItems = 0;
        let completedItems = 0;

        // Flatten all items
        const lessonIds: string[] = [];
        const quizIds: string[] = [];

        for (const module of enrollment.course.modules) {
            // Count Lessons
            for (const lesson of module.lessons) {
                totalItems++;
                lessonIds.push(lesson.id);
            }
            // Count Quizzes
            for (const quiz of module.quizzes) {
                totalItems++;
                quizIds.push(quiz.id);
            }
        }

        if (totalItems === 0) continue;

        // Count Completed Lessons
        const completedLessons = await prisma.lessonProgress.count({
            where: {
                userId: enrollment.userId,
                lessonId: { in: lessonIds },
                completed: true
            }
        });

        // Count Passed Quizzes
        // Need to find unique passed quizzes for this user in this course's quiz list
        const passedAttempts = await prisma.quizAttempt.findMany({
            where: {
                userId: enrollment.userId,
                quizId: { in: quizIds },
                passed: true
            },
            select: { quizId: true }
        });

        const passedQuizIds = new Set(passedAttempts.map(a => a.quizId));
        const completedQuizzes = passedQuizIds.size;

        completedItems = completedLessons + completedQuizzes;


        const newProgress = Math.round((completedItems / totalItems) * 100);

        if (enrollment.progress !== newProgress || (newProgress < 100 && enrollment.completedAt != null)) {
            await prisma.enrollment.update({
                where: { id: enrollment.id },
                data: {
                    progress: newProgress,
                    completedAt: newProgress === 100 ? (enrollment.completedAt || new Date()) : null
                }
            });
            updatedCount++;
        }
    }

    console.log(`✅ Progress updated for ${updatedCount} enrollments.`);
    console.log('🎉 Recalculation Complete!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
