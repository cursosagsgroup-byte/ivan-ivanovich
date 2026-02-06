
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Searching for "Avanzada" lessons (title only)...');

    try {
        const lessons = await prisma.lesson.findMany({
            where: {
                title: { contains: 'Avanzada', mode: 'insensitive' }
            },
            take: 1
        });

        console.log(`Found ${lessons.length} lessons.`);

        if (lessons.length > 0) {
            console.log('First lesson keys:', Object.keys(lessons[0]));
            console.log('First lesson content:', lessons[0].content); // Try accessing it
        }

        // Now try the deeper search if safe
        const deepLessons = await prisma.lesson.findMany({
            where: {
                title: { contains: 'Avanzada', mode: 'insensitive' }
            },
            include: {
                topic: {
                    include: {
                        course: true
                    }
                }
            }
        });

        for (const lesson of deepLessons) {
            console.log('---------------------------------------------------');
            console.log(`ID: ${lesson.id}`);
            console.log(`Title: ${lesson.title}`);
            console.log(`Course: ${lesson?.topic?.course?.title}`);

            if (lesson.content) {
                const imgRegex = /<img[^>]+src="([^">]+)"/g;
                let match;
                while ((match = imgRegex.exec(lesson.content as string)) !== null) {
                    console.log(`Found Image Source: ${match[1]}`);
                }
            } else {
                console.log('Content is null or undefined');
            }
        }

    } catch (e) {
        console.error('Error querying:', e);
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
