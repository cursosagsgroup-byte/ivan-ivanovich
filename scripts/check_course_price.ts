
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Course Prices ---');
    const courses = await prisma.course.findMany();
    courses.forEach(c => {
        console.log(`Title: ${c.title}`);
        console.log(`Price: ${c.price}`);
        console.log('-------------------');
    });
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
