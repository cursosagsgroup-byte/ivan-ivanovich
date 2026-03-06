
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Creating Alerta Temprana - México course...');

    const newCourseTitle = 'Alerta Temprana en Protección Ejecutiva - México';
    const newCourseDescription = 'Aprende la metodología operativa para detectar las señales de preparación de un ataque antes de que este ocurra. Enfocado en escenarios reales y operativos intensivos.';

    // Check if course already exists
    const existingCourse = await prisma.course.findFirst({
        where: { title: newCourseTitle }
    });

    if (existingCourse) {
        console.log(`⚠️ Course "${newCourseTitle}" already exists. Updating price...`);
        const updatedCourse = await prisma.course.update({
            where: { id: existingCourse.id },
            data: {
                price: 14800,
                published: true,
                image: '/images/landing-pe/ivan-pensando.jpg'
            }
        });
        console.log(`✅ Updated course ID: ${updatedCourse.id}`);
        return;
    }

    const newCourse = await prisma.course.create({
        data: {
            title: newCourseTitle,
            description: newCourseDescription,
            price: 14800,
            image: '/images/landing-pe/ivan-pensando.jpg',
            language: 'es',
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
