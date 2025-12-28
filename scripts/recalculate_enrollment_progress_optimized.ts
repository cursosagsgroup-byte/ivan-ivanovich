import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- RECALCULATING ENROLLMENT PROGRESS (OPTIMIZED) ---\n');

    // Pre-load all lessons grouped by course
    console.log('Loading all course lessons...');
    const allLessons = await prisma.lesson.findMany({
        select: {
            id: true,
            module: {
                select: { courseId: true }
            }
        }
    });

    // Group lessons by courseId
    const lessonsByCourse = new Map<string, string[]>();
    for (const lesson of allLessons) {
        const courseId = lesson.module.courseId;
        if (!lessonsByCourse.has(courseId)) {
            lessonsByCourse.set(courseId, []);
        }
        lessonsByCourse.get(courseId)!.push(lesson.id);
    }

    console.log(`Loaded lessons for ${lessonsByCourse.size} courses`);

    // Get all enrollments
    const enrollments = await prisma.enrollment.findMany({
        select: {
            id: true,
            userId: true,
            courseId: true,
            progress: true
        }
    });

    console.log(`Processing ${enrollments.length} enrollments...\n`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const enrollment of enrollments) {
        try {
            const courseLessonIds = lessonsByCourse.get(enrollment.courseId) || [];
            const totalLessons = courseLessonIds.length;

            if (totalLessons === 0) {
                skipped++;
                continue;
            }

            // Count completed lessons for this user
            const completedLessons = await prisma.lessonProgress.count({
                where: {
                    userId: enrollment.userId,
                    lessonId: { in: courseLessonIds },
                    completed: true
                }
            });

            // Calculate progress percentage
            const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

            // Only update if different
            if (progressPercentage !== enrollment.progress) {
                await prisma.enrollment.update({
                    where: { id: enrollment.id },
                    data: { progress: progressPercentage }
                });
                updated++;

                if (updated % 100 === 0) {
                    console.log(`Progress: ${updated} updated`);
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
