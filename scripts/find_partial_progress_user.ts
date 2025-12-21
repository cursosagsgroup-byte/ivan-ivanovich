import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findLowProgressUser() {
    // Get Team Leader course
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

    if (!course) {
        console.log('Course not found');
        return;
    }

    const totalQuizzes = course.modules.reduce((sum, m) => sum + m.quizzes.length, 0);
    const quizIds = course.modules.flatMap(m => m.quizzes.map(q => q.id));

    // Get all quiz attempts
    const attempts = await prisma.quizAttempt.findMany({
        where: {
            quizId: { in: quizIds }
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true
                }
            }
        }
    });

    // Group by user
    const byUser = attempts.reduce((acc, attempt) => {
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

    // Find users with LOW to MEDIUM progress (25% - 70%)
    const lowProgressUsers = Object.entries(byUser)
        .filter(([_, data]) => {
            const uniqueQuizzes = new Set(data.attempts.map(a => a.quizId));
            const progressPercent = (uniqueQuizzes.size / totalQuizzes) * 100;
            const notAllPerfect = !data.attempts.every(a => a.score === 100);
            return progressPercent >= 25 && progressPercent <= 70 && notAllPerfect;
        })
        .sort((a, b) => {
            const aQuizzes = new Set(a[1].attempts.map(att => att.quizId)).size;
            const bQuizzes = new Set(b[1].attempts.map(att => att.quizId)).size;
            return bQuizzes - aQuizzes; // More quizzes first
        });

    console.log('USUARIOS CON PROGRESO BAJO-MEDIO (25%-70% del curso):\n');
    console.log('='.repeat(80));

    lowProgressUsers.slice(0, 15).forEach(([userId, data], index) => {
        const uniqueQuizzes = new Set(data.attempts.map(a => a.quizId));
        const progressPercent = (uniqueQuizzes.size / totalQuizzes) * 100;
        const avgScore = data.attempts.reduce((sum, a) => sum + a.score, 0) / data.attempts.length;
        const passed = data.attempts.filter(a => a.passed).length;
        const failed = data.attempts.filter(a => !a.passed).length;

        console.log(`\n${index + 1}. ${data.user.name || 'N/A'}`);
        console.log(`   Email: ${data.user.email}`);
        console.log(`   Progreso: ${uniqueQuizzes.size}/${totalQuizzes} quizzes (${progressPercent.toFixed(1)}%)`);
        console.log(`   Total intentos: ${data.attempts.length}`);
        console.log(`   Aprobados: ${passed} | Reprobados: ${failed}`);
        console.log(`   Promedio: ${avgScore.toFixed(1)}%`);
    });

    await prisma.$disconnect();
}

findLowProgressUser().catch(console.error);
