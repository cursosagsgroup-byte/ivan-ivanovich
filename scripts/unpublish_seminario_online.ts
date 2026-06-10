import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Despublica el "Seminario Online en Vivo · Protección Ejecutiva".
// La promoción es válida solo hasta el 30 de junio de 2026 → correr el 1 de julio de 2026.
// Uso:  set -a && source .env && set +a && npx tsx scripts/unpublish_seminario_online.ts
const COURSE_ID = 'cmq8mfhot0000jgymc9u2zud7';

async function main() {
    const updated = await prisma.course.update({
        where: { id: COURSE_ID },
        data: { published: false },
    });
    console.log(`✅ Despublicado: "${updated.title}" (id ${updated.id}) — published=${updated.published}`);
    console.log('El curso ya no aparece en el catálogo y el botón "Quiero mi lugar" dejará de funcionar.');
}

main()
    .catch((e) => {
        console.error('❌ Error al despublicar:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
