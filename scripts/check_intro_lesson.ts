import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Find the "Introducción" lesson
    const lessons = await prisma.lesson.findMany({
        where: {
            title: {
                contains: 'Introducción'
            }
        },
        include: {
            module: {
                include: {
                    course: true
                }
            }
        }
    });

    console.log(`Found ${lessons.length} lessons with "Introducción" in the title:`);

    for (const lesson of lessons) {
        console.log(`\nLesson ID: ${lesson.id}`);
        console.log(`Title: ${lesson.title}`);
        console.log(`Video URL: ${lesson.videoUrl || 'NULL'}`);
        console.log(`Module: ${lesson.module.title}`);
        console.log(`Course: ${lesson.module.course.title} (${lesson.module.course.id})`);
        console.log(`Order: ${lesson.order}`);
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
