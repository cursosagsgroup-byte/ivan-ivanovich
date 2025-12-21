import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const lessonTitle = '**Detección activa en Vehículo movil**';

    console.log(`Searching for lesson: "${lessonTitle}"...`);

    const lesson = await prisma.lesson.findFirst({
        where: {
            title: lessonTitle
        },
        include: {
            module: {
                include: {
                    course: true
                }
            }
        }
    });

    if (!lesson) {
        console.log('❌ Lesson not found.');
        return;
    }

    console.log(`✅ Found lesson:`);
    console.log(`   ID: ${lesson.id}`);
    console.log(`   Module: ${lesson.module.title}`);
    console.log(`   Course: ${lesson.module.course.title}`);

    // Delete
    await prisma.lesson.delete({
        where: { id: lesson.id }
    });

    console.log(`\n🗑️  Lesson deleted successfully.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
