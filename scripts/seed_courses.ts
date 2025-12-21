import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding courses...');

    // Create sample courses
    const courses = [
        {
            title: 'Team Leader en Protección Ejecutiva',
            description: 'Formación avanzada para líderes de equipos de protección ejecutiva. Aprende las técnicas y estrategias utilizadas por las élites de seguridad mundial.',
            price: 299.00,
            image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&h=600&fit=crop',
            published: true,
        },
        {
            title: 'Contravigilancia Para Protección Ejecutiva',
            description: 'Técnicas avanzadas de detección y prevención de vigilancia hostil. Protege a tus clientes identificando amenazas antes de que se materialicen.',
            price: 249.00,
            image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
            published: true,
        },
    ];

    for (const course of courses) {
        const existing = await prisma.course.findFirst({
            where: { title: course.title },
        });

        if (!existing) {
            await prisma.course.create({
                data: course,
            });
            console.log(`✅ Created course: ${course.title}`);
        } else {
            console.log(`⏭️  Course already exists: ${course.title}`);
        }
    }

    console.log('✨ Seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
