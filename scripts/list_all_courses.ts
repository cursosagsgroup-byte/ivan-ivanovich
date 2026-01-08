
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Listing all courses...');
    const courses = await prisma.course.findMany({
        select: {
            id: true,
            title: true,
            language: true
        }
    });

    courses.forEach(c => {
        console.log(`- [${c.language}] ${c.title} (ID: ${c.id})`);
    });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
