import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function diagnoseLessonVideos() {
    console.log('🔍 Diagnosing Lesson Video URLs...\n');

    // Get all courses
    const courses = await prisma.course.findMany({
        include: {
            modules: {
                include: {
                    lessons: true
                }
            }
        }
    });

    for (const course of courses) {
        console.log(`\n📚 Course: ${course.title} (ID: ${course.id})`);
        console.log(`   Published: ${course.published}`);

        for (const module of course.modules) {
            console.log(`\n  📖 Module: ${module.title} (ID: ${module.id})`);

            for (const lesson of module.lessons) {
                const hasVideo = lesson.videoUrl && lesson.videoUrl.trim() !== '';
                console.log(`    ${hasVideo ? '✅' : '❌'} Lesson: ${lesson.title}`);
                console.log(`       ID: ${lesson.id}`);
                console.log(`       VideoURL: ${lesson.videoUrl || 'NULL/EMPTY'}`);
                console.log(`       Order: ${lesson.order}`);
            }
        }
    }

    console.log('\n\n📊 Summary:');
    const allLessons = courses.flatMap(c => c.modules.flatMap(m => m.lessons));
    const lessonsWithVideo = allLessons.filter(l => l.videoUrl && l.videoUrl.trim() !== '');
    const lessonsWithoutVideo = allLessons.filter(l => !l.videoUrl || l.videoUrl.trim() === '');

    console.log(`Total Lessons: ${allLessons.length}`);
    console.log(`Lessons WITH video: ${lessonsWithVideo.length}`);
    console.log(`Lessons WITHOUT video: ${lessonsWithoutVideo.length}`);

    await prisma.$disconnect();
}

diagnoseLessonVideos().catch(console.error);
