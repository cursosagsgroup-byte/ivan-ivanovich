import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const course = await prisma.course.findFirst({
        where: {
            title: {
                contains: 'Contravigilancia'
            }
        },
        include: {
            modules: {
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

    console.log(`Course: ${course.title} (ID: ${course.id})`);

    let totalLessons = 0;
    let withVideo = 0;
    let withoutVideo = 0;

    for (const module of course.modules) {
        console.log(`\nModule: ${module.title}`);
        for (const lesson of module.lessons) {
            totalLessons++;
            const hasVideo = !!lesson.videoUrl;
            if (hasVideo) withVideo++;
            else withoutVideo++;

            console.log(`  - ${lesson.title}: ${hasVideo ? '✅ ' + lesson.videoUrl : '❌ MISSING'}`);
        }
    }

    console.log(`\nTotal Lessons: ${totalLessons}`);
    console.log(`With Video: ${withVideo}`);
    console.log(`Without Video: ${withoutVideo}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
