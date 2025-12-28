
import { prisma } from '../lib/prisma';

async function main() {
    const courses = await prisma.course.findMany({
        select: { id: true, title: true }
    });
    console.log('--- AVAILABLE COURSES ---');
    console.log(courses);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
