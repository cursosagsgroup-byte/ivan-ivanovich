
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const ENGLISH_COURSES = {
    'Team Leader': 'cmiq7oga203zikveg3jbf8p8u',
    'Counter Surveillance': 'cmiq7oga703zjkvegaq8v1ir4'
};

async function importTranslatedQuizzes() {
    try {
        const jsonPath = path.join(process.cwd(), 'temp', 'english_quizzes_translated.json');
        const rawData = fs.readFileSync(jsonPath, 'utf-8');
        const quizzesData = JSON.parse(rawData);

        for (const [courseName, courseId] of Object.entries(ENGLISH_COURSES)) {
            if (!quizzesData[courseName]) {
                console.log(`⚠️ No quizzes found in JSON for: ${courseName}`);
                continue;
            }

            console.log(`\n📦 Importing quizzes for: ${courseName} (${courseId})`);

            // Fetch existing modules
            const modules = await prisma.module.findMany({
                where: { courseId: courseId },
                orderBy: { order: 'asc' }
            });

            const quizzesToImport = quizzesData[courseName];

            for (const quizData of quizzesToImport) {
                // Find matching module by order
                const targetModule = modules.find(m => m.order === quizData.moduleOrder);

                if (!targetModule) {
                    console.error(`   ❌ Module w/ order ${quizData.moduleOrder} not found for quiz "${quizData.quizTitle}". Skipping.`);
                    continue;
                }

                // Check if quiz already exists (avoid duplicates if re-run, though we usually wipe)
                // Actually, my previous imports created placeholders? No, "Team Leader" had 0 quizzes.
                // Wait, "Counter Surveillance" script logic: if (isQuiz) createQuiz... 
                // BUT "Counter Surveillance" import found 0 quizzes in source JSON. So it should be clean.
                // However, "Team Leader" import script... did it create empty quizzes?
                // Let's check "Team Leader" import output or log.
                // Task Summary said: "Quizzes were created as placeholders (empty)."
                // Ah! Step 371: "Quizzes: EN=0 vs ES=19". Wait.
                // Step 371 compare output says EN=0. So Team Leader currently has 0 quizzes.
                // Reason: I might have commented out the placeholder creation or the comparison script counts Quizzes with questions? 
                // Or maybe I deleted them?
                // Let's assume there are NO quizzes or I should wipe them to be safe?
                // Deleting existing quizzes might be safer to avoid duplicates.

                // Let's check if quiz exists by title to update or create
                const existingQuiz = await prisma.quiz.findFirst({
                    where: {
                        moduleId: targetModule.id,
                        title: quizData.quizTitle
                    }
                });

                let quizId;

                if (existingQuiz) {
                    console.log(`   🔄 Updating existing quiz: ${quizData.quizTitle}`);
                    quizId = existingQuiz.id;
                    // Wipe questions to re-import
                    await prisma.question.deleteMany({ where: { quizId: quizId } });
                } else {
                    console.log(`   ➕ Creating quiz: ${quizData.quizTitle} (Module: ${targetModule.title})`);
                    const newQuiz = await prisma.quiz.create({
                        data: {
                            title: quizData.quizTitle,
                            moduleId: targetModule.id,
                            order: quizData.quizOrder,
                            passingScore: 80, // Default passing score
                        }
                    });
                    quizId = newQuiz.id;
                }

                // Create Questions
                for (const q of quizData.questions) {
                    await prisma.question.create({
                        data: {
                            quizId: quizId,
                            question: q.question,
                            type: q.type,
                            options: JSON.stringify(q.options), // Stringify the options array
                            correctAnswer: q.correctAnswer,
                            order: q.order
                        }
                    });
                }
            }
        }

        console.log(`\n✅ Quiz translation import completed.`);

    } catch (error) {
        console.error('Error importing translated quizzes:', error);
    } finally {
        await prisma.$disconnect();
    }
}

importTranslatedQuizzes();
