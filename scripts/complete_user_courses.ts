
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'djbeuvrin@gmail.com';
    console.log(`--- Completing courses for ${email} ---`);
    
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            enrollments: {
                include: {
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
            }
        }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    console.log(`User found: ${user.name || user.email} (ID: ${user.id})`);

    for (const enrollment of user.enrollments) {
        console.log(`\nProcessing Course: ${enrollment.course.title} (ID: ${enrollment.courseId})`);
        
        // 1. Mark all lessons as completed
        for (const module of enrollment.course.modules) {
            for (const lesson of module.lessons) {
                await prisma.lessonProgress.upsert({
                    where: {
                        userId_lessonId: {
                            userId: user.id,
                            lessonId: lesson.id
                        }
                    },
                    update: { completed: true },
                    create: {
                        userId: user.id,
                        lessonId: lesson.id,
                        completed: true
                    }
                });
            }

            // 2. Mark all quizzes as passed (100%)
            for (const quiz of module.quizzes) {
                await prisma.quizAttempt.create({
                    data: {
                        userId: user.id,
                        quizId: quiz.id,
                        score: 100,
                        passed: true,
                        answers: '{}' // JSON string
                    }
                });
            }
        }

        // 3. Update enrollment progress
        await prisma.enrollment.update({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: enrollment.courseId
                }
            },
            data: { progress: 100 }
        });
        
        console.log(`✅ Course "${enrollment.course.title}" marked as 100% completed.`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
