const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const courses = await prisma.course.findMany({
        where: {
            title: {
                contains: 'Team Leader',
            },
        },
        select: {
            id: true,
            title: true,
        },
    });
    console.log('Found courses:', courses);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
