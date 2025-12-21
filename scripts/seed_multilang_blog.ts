import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create a test user if not exists
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

    // Create Spanish Post
    await prisma.blogPost.create({
        data: {
            title: 'Bienvenido a nuestro blog',
            slug: 'bienvenido-blog',
            content: '<p>Este es un artículo de prueba en español.</p>',
            excerpt: 'Artículo de prueba en español',
            published: true,
            language: 'es',
            authorId: user.id,
            image: '/hero-bg-v3.png' // Reusing an existing image
        }
    });
    console.log('Created Spanish post');

    // Create English Post
    await prisma.blogPost.create({
        data: {
            title: 'Welcome to our blog',
            slug: 'welcome-blog',
            content: '<p>This is a test article in English.</p>',
            excerpt: 'Test article in English',
            published: true,
            language: 'en',
            authorId: user.id,
            image: '/hero-bg-v3.png'
        }
    });
    console.log('Created English post');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
