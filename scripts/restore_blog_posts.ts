import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const jsonPath = path.join(process.cwd(), 'app', 'data', 'blog-posts.json');
    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    const posts = JSON.parse(fileContent);

    console.log(`Found ${posts.length} posts in backup file.`);

    // Get or create admin user
    let user = await prisma.user.findFirst({
        where: { email: 'admin@example.com' }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'admin@example.com',
                name: 'Admin User',
                role: 'ADMIN',
                language: 'es'
            }
        });
        console.log('Created admin user');
    }

    // Clear existing posts to avoid duplicates/conflicts during restoration
    await prisma.blogPost.deleteMany({});
    console.log('Cleared existing posts.');

    for (const post of posts) {
        // Clean up date format if necessary (JSON has "YYYY-MM-DD", Prisma needs DateTime object or ISO string)
        const createdAt = new Date(post.date);

        // Create Spanish version (Original)
        await prisma.blogPost.create({
            data: {
                title: post.title,
                slug: post.slug,
                content: post.content || '',
                excerpt: post.excerpt || '',
                image: post.image,
                published: true,
                language: 'es',
                authorId: user.id,
                createdAt: createdAt
            }
        });

        // Create English version (Copy for translation)
        // We append '-en' to the slug to avoid unique constraint violation if slug is unique (it usually is)
        await prisma.blogPost.create({
            data: {
                title: `[TRANSLATE] ${post.title}`,
                slug: `${post.slug}-en`,
                content: post.content || '',
                excerpt: post.excerpt || '',
                image: post.image,
                published: true, // Or false if they should be drafts initially? User said "la idea era traducirlos", imply work in progress. Let's keep them published so they show up and he can see them, or maybe draft? Let's do published so he sees them in the list easily.
                language: 'en',
                authorId: user.id,
                createdAt: createdAt
            }
        });
    }

    console.log(`Restored ${posts.length} posts (x2 for ES/EN versions).`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
