
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🛠️ Fixing "Avanzada" lesson image...');

    const brokenUrl = 'https://ivanivanovich.com/wp-content/uploads/2021/06/avanzada.png';
    const newPath = '/images/avanzada.png';

    // Find lessons with the broken URL
    const lessons = await prisma.lesson.findMany({
        where: {
            content: { contains: brokenUrl }
        }
    });

    console.log(`Found ${lessons.length} lessons with broken image.`);

    for (const lesson of lessons) {
        if (lesson.content) {
            const newContent = lesson.content.replace(brokenUrl, newPath);

            await prisma.lesson.update({
                where: { id: lesson.id },
                data: { content: newContent }
            });

            console.log(`✅ Updated lesson: ${lesson.title} (${lesson.id})`);
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
