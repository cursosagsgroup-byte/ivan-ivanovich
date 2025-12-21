import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Cleaning up courses...');

    // Courses to keep
    const keepTitles = [
        'Team Leader en Protección Ejecutiva',
        'Contravigilancia Para Protección Ejecutiva'
    ];

    // Find all courses
    const allCourses = await prisma.course.findMany();

    for (const course of allCourses) {
        if (!keepTitles.includes(course.title)) {
            console.log(`🗑️  Deleting course: ${course.title}`);
            await prisma.course.delete({
                where: { id: course.id }
            });
        } else {
            console.log(`✅ Keeping course: ${course.title}`);
            // Ensure it is published
            if (!course.published) {
                console.log(`   - Publishing ${course.title}`);
                await prisma.course.update({
                    where: { id: course.id },
                    data: { published: true }
                });
            }
        }
    }

    console.log('✨ Cleanup completed!');
}

main()
    .catch((e) => {
        console.error('❌ Error cleaning database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
