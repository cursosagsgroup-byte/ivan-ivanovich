import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('📅 Actualizando fechas de los artículos de análisis histórico...\n');

    // Update Spanish article date to be the most recent
    const spanishArticle = await prisma.blogPost.update({
        where: { slug: 'analisis-historico-efectividad-proteccion-ejecutiva' },
        data: {
            createdAt: new Date('2026-01-18T12:00:00Z'), // Hoy a mediodía
            updatedAt: new Date()
        },
        select: { title: true, slug: true, createdAt: true, pinned: true }
    });

    console.log('✅ Artículo en español actualizado:');
    console.log(`   Título: ${spanishArticle.title.substring(0, 60)}...`);
    console.log(`   Slug: ${spanishArticle.slug}`);
    console.log(`   Nueva fecha: ${spanishArticle.createdAt.toLocaleDateString('es-ES')}`);
    console.log(`   Pinned: ${spanishArticle.pinned}\n`);

    // Also update English article to match
    const englishArticle = await prisma.blogPost.update({
        where: { slug: 'analisis-historico-efectividad-proteccion-ejecutiva-en' },
        data: {
            createdAt: new Date('2026-01-18T12:00:00Z'),
            updatedAt: new Date()
        },
        select: { title: true, slug: true, createdAt: true, pinned: true }
    });

    console.log('✅ Artículo en inglés actualizado:');
    console.log(`   Título: ${englishArticle.title.substring(0, 60)}...`);
    console.log(`   Slug: ${englishArticle.slug}`);
    console.log(`   Nueva fecha: ${englishArticle.createdAt.toLocaleDateString('es-ES')}`);
    console.log(`   Pinned: ${englishArticle.pinned}\n`);

    console.log('🎯 Ambos artículos ahora aparecerán de primero en sus respectivas páginas.');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
