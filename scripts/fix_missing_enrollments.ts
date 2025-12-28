
import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- STARTING ENROLLMENT RECOVERY ---');

    // 1. Recover from LessonProgress
    // Find all unique (userId, courseId) pairs from LessonProgress where Enrollment doesn't exist
    // Since we can't do complex joins or "NOT EXISTS" easily in compact Prisma queries without raw SQL,
    // we will fetch candidate progress records and filter in JS (assuming dataset is manageable, which it seems to be).

    // Fetch all lesson progress with their lesson->module->course relation
    const allProgress = await prisma.lessonProgress.findMany({
        select: {
            userId: true,
            lesson: {
                select: {
                    module: {
                        select: {
                            courseId: true
                        }
                    }
                }
            }
        }
    });

    const uniquePairs = new Set<string>();
    allProgress.forEach(p => {
        if (p.lesson?.module?.courseId) {
            uniquePairs.add(`${p.userId}|${p.lesson.module.courseId}`);
        }
    });

    console.log(`Found ${uniquePairs.size} unique User-Course pairs in LessonProgress.`);

    let recoveredCount = 0;
    let errors = 0;

    for (const pair of uniquePairs) {
        const [userId, courseId] = pair.split('|');

        // Check if enrollment exists
        const existing = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });

        if (!existing) {
            console.log(`Restoring enrollment for User ${userId} -> Course ${courseId}`);
            try {
                // Calculate progress percentage for accurate restoration
                const totalLessons = await prisma.lesson.count({
                    where: { module: { courseId } }
                });

                const completedLessons = await prisma.lessonProgress.count({
                    where: {
                        userId,
                        completed: true,
                        lesson: { module: { courseId } }
                    }
                });

                const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

                await prisma.enrollment.create({
                    data: {
                        userId,
                        courseId,
                        progress: progress,
                        enrolledAt: new Date(2024, 0, 1), // Default to old date or we could try to find earliest progress
                        // completedAt: progress === 100 ? new Date() : null // Optional: approximate completion
                    }
                });
                recoveredCount++;
            } catch (e) {
                console.error(`Failed to create enrollment: ${e}`);
                errors++;
            }
        }
    }

    console.log(`\n--- RECOVERY SUMMARY ---`);
    console.log(`Processed candidates: ${uniquePairs.size}`);
    console.log(`Restored Enrollments: ${recoveredCount}`);
    console.log(`Errors: ${errors}`);
    console.log(`------------------------`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
