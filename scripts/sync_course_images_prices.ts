import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateCourses() {
    console.log('Actualizando cursos con precios e imágenes correctas...\n');

    // Update Team Leader English
    await prisma.course.update({
        where: { id: 'cmiq7oga203zikveg3jbf8p8u' },
        data: {
            price: 299,
            image: '/curso-team-leader.png'
        }
    });
    console.log('✅ Team Leader (English) - Precio: $299, Imagen: /curso-team-leader.png');

    // Update Counter Surveillance English
    await prisma.course.update({
        where: { id: 'cmiq7oga703zjkvegaq8v1ir4' },
        data: {
            price: 249,
            image: '/curso-contravigilancia.jpg'
        }
    });
    console.log('✅ Counter Surveillance (English) - Precio: $249, Imagen: /curso-contravigilancia.jpg');

    // Update Team Leader Spanish
    await prisma.course.update({
        where: { id: 'cmio13v7r000064w1fs838sgw' },
        data: {
            image: '/curso-team-leader.png'
        }
    });
    console.log('✅ Team Leader (Español) - Imagen: /curso-team-leader.png');

    // Update Contravigilancia Spanish
    await prisma.course.update({
        where: { id: 'cmio13v7u000164w1bhkqj8ej' },
        data: {
            image: '/curso-contravigilancia.jpg'
        }
    });
    console.log('✅ Contravigilancia (Español) - Imagen: /curso-contravigilancia.jpg');

    console.log('\n✅ Todos los cursos actualizados correctamente!');

    // Display final state
    const courses = await prisma.course.findMany({
        select: {
            title: true,
            price: true,
            image: true,
            language: true
        },
        orderBy: { language: 'asc' }
    });

    console.log('\n📚 ESTADO FINAL DE LOS CURSOS:\n');
    courses.forEach(c => {
        console.log(`${c.title} (${c.language.toUpperCase()})`);
        console.log(`  Precio: $${c.price}`);
        console.log(`  Imagen: ${c.image}\n`);
    });

    await prisma.$disconnect();
}

updateCourses().catch(console.error);
