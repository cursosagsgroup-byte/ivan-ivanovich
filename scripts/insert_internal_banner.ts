
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SLUG = "analisis-historico-efectividad-proteccion-ejecutiva";
// Using banner4.jpg as the likely candidate for the book promo at the end.
const BANNER_HTML = `
<div class="my-8 w-full flex justify-center">
    <img src="/images/banners/banner4.jpg?v=2" alt="Protección Ejecutiva en el Siglo XXI: La Nueva Doctrina" class="w-full h-auto rounded-lg shadow-md object-cover" />
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

    const targetText = "<h4>La Omisión Crítica: Protección Anticipatoria</h4>";

    if (post.content.includes(targetText)) {
        console.log("Target section found. Inserting banner...");
        const newContent = post.content.replace(targetText, `${BANNER_HTML}${targetText}`);

        await prisma.blogPost.update({
            where: { id: post.id },
            data: { content: newContent }
        });
        console.log("Banner inserted successfully.");
    } else {
        console.error("Target section text not found in content.");
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
