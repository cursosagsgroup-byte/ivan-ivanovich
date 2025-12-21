import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const moduleTitle = 'Contenido del Curso';

    console.log(`Searching for module: "${moduleTitle}"...`);

    const moduleData = await prisma.module.findFirst({
        where: {
            title: moduleTitle,
            course: {
                title: { contains: 'Contravigilancia' }
            }
        },
        include: {
            lessons: true
        }
    });

    if (!moduleData) {
        console.log('❌ Module not found.');
        return;
    }

    console.log(`✅ Found module: ${moduleData.title} (ID: ${moduleData.id})`);
    console.log('Lessons:');

    for (const lesson of moduleData.lessons) {
        console.log(`- ID: ${lesson.id}`);
        console.log(`  Title: "${lesson.title}"`); // Quotes to see whitespace
        console.log(`  Video: ${lesson.videoUrl}`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
