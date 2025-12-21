import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkQuizAttempts() {
    const email = 'asaeltc@hotmail.com';
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return;

    console.log('User ID:', user.id);

    // Get all quizzes in the course
    const course = await prisma.course.findFirst({
        where: { title: { contains: 'Team Leader' } },
        include: {
            modules: {
                include: {
                    quizzes: true
                }
            }
        }
    });

    if (!course) return;

    console.log('\nChecking quizzes for course:', course.title);

    for (const module of course.modules) {
        for (const quiz of module.quizzes) {
            const attempt = await prisma.quizAttempt.findFirst({
                where: {
                    userId: user.id,
                    quizId: quiz.id
                },
                orderBy: { attemptedAt: 'desc' }
            });

            console.log(`\nQuiz: ${quiz.title} (${quiz.id})`);
            console.log(`Has attempt? ${attempt ? 'YES' : 'NO'}`);
            if (attempt) {
                console.log(`- Score: ${attempt.score}`);
                console.log(`- Passed: ${attempt.passed}`);
                console.log(`- Date: ${attempt.attemptedAt}`);
            }
        }
    }

    await prisma.$disconnect();
}

checkQuizAttempts().catch(console.error);
