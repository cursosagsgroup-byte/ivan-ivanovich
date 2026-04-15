
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking Avanzadas Module Content ---');
    
    const course = await prisma.course.findFirst({
        where: { title: { contains: 'Team Leader' } },
        include: {
            modules: {
                where: { title: { contains: 'Las avanzadas' } },
                include: {
                    lessons: true
                }
            }
        }
    });

    if (!course) {
        console.log('Course not found');
        return;
    }

    console.log(`Course Found: ${course.title} (ID: ${course.id})`);
    
    for (const module of course.modules) {
        console.log(`\nModule: ${module.title} (ID: ${module.id})`);
        for (const lesson of module.lessons) {
            console.log(`  Lesson: ${lesson.title} (ID: ${lesson.id})`);
            console.log(`    Content: ${lesson.content?.substring(0, 100)}...`);
            if (lesson.content?.includes('href') || lesson.content?.includes('download')) {
                console.log(`    Found potential link in content!`);
                console.log(`    Full content: ${lesson.content}`);
            }
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
