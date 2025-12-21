import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function compareQuizProgress() {
    // Get total quizzes in Team Leader course
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

    const totalQuizzes = course.modules.reduce((sum, m) => sum + m.quizzes.length, 0);
    console.log(`Total quizzes in "${course.title}": ${totalQuizzes}\n`);
    console.log('='.repeat(80));

    // Get all users with quiz attempts in this course
    const quizIds = course.modules.flatMap(m => m.quizzes.map(q => q.id));

    const attempts = await prisma.quizAttempt.findMany({
        where: {
            quizId: { in: quizIds }
        },
        include: {
            user: {
                select: { email: true, name: true }
            },
            quiz: {
                select: { title: true, id: true }
            }
        },
        orderBy: { attemptedAt: 'desc' }
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

    // Suspicious users (all 100%)
    console.log('\n🚨 USUARIOS SOSPECHOSOS (Todos al 100%):\n');
    const suspicious = Object.entries(byUser).filter(([_, data]) => {
        const allPerfect = data.attempts.every(a => a.score === 100);
        return allPerfect && data.attempts.length > 5;
    });

    suspicious.forEach(([userId, data]) => {
        // Get unique quizzes
        const uniqueQuizzes = new Set(data.attempts.map(a => a.quizId));
        console.log(`📧 ${data.user.email}`);
        console.log(`   Nombre: ${data.user.name || 'N/A'}`);
        console.log(`   Quizzes completados: ${uniqueQuizzes.size}/${totalQuizzes}`);
        console.log(`   Total intentos: ${data.attempts.length}`);
        console.log(`   Aprobados: ${data.attempts.filter(a => a.passed).length}`);
        console.log(`   Reprobados: ${data.attempts.filter(a => !a.passed).length}`);
        console.log(`   ⚠️  Todos al 100% - DATOS INCORRECTOS\n`);
    });

    // Examples of legitimate users with partial progress
    console.log('\n✅ EJEMPLOS DE USUARIOS LEGÍTIMOS (Progreso Parcial):\n');
    const legitimate = Object.entries(byUser)
        .filter(([_, data]) => {
            const uniqueQuizzes = new Set(data.attempts.map(a => a.quizId));
            const hasPartialProgress = uniqueQuizzes.size > 5 && uniqueQuizzes.size < totalQuizzes;
            const hasSomeFails = data.attempts.some(a => !a.passed);
            return hasPartialProgress || hasSomeFails;
        })
        .slice(0, 5); // Just show 5 examples

    legitimate.forEach(([userId, data]) => {
        const uniqueQuizzes = new Set(data.attempts.map(a => a.quizId));
        const avgScore = data.attempts.reduce((sum, a) => sum + a.score, 0) / data.attempts.length;

        console.log(`📧 ${data.user.email}`);
        console.log(`   Nombre: ${data.user.name || 'N/A'}`);
        console.log(`   Quizzes completados: ${uniqueQuizzes.size}/${totalQuizzes} ✅`);
        console.log(`   Total intentos: ${data.attempts.length}`);
        console.log(`   Aprobados: ${data.attempts.filter(a => a.passed).length}`);
        console.log(`   Reprobados: ${data.attempts.filter(a => !a.passed).length}`);
        console.log(`   Promedio: ${avgScore.toFixed(1)}%`);
        console.log(`   ✅ Progreso legítimo - pueden continuar\n`);
    });

    // Users with complete legitimate progress
    console.log('\n🎓 USUARIOS CON CURSO COMPLETADO (Legítimo):\n');
    const completed = Object.entries(byUser)
        .filter(([_, data]) => {
            const uniqueQuizzes = new Set(data.attempts.map(a => a.quizId));
            const isComplete = uniqueQuizzes.size >= totalQuizzes;
            const notAllPerfect = !data.attempts.every(a => a.score === 100);
            return isComplete && notAllPerfect;
        })
        .slice(0, 3);

    completed.forEach(([userId, data]) => {
        const uniqueQuizzes = new Set(data.attempts.map(a => a.quizId));
        const avgScore = data.attempts.reduce((sum, a) => sum + a.score, 0) / data.attempts.length;

        console.log(`📧 ${data.user.email}`);
        console.log(`   Nombre: ${data.user.name || 'N/A'}`);
        console.log(`   Quizzes completados: ${uniqueQuizzes.size}/${totalQuizzes} 🎉`);
        console.log(`   Total intentos: ${data.attempts.length}`);
        console.log(`   Aprobados: ${data.attempts.filter(a => a.passed).length}`);
        console.log(`   Reprobados: ${data.attempts.filter(a => !a.passed).length}`);
        console.log(`   Promedio: ${avgScore.toFixed(1)}%`);
        console.log(`   ✅ Completado legítimamente\n`);
    });

    await prisma.$disconnect();
}

compareQuizProgress().catch(console.error);
