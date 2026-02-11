
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const courseId = 'cml1dc7d60000piral5rrf0to';
    const newPrice = 14800;

    console.log(`Updating price for course ${courseId} to ${newPrice}...`);

    try {
        const course = await prisma.course.update({
            where: { id: courseId },
            data: { price: newPrice }
        });

        console.log(`✅ Success! Course '${course.title}' updated.`);
        console.log(`New Price: ${course.price}`);
    } catch (e) {
        console.error('Error updating course:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
