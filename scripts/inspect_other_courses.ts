
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const courseTitles = [
        'Contravigilancia Para Protección Ejecutiva',
        'Team Leader in Executive Protection',
        'Counter Surveillance for Executive Protection'
    ];

    for (const title of courseTitles) {
        console.log(`\n==================================================`);
        console.log(`Inspecting quizzes for course: ${title}`);
        console.log(`==================================================`);

        const course = await prisma.course.findFirst({
            where: { title: title },
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
            console.log(`Course '${title}' not found`);
            continue;
        }

        let quizCount = 0;
        let suspiciousCount = 0;

        for (const module of course.modules) {
            if (module.quizzes.length > 0) {
                for (const quiz of module.quizzes) {
                    quizCount++;
                    for (const q of quiz.questions) {
                        // Check if first two options are Verdadero/Falso (or True/False)
                        let options = [];
                        try {
                            options = JSON.parse(q.options as string);
                        } catch (e) {
                            options = [];
                        }

                        if (options.length >= 2) {
                            const firstText = options[0].text.toLowerCase();
                            const secondText = options[1].text.toLowerCase();

                            if ((firstText === 'verdadero' || firstText === 'true') &&
                                (secondText === 'falso' || secondText === 'false')) {
                                console.log(`  [SUSPICIOUS] Quiz: ${quiz.title} | Question: ${q.question.substring(0, 50)}...`);
                                suspiciousCount++;
                                // Log first suspicious instance fully
                                if (suspiciousCount === 1) {
                                    console.log(`    Sample Options: ${q.options}`);
                                }
                            }
                        }
                    }
                }
            }
        }

        if (suspiciousCount === 0) {
            console.log("  >>> No suspicious 'Verdadero/Falso' patterns found in this course.");
        } else {
            console.log(`  >>> Found ${suspiciousCount} questions with 'Verdadero/Falso' pattern.`);
        }
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
