
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Identifying Final Quizzes per Course...');

    const courses = await prisma.course.findMany({
        include: {
            modules: {
                orderBy: { order: 'asc' }, // Assuming 'order' field exists, or we rely on DB order
                include: {
                    quizzes: {
                        orderBy: { title: 'asc' } // Quizzes inside module might not have order field?
                    }
                }
            }
        }
    });

    for (const course of courses) {
        console.log(`\n📘 Course: ${course.title} (${course.id})`);
        // Find the last module with quizzes
        let lastQuiz = null;

        // Iterate modules in order
        // Note: If you have a specific 'order' column, ensure it's used.
        // If not, we might need to rely on the order received.
        // Ideally modules should have an index.
        const sortedModules = course.modules.sort((a, b) => a.order - b.order);

        for (const module of sortedModules) {
            if (module.quizzes.length > 0) {
                // Assuming the last quiz in the last module is the "Final One"
                // But quizzes usually don't have an order field in simple schemas, strictly. 
                // Let's list all quizzes to see which one looks like "Final".
                for (const quiz of module.quizzes) {
                    lastQuiz = quiz.title;
                    console.log(`   - [Module ${module.order}] Quiz: ${quiz.title}`);
                }
            }
        }

        console.log(`   🎯 DEDUCED FINAL QUIZ: "${lastQuiz}"`);
    }

    await prisma.$disconnect();
}

main().catch(console.error);
