const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const updatedCourse = await prisma.course.update({
        where: {
            id: 'cmikx8svl000010qr119xvkoi',
        },
        data: {
            image: '/curso-team-leader.png',
            title: 'CURSO TEAM LEADER EN LA PROTECCIÓN EJECUTIVA',
            price: 1900, // Matching the price shown on the page (MXN)
        },
    });
    console.log('Updated course:', updatedCourse);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
