
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SLUG = "analisis-historico-efectividad-proteccion-ejecutiva";

async function main() {
    const post = await prisma.blogPost.findUnique({
        where: { slug: SLUG },
        select: { content: true }
    });

    if (!post) {
        console.error("Post not found!");
        return;
    }

    const targetText = "Protección Anticipatoria";
    const index = post.content.indexOf(targetText);

    if (index !== -1) {
        // Print context: 500 chars before and after
        console.log("--- Content Context ---");
        console.log(post.content.substring(Math.max(0, index - 500), index + 200));
        console.log("-----------------------");
    } else {
        console.log("Target text not found!");
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
