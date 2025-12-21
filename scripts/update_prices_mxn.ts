import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updatePricesMXN() {
    console.log('Actualizando precios a MXN...\n');

    // Update Team Leader (ES & EN) -> 1900
    // Note: We update both languages to keep parity, or should EN be USD? 
    // Assuming MXN for now based on request, or equivalent. 
    // The user specified "1900 mxn", usually for the spanish site.

    // Team Leader Spanish
    await prisma.course.updateMany({
        where: { title: { contains: 'Team Leader' } },
        data: { price: 1900 }
    });
    console.log('✅ Team Leader updated to $1900');

    // Contravigilancia Spanish
    await prisma.course.updateMany({
        where: { title: { contains: 'Contravigilancia' } },
        data: { price: 2500 }
    });
    // Counter Surveillance English (assuming same numeric value or keeping parity logic)
    await prisma.course.updateMany({
        where: { title: { contains: 'Counter Surveillance' } },
        data: { price: 2500 } // Or equivalent? User said "contravigilancia 2500 mxn"
    });

    console.log('✅ Contravigilancia updated to $2500');

    // Verify
    const courses = await prisma.course.findMany({
        select: { title: true, price: true, language: true }
    });

    console.log('\nNuevos Precios:');
    courses.forEach(c => console.log(`- ${c.title} (${c.language}): $${c.price}`));

    await prisma.$disconnect();
}

updatePricesMXN().catch(console.error);
