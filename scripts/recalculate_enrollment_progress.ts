import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- RECALCULATING ENROLLMENT PROGRESS ---\n');

    // Get all enrollments
    const enrollments = await prisma.enrollment.findMany({
        select: {
            id: true,
            userId: true,
            courseId: true,
            progress: true,
            user: { select: { email: true } },
            course: { select: { title: true } }
        }
    });

    console.log(`Total enrollments to process: ${enrollments.length}\n`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const enrollment of enrollments) {
        try {
            // Get all lessons for this course through modules
            const courseLessons = await prisma.lesson.findMany({
                where: {
                    module: {
                        courseId: enrollment.courseId
                    }
                },
                select: { id: true }
            });

            const totalLessons = courseLessons.length;

            if (totalLessons === 0) {
                // No lessons in course, skip
                skipped++;
                continue;
            }

            // Count completed lessons for this user in this course
            const completedLessons = await prisma.lessonProgress.count({
                where: {
                    userId: enrollment.userId,
                    lessonId: { in: courseLessons.map(l => l.id) },
                    completed: true
                }
            });

            // Calculate progress percentage
            const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

            // Only update if different from current progress
            if (progressPercentage !== enrollment.progress) {
                await prisma.enrollment.update({
                    where: { id: enrollment.id },
                    data: { progress: progressPercentage }
                });
                updated++;

                if (updated % 50 === 0) {
                    console.log(`Progress: ${updated} updated, ${skipped} skipped, ${errors} errors`);
                }
            } else {
                skipped++;
            }
        } catch (error) {
            console.error(`Error processing enrollment ${enrollment.id}:`, error);
            errors++;
        }
    }

    console.log('\n--- SUMMARY ---');
    console.log(`Total Processed: ${enrollments.length}`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped (already correct): ${skipped}`);
    console.log(`Errors: ${errors}`);

    // Final stats
    const finalStats = await prisma.enrollment.groupBy({
        by: ['progress'],
        _count: true,
        orderBy: { progress: 'asc' }
    });

    console.log('\n--- PROGRESS DISTRIBUTION ---');
    const complete = finalStats.find(s => s.progress === 100)?._count || 0;
    const inProgress = finalStats.filter(s => s.progress > 0 && s.progress < 100).reduce((sum, s) => sum + s._count, 0);
    const notStarted = finalStats.find(s => s.progress === 0)?._count || 0;

    console.log(`Complete (100%): ${complete}`);
    console.log(`In Progress (1-99%): ${inProgress}`);
    console.log(`Not Started (0%): ${notStarted}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
