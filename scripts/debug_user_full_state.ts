
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EMAIL = 'gtorres@wso-security.com';

async function main() {
    console.log(`🔍 Inspecting ${EMAIL}...`);

    const user = await prisma.user.findUnique({
        where: { email: EMAIL },
        include: {
            enrollments: {
                include: {
                    course: {
                        include: {
                            modules: {
                                orderBy: { order: 'asc' },
                                include: {
                                    lessons: {
                                        orderBy: { order: 'asc' },
                                        include: {
                                            progress: {
                                                where: { user: { email: EMAIL } } // Only this user's progress
                                            }
                                        }
                                    },
                                    quizzes: {
                                        include: {
                                            attempts: {
                                                where: { user: { email: EMAIL } }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    console.log(`User ID: ${user.id}`);

    for (const enrollment of user.enrollments) {
        console.log(`\n📚 Course: ${enrollment.course.title} (Progress: ${enrollment.progress}%)`);

        for (const module of enrollment.course.modules) {
            console.log(`  📦 Module ${module.order}: ${module.title}`);

            // Check Quizzes
            const quizzes = module.quizzes;
            if (quizzes.length > 0) {
                quizzes.forEach(q => {
                    const passed = q.attempts.some(a => a.passed);
                    const score = q.attempts.length > 0 ? q.attempts[0].score : 'N/A';
                    console.log(`     ❓ Quiz: ${q.title} | Passed: ${passed} | Score: ${score}`);
                });
            } else {
                console.log(`     (No Quizzes)`);
            }

            // Check Lessons (Videos)
            module.lessons.forEach(l => {
                const isCompleted = l.progress.length > 0 && l.progress[0].completed;
                console.log(`     🎬 Lesson: ${l.title} | Completed: ${isCompleted} | Type: ${l.videoUrl ? 'Video' : 'Text'}`);
            });
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
