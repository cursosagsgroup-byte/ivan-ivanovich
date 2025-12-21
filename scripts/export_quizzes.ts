
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const SPANISH_COURSES = {
    'Team Leader': 'cmio13v7r000064w1fs838sgw',
    'Counter Surveillance': 'cmio13v7u000164w1bhkqj8ej'
};

async function exportQuizzes() {
    try {
        const exportData: any = {};

        for (const [courseName, courseId] of Object.entries(SPANISH_COURSES)) {
            console.log(`Exporting quizzes for: ${courseName} (${courseId})`);

            const modules = await prisma.module.findMany({
                where: { courseId: courseId },
                orderBy: { order: 'asc' },
                include: {
                    quizzes: {
                        orderBy: { order: 'asc' },
                        include: {
                            questions: {
                                orderBy: { order: 'asc' }
                            }
                        }
                    }
                }
            });

            const courseQuizzes = [];

            for (const mod of modules) {
                if (mod.quizzes.length > 0) {
                    for (const quiz of mod.quizzes) {
                        courseQuizzes.push({
                            moduleOrder: mod.order, // To match with English target
                            quizTitle: quiz.title,
                            quizOrder: quiz.order,
                            questions: quiz.questions.map(q => ({
                                question: q.question,
                                type: q.type,
                                options: q.options,
                                correctAnswer: q.correctAnswer,
                                order: q.order
                            }))
                        });
                    }
                }
            }
            exportData[courseName] = courseQuizzes;
        }

        const outputPath = path.join(process.cwd(), 'temp', 'spanish_quizzes_export.json');
        fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
        console.log(`✅ Quizzes exported to ${outputPath}`);

        // Log counts
        console.log(`Team Leader Quizzes: ${exportData['Team Leader'].length}`);
        console.log(`Counter Surveillance Quizzes: ${exportData['Counter Surveillance'].length}`);

    } catch (error) {
        console.error('Error exporting quizzes:', error);
    } finally {
        await prisma.$disconnect();
    }
}

exportQuizzes();
