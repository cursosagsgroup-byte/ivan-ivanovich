import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('📌 Marcando artículos de análisis histórico como destacados...\n');

    // Pin the Spanish version
    const spanishArticle = await prisma.blogPost.update({
        where: { slug: 'analisis-historico-efectividad-proteccion-ejecutiva' },
        data: { pinned: true },
        select: { title: true, slug: true, pinned: true }
    });

    console.log('✅ Artículo en español marcado como destacado:');
    console.log(`   Título: ${spanishArticle.title}`);
    console.log(`   Slug: ${spanishArticle.slug}`);
    console.log(`   Pinned: ${spanishArticle.pinned}\n`);

    // Pin the English version
    const englishArticle = await prisma.blogPost.update({
        where: { slug: 'analisis-historico-efectividad-proteccion-ejecutiva-en' },
        data: { pinned: true },
        select: { title: true, slug: true, pinned: true }
    });

    console.log('✅ Artículo en inglés marcado como destacado:');
    console.log(`   Título: ${englishArticle.title}`);
    console.log(`   Slug: ${englishArticle.slug}`);
    console.log(`   Pinned: ${englishArticle.pinned}\n`);

    console.log('🎯 Ambos artículos ahora aparecerán primero en sus respectivas páginas de blog.');
}

main()
    .catch((e) => {
        console.error('❌ Error marcando artículos como destacados:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
