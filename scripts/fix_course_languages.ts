import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixLanguages() {
    console.log('Corrigiendo idiomas de los cursos...\n');

    // Update Team Leader English to 'en'
    await prisma.course.update({
        where: { id: 'cmiq7oga203zikveg3jbf8p8u' },
        data: {
            language: 'en'
        }
    });
    console.log('✅ Team Leader in Executive Protection -> language: en');

    // Update Counter Surveillance English to 'en'
    await prisma.course.update({
        where: { id: 'cmiq7oga703zjkvegaq8v1ir4' },
        data: {
            language: 'en'
        }
    });
    console.log('✅ Counter Surveillance for Executive Protection -> language: en');

    // Verify
    const courses = await prisma.course.findMany({
        select: {
            title: true,
            language: true,
            price: true,
            image: true
        },
        orderBy: { language: 'asc' }
    });

    console.log('\n📚 CURSOS FINALES:\n');
    courses.forEach(c => {
        console.log(`[${c.language.toUpperCase()}] ${c.title}`);
        console.log(`      Precio: $${c.price}`);
        console.log(`      Imagen: ${c.image}\n`);
    });

    await prisma.$disconnect();
}

fixLanguages().catch(console.error);
