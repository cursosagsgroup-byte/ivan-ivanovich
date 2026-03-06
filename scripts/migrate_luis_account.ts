
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SOURCE_EMAIL = 'notificacionesluis@outlook.com';
const TARGET_EMAIL = 'LuisRamirezV@proton.me';

async function main() {
    console.log(`🚀 Starting migration from ${SOURCE_EMAIL} to ${TARGET_EMAIL}...`);

    const sourceUser = await prisma.user.findUnique({
        where: { email: SOURCE_EMAIL },
        include: {
            enrollments: true,
            lessonProgress: true,
            quizAttempts: true,
            certificates: true
        }
    });

    const targetUser = await prisma.user.findUnique({
        where: { email: TARGET_EMAIL },
        include: {
            enrollments: true
        }
    });

    if (!sourceUser) throw new Error('Source user not found');
    if (!targetUser) throw new Error('Target user not found');

    const sourceId = sourceUser.id;
    const targetId = targetUser.id;

    console.log(`Source ID: ${sourceId}`);
    console.log(`Target ID: ${targetId}`);

    // 1. Migrate Enrollments
    console.log('\n📚 Migrating Enrollments...');
    for (const enrollment of sourceUser.enrollments) {
        const exists = targetUser.enrollments.some(e => e.courseId === enrollment.courseId);
        if (!exists) {
            await prisma.enrollment.create({
                data: {
                    userId: targetId,
                    courseId: enrollment.courseId,
                    progress: enrollment.progress,
                    enrolledAt: enrollment.enrolledAt,
                    completedAt: enrollment.completedAt
                }
            });
            console.log(`  ✅ Enrolled in course: ${enrollment.courseId}`);
        } else {
            // Update existing enrollment if source has more progress
            const targetEnrollment = targetUser.enrollments.find(e => e.courseId === enrollment.courseId);
            if (enrollment.progress > (targetEnrollment?.progress || 0)) {
                await prisma.enrollment.update({
                    where: { userId_courseId: { userId: targetId, courseId: enrollment.courseId } },
                    data: { progress: enrollment.progress }
                });
                console.log(`  🔄 Updated progress for course: ${enrollment.courseId} (${enrollment.progress}%)`);
            } else {
                console.log(`  ⏭️ Enrollment already exists for course: ${enrollment.courseId}`);
            }
        }
    }

    // 2. Migrate Lesson Progress
    console.log('\n🎬 Migrating Lesson Progress...');
    let progressCount = 0;
    for (const progress of sourceUser.lessonProgress) {
        try {
            await prisma.lessonProgress.upsert({
                where: { userId_lessonId: { userId: targetId, lessonId: progress.lessonId } },
                update: {
                    completed: progress.completed,
                    completedAt: progress.completedAt
                },
                create: {
                    userId: targetId,
                    lessonId: progress.lessonId,
                    completed: progress.completed,
                    completedAt: progress.completedAt
                }
            });
            progressCount++;
        } catch (e) {
            console.error(`  ❌ Error migrating progress for lesson ${progress.lessonId}:`, e);
        }
    }
    console.log(`  ✅ Migrated ${progressCount} lesson progress records.`);

    // 3. Migrate Quiz Attempts
    console.log('\n📝 Migrating Quiz Attempts...');
    let quizCount = 0;
    for (const attempt of sourceUser.quizAttempts) {
        await prisma.quizAttempt.create({
            data: {
                userId: targetId,
                quizId: attempt.quizId,
                score: attempt.score,
                passed: attempt.passed,
                answers: attempt.answers,
                attemptedAt: attempt.attemptedAt
            }
        });
        quizCount++;
    }
    console.log(`  ✅ Migrated ${quizCount} quiz attempts.`);

    // 4. Migrate Certificates
    console.log('\n🎓 Migrating Certificates...');
    let certCount = 0;
    for (const cert of sourceUser.certificates) {
        await prisma.certificate.create({
            data: {
                userId: targetId,
                courseId: cert.courseId,
                issuedAt: cert.issuedAt,
                certificateUrl: cert.certificateUrl
            }
        });
        certCount++;
    }
    console.log(`  ✅ Migrated ${certCount} certificates.`);

    console.log('\n✨ Migration completed successfully!');
}

main()
    .catch(e => console.error('Migration failed:', e))
    .finally(async () => await prisma.$disconnect());
