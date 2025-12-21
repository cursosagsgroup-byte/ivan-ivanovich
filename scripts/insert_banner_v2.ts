
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SLUG = "analisis-historico-efectividad-proteccion-ejecutiva";
// Using banner4.jpg based on typically being the footer CTA
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
        console.log("Target header found. inserting banner ABOVE it.");
        // Replace "<h4>Title</h4>" with "Banner <h4>Title</h4>"
        const newContent = post.content.replace(targetText, `${BANNER_HTML}\n${targetText}`);

        await prisma.blogPost.update({
            where: { id: post.id },
            data: { content: newContent }
        });
        console.log("Banner inserted successfully.");
    } else {
        console.error("Target header not found in content:");
        // fallback to find loosely if H tags differ
        const looseTarget = "La Omisión Crítica: Protección Anticipatoria";
        if (post.content.includes(looseTarget)) {
            console.log("Found text without exact tag match. Trying to locate line...");
            // This might fail if it's inside a tag differently, but provided content was simple HTML.
            const parts = post.content.split(looseTarget);
            if (parts.length > 1) {
                // Reconstruct: Part0 + Banner + looseTarget + Part1
                // But we need to keep the opening tag if it exists in Part0 end.
                // Simplest: replace looseTarget with (BANNER + looseTarget)
                // But valid HTML structure matters.
                // If looseTarget is inside <h4>...</h4>, we effectively put banner inside h4?? No.
                // "<h4>La Omission...</h4>"
                // If I replace "La Omission..." with "Banner La Omission...", I get "<h4>Banner La Omission...</h4>". Bad.
                // I need to target the block.
                console.error("Strict H4 match failed. Aborting to avoid breaking HTML layout.");
            }
        }
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
