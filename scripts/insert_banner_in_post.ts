
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SLUG = "analisis-historico-efectividad-proteccion-ejecutiva";
const BANNER_HTML = `
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

    // Target the specific section header
    // Based on the previous creation script, it was an <h4>
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
        console.error("Target section text not found in content. Checking content sample:");
        console.log(post.content.substring(0, 500)); // Debug if needed

        // Fallback try: maybe it's just text without h4 if something changed (unlikely) or maybe h3?
        // But I am confident I created it with h4 in create_pinned_post.ts.
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
