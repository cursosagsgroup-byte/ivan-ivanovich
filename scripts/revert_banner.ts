
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SLUG = "analisis-historico-efectividad-proteccion-ejecutiva";
// The HTML we inserted previously
const INCORRECT_BANNER_HTML = `
<div class="my-8 w-full flex justify-center">
    <img src="/images/banners/promo-libro.png" alt="Protección Ejecutiva en el Siglo XXI: La Nueva Doctrina" class="w-full h-auto rounded-lg shadow-md object-cover" />
</div>
`;

async function main() {
    const post = await prisma.blogPost.findUnique({
        where: { slug: SLUG }
    });

    if (!post) {
        console.error("Post not found!");
        return;
    }

    if (post.content.includes(INCORRECT_BANNER_HTML)) {
        console.log("Found incorrect banner. Removing it...");
        // Remove it
        const newContent = post.content.replace(INCORRECT_BANNER_HTML, "");

        await prisma.blogPost.update({
            where: { id: post.id },
            data: { content: newContent }
        });
        console.log("Incorrect banner removed.");
    } else {
        console.log("Incorrect banner not found (maybe alread removed or formatted differently).");
        // Try to remove just the image tag if container matches or flexible
        // For now, I'll trust exact match since I just wrote it.
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
