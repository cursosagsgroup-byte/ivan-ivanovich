import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Event Course...');

    const eventTitle = "Protección Ejecutiva, Operatividad General y Logística Protectiva";

    // Price breakdown: 14,600 + 16% IVA = 16,936
    const eventPrice = 16936.00;

    // Check if course exists
    let course = await prisma.course.findFirst({
        where: {
            title: eventTitle
        }
    });

    if (course) {
        // Update existing
        course = await prisma.course.update({
            where: { id: course.id },
            data: {
                price: eventPrice,
                image: "/images/landing-pe/feature-section.jpg",
                published: true,
                description: "Certificación Internacional en Protección Ejecutiva, Operatividad General y Logística Protectiva. 24 y 25 de Febrero, CDMX."
            }
        });
        console.log('Course updated.');
    } else {
        // Create new
        course = await prisma.course.create({
            data: {
                title: eventTitle,
                price: eventPrice,
                description: "Certificación Internacional en Protección Ejecutiva, Operatividad General y Logística Protectiva. 24 y 25 de Febrero, CDMX.",
                image: "/images/landing-pe/feature-section.jpg",
                published: true,
                language: "es"
            }
        });
        console.log('Course created.');
    }

    console.log(`Course seeded successfully!`);
    console.log(`ID: ${course.id}`);
    console.log(`Title: ${course.title}`);
    console.log(`Price: $${course.price}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
