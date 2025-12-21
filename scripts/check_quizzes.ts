import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkQuizzes() {
    try {
        // Get all courses with their modules and quizzes
        const courses = await prisma.course.findMany({
            include: {
                modules: {
                    include: {
                        quizzes: {
                            include: {
                                questions: true
                            }
                        }
                    }
                }
            }
        });

        console.log('\n📊 REPORTE DE QUIZZES POR CURSO\n');
        console.log('━'.repeat(60));

        for (const course of courses) {
            console.log(`\n📚 Curso: ${course.title}`);
            console.log(`   ID: ${course.id}`);

            let totalQuizzes = 0;
            let totalQuestions = 0;

            for (const module of course.modules) {
                if (module.quizzes.length > 0) {
                    console.log(`\n   📖 Módulo: ${module.title}`);
                    for (const quiz of module.quizzes) {
                        totalQuizzes++;
                        totalQuestions += quiz.questions.length;
                        console.log(`      ✓ Quiz: ${quiz.title}`);
                        console.log(`        - Preguntas: ${quiz.questions.length}`);
                        console.log(`        - Puntaje mínimo: ${quiz.passingScore}%`);
                    }
                }
            }

            console.log(`\n   📊 Total: ${totalQuizzes} quizzes, ${totalQuestions} preguntas`);
            console.log('   ' + '─'.repeat(55));
        }

        // Summary
        const totalQuizzesCount = await prisma.quiz.count();
        const totalQuestionsCount = await prisma.question.count();

        console.log('\n\n📈 RESUMEN GENERAL');
        console.log('━'.repeat(60));
        console.log(`Total de cursos: ${courses.length}`);
        console.log(`Total de quizzes: ${totalQuizzesCount}`);
        console.log(`Total de preguntas: ${totalQuestionsCount}`);
        console.log('━'.repeat(60) + '\n');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkQuizzes();
