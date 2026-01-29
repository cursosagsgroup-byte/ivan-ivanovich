import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Verificando estado de todos los artículos del blog...\n');

    const posts = await prisma.blogPost.findMany({
        select: {
            title: true,
            slug: true,
            pinned: true,
            createdAt: true,
            language: true
        },
        orderBy: [
            { pinned: 'desc' },
            { createdAt: 'desc' }
        ]
    });

    console.log('📋 Artículos ordenados por pinned y fecha:\n');
    posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.pinned ? '📌 [PINNED]' : '   [NORMAL]'} ${post.language.toUpperCase()} - ${post.title.substring(0, 60)}...`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   Fecha: ${post.createdAt.toLocaleDateString('es-ES')}`);
        console.log('');
    });
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
