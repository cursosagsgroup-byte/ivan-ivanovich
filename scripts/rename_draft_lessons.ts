
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    console.log('Starting lesson renaming...');

    // 1. Rename Module 17 Lesson
    // "Borrador de la lección" -> "Video Complementario"
    // Need to find it by module name to be sure
    const lesson1 = await prisma.lesson.findFirst({
        where: {
            title: 'Borrador de la lección',
            module: { title: { contains: '17. ¿Cómo aplicar lo aprendido?' } }
        }
    });

    if (lesson1) {
        await prisma.lesson.update({
            where: { id: lesson1.id },
            data: { title: 'Video Complementario' }
        });
        console.log(`✅ Renamed Lesson ID ${lesson1.id} to "Video Complementario"`);
    } else {
        console.log('⚠️ Could not find "Borrador" in Module 17 (Maybe already renamed?)');
    }

    // 2. Rename Module 19 Lesson
    // "Borrador de la lección" -> "Cierre del Curso"
    const lesson2 = await prisma.lesson.findFirst({
        where: {
            title: 'Borrador de la lección',
            module: { title: { contains: '19. Cierre' } }
        }
    });

    if (lesson2) {
        await prisma.lesson.update({
            where: { id: lesson2.id },
            data: { title: 'Cierre del Curso' }
        });
        console.log(`✅ Renamed Lesson ID ${lesson2.id} to "Cierre del Curso"`);
    } else {
        console.log('⚠️ Could not find "Borrador" in Module 19 (Maybe already renamed?)');
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
