
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting quiz option cleanup...');

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

    let fixedCount = 0;

    for (const q of questions) {
        let options: any[] = [];
        try {
            options = JSON.parse(q.options as string);
        } catch (e) {
            console.error(`Failed to parse options for question: ${q.question}`);
            continue;
        }

        if (options.length < 3) continue; // Must have at least 3 options (2 junk + 1 real) to be a candidate

        const firstText = options[0].text.toLowerCase().trim();
        const secondText = options[1].text.toLowerCase().trim();

        const isSpanishJunk = (firstText === 'verdadero' && secondText === 'falso');
        const isEnglishJunk = (firstText === 'true' && secondText === 'false');

        if (isSpanishJunk || isEnglishJunk) {
            // Triple check: Make sure correct answer is NOT one of these
            const correctAnswerLower = q.correctAnswer.toLowerCase().trim();
            if (correctAnswerLower === firstText || correctAnswerLower === secondText) {
                console.log(`SKIPPING (Safety): Question '${q.question}' has correct answer matching junk option.`);
                continue;
            }

            // Remove first 2 options
            const newOptions = options.slice(2);

            // Update DB
            await prisma.question.update({
                where: { id: q.id },
                data: {
                    options: JSON.stringify(newOptions)
                }
            });

            console.log(`[FIXED] Course: ${q.quiz.module.course.title} | Q: ${q.question.substring(0, 30)}...`);
            console.log(`   Removed '${options[0].text}' and '${options[1].text}'. Remaining: ${newOptions.length}`);
            fixedCount++;
        }
    }

    console.log(`\nCleanup complete. Fixed ${fixedCount} questions.`);
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
