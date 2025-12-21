
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const posts = await prisma.blogPost.findMany({
        select: {
            id: true,
            slug: true,
            title: true,
            language: true,
            published: true
        }
    });

    console.log('Found posts:', posts);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
