
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const post = await prisma.blogPost.findFirst({
        where: {
            image: {
                contains: '|'
            }
        },
        select: {
            title: true,
            slug: true,
            image: true
        }
    });

    console.log('Sample post with pipe in image field:');
    console.log(post);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
