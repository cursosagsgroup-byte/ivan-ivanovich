
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const missingImageCount = await prisma.blogPost.count({
        where: {
            OR: [
                { image: null },
                { image: '' }
            ]
        }
    });

    console.log(`Missing images count: ${missingImageCount}`);

    // Also query for published ones specifically, just in case
    const missingImagePublishedCount = await prisma.blogPost.count({
        where: {
            published: true,
            OR: [
                { image: null },
                { image: '' }
            ]
        }
    });

    console.log(`Missing images (published) count: ${missingImagePublishedCount}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
