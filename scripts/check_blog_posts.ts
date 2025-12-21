
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking for Blog Posts in Database...');

    const count = await prisma.blogPost.count();
    console.log(`Total Blog Posts Found: ${count}`);

    if (count > 0) {
        const posts = await prisma.blogPost.findMany({
            take: 3,
            select: { title: true, slug: true, published: true }
        });
        console.log('📝 Sample Posts:', posts);
    } else {
        console.log('⚠️ No blog posts found in the database table.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
