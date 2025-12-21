import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const jsonPath = path.join(process.cwd(), 'app/data/blog-posts.json');

    if (!fs.existsSync(jsonPath)) {
        console.error('Blog posts JSON file not found at:', jsonPath);
        return;
    }

    const postsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Found ${postsData.length} posts to migrate.`);

    // Find or create a default admin user for these posts
    let author = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    });

    if (!author) {
        console.log('No admin user found. Creating a default admin user...');
        // Try to find any user first
        author = await prisma.user.findFirst();

        if (!author) {
            // Create a placeholder admin if absolutely no users exist (unlikely in dev but good for safety)
            // In a real scenario we might want to be more careful, but for dev seeding this is fine.
            // We won't set a password here, just enough to link the relation.
            author = await prisma.user.create({
                data: {
                    email: 'admin@ivanivanovich.com',
                    name: 'Ivan Ivanovich',
                    role: 'ADMIN',
                }
            });
        }
    }

    console.log(`Assigning posts to author: ${author.name} (${author.id})`);

    for (const post of postsData) {
        // Check if post with this slug already exists
        const existing = await prisma.blogPost.findUnique({
            where: { slug: post.slug }
        });

        if (existing) {
            console.log(`Skipping existing post: ${post.slug}`);
            continue;
        }

        // The JSON date might be a string, Prisma expects a Date object or ISO string
        // Ensure content is not empty
        if (!post.content) {
            console.warn(`Skipping post ${post.title} due to empty content.`);
            continue;
        }

        await prisma.blogPost.create({
            data: {
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt || '',
                content: post.content,
                image: post.image,
                published: true, // Assuming migrated posts are published
                createdAt: new Date(post.date),
                authorId: author.id,
            }
        });
        console.log(`Migrated: ${post.title}`);
    }

    console.log('Migration completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
