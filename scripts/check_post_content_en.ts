
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const slug = 'los-impactos-que-estan-cambiado-a-la-proteccion-ejecutiva-en';
    const post = await prisma.blogPost.findUnique({
        where: { slug: slug },
        select: {
            title: true,
            content: true,
            language: true
        }
    });

    if (post) {
        console.log('Title:', post.title);
        console.log('Language:', post.language);
        console.log('Content Start:', post.content.substring(0, 200));
    } else {
        console.log('Post not found');
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
