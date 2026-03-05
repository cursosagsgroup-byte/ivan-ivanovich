
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Creating Costa Rica course...');

    const baseCourseTitle = 'Protección Ejecutiva, Operatividad General y Logística Protectiva';
    const baseCourse = await prisma.course.findFirst({
        where: { title: baseCourseTitle }
    });

    if (!baseCourse) {
        console.error(`❌ Base course "${baseCourseTitle}" not found.`);
        process.exit(1);
    }

    const newCourseTitle = 'Protección Ejecutiva, Operatividad General y Logística Protectiva - Costa Rica (800USD)';
    const newCourse = await prisma.course.create({
        data: {
            title: newCourseTitle,
            description: baseCourse.description,
            price: 14400,
            image: baseCourse.image,
            language: baseCourse.language,
            published: true,
        }
    });

    console.log(`✅ Created course: ${newCourse.title}`);
    console.log(`ID: ${newCourse.id}`);
    console.log(`Price: $${newCourse.price} MXN`);
}

main()
    .catch((e) => {
        console.error('❌ Error creating course:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
