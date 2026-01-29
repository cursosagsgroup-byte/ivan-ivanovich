
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking for questions where True/False is actually the CORRECT answer...');

    // We will check all questions in all courses.
    const questions = await prisma.question.findMany({
        select: {
            id: true,
            question: true,
            options: true,
            correctAnswer: true,
            quiz: {
                select: {
                    title: true,
                    module: {
                        select: {
                            title: true,
                            course: {
                                select: {
                                    title: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    let legitimateTrueFalseCount = 0;

    for (const q of questions) {
        const lowerAnswer = q.correctAnswer.toLowerCase();

        if (lowerAnswer === 'verdadero' || lowerAnswer === 'falso' ||
            lowerAnswer === 'true' || lowerAnswer === 'false') {
            console.log(`[LEGITIMATE T/F] Course: ${q.quiz.module.course.title} | Q: ${q.question}`);
            console.log(`   Correct Answer: ${q.correctAnswer}`);
            legitimateTrueFalseCount++;
        }
    }

    if (legitimateTrueFalseCount === 0) {
        console.log('No questions found where the correct answer is True/False/Verdadero/Falso.');
        console.log('It is safe to assume "Verdadero/Falso" options are extraneous in all detected cases.');
    } else {
        console.log(`WARNING: Found ${legitimateTrueFalseCount} questions that ARE legitimate True/False.`);
        console.log('We must NOT remove options from these specifically.');
    }
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
