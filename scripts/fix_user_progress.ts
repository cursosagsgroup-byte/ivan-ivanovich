
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = 'notificacionesluis@outlook.com';
    const courseTitle = 'Team Leader en Protección Ejecutiva';

    console.log(`Fixing progress for ${email} in course ${courseTitle}`);

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.error('User not found');
        return;
    }

    const course = await prisma.course.findFirst({
        where: { title: courseTitle },
        include: {
            modules: {
                include: {
                    lessons: true,
                    quizzes: true
                }
            }
        }
    });

    if (!course) {
        console.error('Course not found');
        return;
    }

    // Sort modules by order
    const modules = course.modules.sort((a, b) => a.order - b.order);

    // Target: Complete everything up to and including "Puesta a Punto" (Order 13)
    // Actually, simply ensure everything with Order <= 13 is completed.

    const targetOrder = 13;

    for (const module of modules) {
        if (module.order > targetOrder) continue;

        console.log(`Processing Module: ${module.title} (Order: ${module.order})`);

        // Complete Lessons
        for (const lesson of module.lessons) {
            await prisma.lessonProgress.upsert({
                where: {
                    userId_lessonId: {
                        userId: user.id,
                        lessonId: lesson.id
                    }
                },
                update: {
                    completed: true,
                    completedAt: new Date()
                },
                create: {
                    userId: user.id,
                    lessonId: lesson.id,
                    completed: true,
                    completedAt: new Date()
                }
            });
            console.log(`  Marked lesson '${lesson.title}' as completed.`);
        }

        // Pass Quizzes
        for (const quiz of module.quizzes) {
            // Check if already passed
            const existingPass = await prisma.quizAttempt.findFirst({
                where: {
                    userId: user.id,
                    quizId: quiz.id,
                    passed: true
                }
            });

            if (!existingPass) {
                await prisma.quizAttempt.create({
                    data: {
                        userId: user.id,
                        quizId: quiz.id,
                        score: 100,
                        passed: true,
                        answers: '{}', // Dummy answers
                        attemptedAt: new Date()
                    }
                });
                console.log(`  Created passing attempt for quiz '${quiz.title}'.`);
            } else {
                console.log(`  Quiz '${quiz.title}' already passed.`);
            }
        }
    }

    console.log('Progress fix completed.');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
