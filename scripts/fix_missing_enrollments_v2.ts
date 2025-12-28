
import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- STARTING ENROLLMENT RECOVERY (OPTIMIZED) ---');

    // Fetch all lesson progress
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
    let skippedCount = 0;
    let errors = 0;
    let processed = 0;

    // Process in chunks to avoid overwhelming invalid connections if parallel (though here is serial)
    const pairs = Array.from(uniquePairs);

    for (const pair of pairs) {
        const [userId, courseId] = pair.split('|');
        processed++;

        if (processed % 100 === 0) console.log(`Processed ${processed}/${uniquePairs.size}...`);

        try {
            const existing = await prisma.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId,
                        courseId
                    }
                }
            });

            if (!existing) {
                // Calculate progress percentage
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
                        enrolledAt: new Date(2024, 0, 1),
                    }
                });
                recoveredCount++;
                // console.log(`Restored: ${userId} -> ${courseId} (${progress}%)`);
            } else {
                skippedCount++;
            }
        } catch (e) {
            // console.error(`Error on ${userId}: ${e}`);
            errors++;
        }
    }

    console.log(`\n--- RECOVERY COMPLETED ---`);
    console.log(`Total pairs checked: ${uniquePairs.size}`);
    console.log(`Already existed (Skipped): ${skippedCount}`);
    console.log(`NEWLY RESTORED: ${recoveredCount}`);
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
