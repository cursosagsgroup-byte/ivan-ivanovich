
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking Course Content in Database...');

    const courses = await prisma.course.count();
    const modules = await prisma.module.count();
    const lessons = await prisma.lesson.count();

    console.log(`📊 Statistics:`);
    console.log(`   Courses: ${courses}`);
    console.log(`   Modules: ${modules}`);
    console.log(`   Lessons: ${lessons}`);

    if (lessons > 0) {
        const sampleLesson = await prisma.lesson.findFirst({
            include: { module: { include: { course: true } } }
        });
        console.log('\n📝 Sample Lesson:', {
            title: sampleLesson?.title,
            module: sampleLesson?.module.title,
            course: sampleLesson?.module.course.title
        });
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
