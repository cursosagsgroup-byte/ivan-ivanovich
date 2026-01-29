
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const lessonTitle = 'Borrador de la lección';
    console.log(`Checking position of: "${lessonTitle}"...`);

    const lessons = await prisma.lesson.findMany({
        where: { title: lessonTitle },
        include: {
            module: {
                include: {
                    course: {
                        include: {
                            modules: {
                                orderBy: { order: 'asc' },
                                include: {
                                    lessons: { orderBy: { order: 'asc' } },
                                    quizzes: { orderBy: { order: 'asc' } }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    for (const lesson of lessons) {
        const course = lesson.module.course;
        const modules = course.modules;

        // Flatten all items to find position
        const allItems = modules.flatMap(m => {
            const items = [...m.lessons, ...m.quizzes].sort((a, b) => a.order - b.order);
            return items.map(i => ({ id: i.id, title: i.title, type: m.lessons.some(l => l.id === i.id) ? 'lesson' : 'quiz', module: m.title }));
        });

        const index = allItems.findIndex(i => i.id === lesson.id);
        const isLast = index === allItems.length - 1;

        console.log(`\n--- Lesson: ${lesson.title} (Module: ${lesson.module.title}) ---`);
        console.log(`Course: ${course.title}`);
        console.log(`Position: ${index + 1} of ${allItems.length}`);
        console.log(`Is Last Item? ${isLast ? 'YES' : 'NO'}`);

        if (isLast) {
            console.log("⚠️ This is the very last item in the course. The 'Next' button will be disabled.");
        } else {
            console.log(`Next Item: ${allItems[index + 1].title}`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
