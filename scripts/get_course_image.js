const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const course = await prisma.course.findUnique({
        where: {
            id: 'cmikx8svl000010qr119xvkoi',
        },
        select: {
            image: true,
            title: true,
            price: true
        },
    });
    console.log('Course data:', course);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
