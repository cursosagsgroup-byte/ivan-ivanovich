
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Find all posts that might have multiple images separated by pipe
    const postsWithPipes = await prisma.blogPost.findMany({
        where: {
            image: {
                contains: '|'
            }
        }
    });

    console.log(`Found ${postsWithPipes.length} posts with multiple image URLs.`);

    let updatedCount = 0;

    for (const post of postsWithPipes) {
        if (!post.image) continue;

        // Split by pipe and take the first one
        const urls = post.image.split('|');
        const firstUrl = urls[0].trim();

        if (firstUrl !== post.image) {
            console.log(`Fixing post "${post.title}"`);
            console.log(`  Old: ${post.image.substring(0, 50)}...`);
            console.log(`  New: ${firstUrl.substring(0, 50)}...`);

            await prisma.blogPost.update({
                where: { id: post.id },
                data: { image: firstUrl }
            });
            updatedCount++;
        }
    }

    console.log(`Fixed ${updatedCount} posts.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
