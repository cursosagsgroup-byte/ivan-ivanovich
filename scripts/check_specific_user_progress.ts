
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EMAIL = process.argv[2] || 'eligiofernandez@gmail.com';

async function main() {
    console.log(`🔍 Checking progress for: ${EMAIL}`);

    const user = await prisma.user.findUnique({
        where: { email: EMAIL },
        include: {
            enrollments: {
                include: {
                    course: true
                }
            }
        }
    });

    if (!user) {
        console.log('❌ User not found');
        return;
    }

    console.log(`✅ User found: ${user.name} (${user.id})`);
    console.log(`📚 Enrollments: ${user.enrollments.length}`);

    for (const enrollment of user.enrollments) {
        console.log(`\n  📘 Course: ${enrollment.course.title}`);
        console.log(`     Progress: ${enrollment.progress}%`);
        console.log(`     Enrolled At: ${enrollment.enrolledAt}`);

        // Check details
        const lessonsCompleted = await prisma.lessonProgress.count({
            where: {
                userId: user.id,
                completed: true,
                lesson: {
                    module: {
                        courseId: enrollment.courseId
                    }
                }
            }
        });

        const quizzesPassed = await prisma.quizAttempt.count({
            where: {
                userId: user.id,
                passed: true,
                quiz: {
                    module: {
                        courseId: enrollment.courseId
                    }
                }
            }
        });

        console.log(`     ✅ Lessons Completed: ${lessonsCompleted}`);
        console.log(`     🏆 Quizzes Passed: ${quizzesPassed}`);
    }

    await prisma.$disconnect();
}

main().catch(console.error);
