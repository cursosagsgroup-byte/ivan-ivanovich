import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const course = await prisma.course.findFirst({
        where: {
            title: {
                contains: 'Contravigilancia'
            }
        }
    });

    if (course) {
        console.log(`Found course: ${course.title}`);
        console.log(`ID: ${course.id}`);
    } else {
        console.log('Course not found');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
