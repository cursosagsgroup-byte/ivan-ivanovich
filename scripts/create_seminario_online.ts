import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const title = 'Seminario Online en Vivo · Protección Ejecutiva';
    const description =
        'Seminario online en vivo de Protección Ejecutiva con Ivan Ivanovich y Danny Leikin. ' +
        'Promoción de junio. Cupos limitados · Certificado incluido.';
    const price = 4000;
    const image = '/images/landing-pe/hero.jpg';

    const existing = await prisma.course.findFirst({ where: { title } });

    if (existing) {
        const updated = await prisma.course.update({
            where: { id: existing.id },
            data: { price, image, published: true, language: 'es' },
        });
        console.log('UPDATED_ID=' + updated.id);
        return;
    }

    const created = await prisma.course.create({
        data: { title, description, price, image, language: 'es', published: true },
    });
    console.log('CREATED_ID=' + created.id);
}

main()
    .catch((e) => {
        console.error('ERROR', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
