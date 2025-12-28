import { prisma } from '../lib/prisma';

async function main() {
    console.log('Fetching blog posts...');
    const posts = await prisma.blogPost.findMany({
        select: {
            title: true,
            image: true,
            published: true
        },
        orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${posts.length} posts.`);
    posts.forEach(post => {
        console.log(`Title: ${post.title}`);
        console.log(`Image: ${post.image}`);
        console.log(`Published: ${post.published}`);
        console.log('---');
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
