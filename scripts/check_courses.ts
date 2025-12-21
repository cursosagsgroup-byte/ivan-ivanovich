import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCourses() {
    const courses = await prisma.course.findMany({
        select: {
            id: true,
            title: true,
            price: true,
            image: true,
            description: true,
            language: true
        }
    });

    console.log('CURSOS EN LA BASE DE DATOS:\n');
    console.log('='.repeat(80));

    courses.forEach(course => {
        console.log(`\nTítulo: ${course.title}`);
        console.log(`ID: ${course.id}`);
        console.log(`Precio: $${course.price}`);
        console.log(`Imagen: ${course.image || 'No tiene'}`);
        console.log(`Idioma: ${course.language}`);
        console.log(`Descripción: ${course.description?.substring(0, 100)}...`);
    });

    await prisma.$disconnect();
}

checkCourses().catch(console.error);
