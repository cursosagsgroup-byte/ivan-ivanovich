
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SLUG = "analisis-historico-efectividad-proteccion-ejecutiva";

// content I previously inserted
const WRONG_BANNER_SRC = "/images/banners/banner4.jpg?v=2";
// content I want to use (Assuming banner1 is the blue book banner)
const CORRECT_BANNER_SRC = "/images/banners/banner1.jpg?v=2";

async function main() {
    const post = await prisma.blogPost.findUnique({
        where: { slug: SLUG }
    });

    if (!post) {
        console.error("Post not found!");
        return;
    }

    if (post.content.includes(WRONG_BANNER_SRC)) {
        console.log("Found wrong banner src. Swapping to correct one...");

        const newContent = post.content.replace(WRONG_BANNER_SRC, CORRECT_BANNER_SRC);

        await prisma.blogPost.update({
            where: { id: post.id },
            data: { content: newContent }
        });
        console.log("Banner swapped to banner1.jpg successfully.");
    } else {
        console.error("The incorrect banner src was not found. Maybe it was already changed or different?");
        // Should I try to insert banner1 if banner4 isn't there?
        // User implies the structure is there but image is wrong.
        // But if I can't find it, I should assert the state.
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
