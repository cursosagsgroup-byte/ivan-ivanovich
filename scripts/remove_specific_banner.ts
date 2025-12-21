
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SLUG = "analisis-historico-efectividad-proteccion-ejecutiva";

async function main() {
    const post = await prisma.blogPost.findUnique({
        where: { slug: SLUG }
    });

    if (!post) {
        console.error("Post not found!");
        return;
    }

    // Regex to match the banner div structure followed optionally by whitespace/newlines, then the target H4
    // The banner structure we used: <div ...><img ...></div>
    // The target: <h4>La Omisión Crítica: Protección Anticipatoria</h4>

    // We'll try to safe remove common variations of what we inserted.
    // We inserted: <div class="my-8 w-full flex justify-center">\n    <img src="..." ... />\n</div>\n<h4>...</h4>

    const targetHeader = "<h4>La Omisión Crítica: Protección Anticipatoria</h4>";

    // Construct a regex that finds the banner div before the header
    const regex = /(<div class="my-8 w-full flex justify-center">\s*<img[^>]+>\s*<\/div>\s*)(<h4>La Omisión Crítica: Protección Anticipatoria<\/h4>)/;

    if (regex.test(post.content)) {
        console.log("Found banner above target header. Removing banner...");
        // Replace with just group 2 (the header)
        const newContent = post.content.replace(regex, "$2");

        await prisma.blogPost.update({
            where: { id: post.id },
            data: { content: newContent }
        });
        console.log("Banner removed.");
    } else {
        console.log("Banner NOT found exactly above the header with expected structure.");
        console.log("Trying looser match (banner only)...");

        // If we can't match strict context, maybe just remove the specific banners we inserted if they exist?
        // But we must be careful not to remove *other* banners if auto-injected (auto ones are usually done at runtime in page.tsx, not in DB content).
        // So any banner in DB content is likely manual. S let's remove banners containing 'banner1' or 'banner4'.

        const bannerOneRegex = /<div class="my-8 w-full flex justify-center">\s*<img src="\/images\/banners\/banner1\.jpg\?v=2"[^>]+>\s*<\/div>/g;
        const bannerFourRegex = /<div class="my-8 w-full flex justify-center">\s*<img src="\/images\/banners\/banner4\.jpg\?v=2"[^>]+>\s*<\/div>/g;

        let tempContent = post.content;
        let changed = false;

        if (bannerOneRegex.test(tempContent)) {
            tempContent = tempContent.replace(bannerOneRegex, "");
            changed = true;
            console.log("Removed banner1 instances.");
        }
        if (bannerFourRegex.test(tempContent)) {
            tempContent = tempContent.replace(bannerFourRegex, "");
            changed = true;
            console.log("Removed banner4 instances.");
        }

        if (changed) {
            await prisma.blogPost.update({
                where: { id: post.id },
                data: { content: tempContent }
            });
            console.log("Banners removed via looser match.");
        } else {
            console.log("No known manual banners found to remove.");
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
