import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAllQuizAttempts() {
    // Get all quiz attempts
    const attempts = await prisma.quizAttempt.findMany({
        include: {
            user: {
                select: { email: true, name: true }
            },
            quiz: {
                select: { title: true }
            }
        },
        orderBy: { attemptedAt: 'desc' }
    });

    console.log(`Total quiz attempts in database: ${attempts.length}\n`);

    // Group by user
    const attemptsByUser = attempts.reduce((acc, attempt) => {
        const key = attempt.userId;
        if (!acc[key]) {
            acc[key] = {
                user: attempt.user,
                attempts: []
            };
        }
        acc[key].attempts.push(attempt);
        return acc;
    }, {} as Record<string, { user: any, attempts: any[] }>);

    // Display by user
    for (const [userId, data] of Object.entries(attemptsByUser)) {
        console.log(`\nUser: ${data.user.name || 'N/A'} (${data.user.email})`);
        console.log(`Total attempts: ${data.attempts.length}`);
        console.log(`Passed: ${data.attempts.filter(a => a.passed).length}`);
        console.log(`Failed: ${data.attempts.filter(a => !a.passed).length}`);
        console.log(`Average score: ${(data.attempts.reduce((sum, a) => sum + a.score, 0) / data.attempts.length).toFixed(1)}%`);

        // Check if all are 100%
        const allPerfect = data.attempts.every(a => a.score === 100);
        if (allPerfect && data.attempts.length > 5) {
            console.log(`⚠️  WARNING: ALL ${data.attempts.length} attempts are 100% - This looks suspicious!`);
        }
    }

    await prisma.$disconnect();
}

checkAllQuizAttempts().catch(console.error);
