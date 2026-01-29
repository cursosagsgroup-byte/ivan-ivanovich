
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const courseTitle = 'Team Leader en Protección Ejecutiva';
    console.log(`Inspecting quizzes for course: ${courseTitle}`);

    const course = await prisma.course.findFirst({
        where: { title: courseTitle },
        include: {
            modules: {
                orderBy: { order: 'asc' },
                include: {
                    quizzes: {
                        include: {
                            questions: {
                                orderBy: { order: 'asc' }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!course) {
        console.log('Course not found');
        return;
    }

    let quizCount = 0;
    for (const module of course.modules) {
        if (module.quizzes.length > 0) {
            console.log(`\nModule: ${module.title}`);
            for (const quiz of module.quizzes) {
                quizCount++;
                console.log(`  Quiz: ${quiz.title}`);
                for (const q of quiz.questions) {
                    console.log(`    Question: ${q.question}`);
                    console.log(`      Type: ${q.type}`);
                    console.log(`      Options: ${q.options}`);
                    console.log(`      Correct Answer: ${q.correctAnswer}`);
                    console.log('      ---');
                }
            }
        }
    }
    console.log(`\nTotal Quizzes Found: ${quizCount}`);
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
