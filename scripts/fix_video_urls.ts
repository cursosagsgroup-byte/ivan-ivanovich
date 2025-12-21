import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔧 Fixing ALL video URLs with serialized data...\n');

    const lessons = await prisma.lesson.findMany({
        where: {
            videoUrl: {
                not: null
            }
        }
    });

    console.log(`Found ${lessons.length} lessons with video data`);

    let fixedCount = 0;
    let clearedCount = 0;

    for (const lesson of lessons) {
        if (!lesson.videoUrl) continue;

        let cleanUrl = lesson.videoUrl;
        let needsUpdate = false;

        // Check if it contains serialized PHP data
        if (lesson.videoUrl.includes('a:9:{') || lesson.videoUrl.includes('s:6:"source"')) {
            // Try to extract Vimeo URL from iframe
            const vimeoMatch = lesson.videoUrl.match(/https:\/\/player\.vimeo\.com\/video\/(\d+)/);
            if (vimeoMatch) {
                cleanUrl = `https://vimeo.com/${vimeoMatch[1]}`;
                needsUpdate = true;
                fixedCount++;
                console.log(`✓ Fixed: ${lesson.title} -> ${cleanUrl}`);
            } else {
                // No Vimeo URL found, clear the field
                cleanUrl = '';
                needsUpdate = true;
                clearedCount++;
                console.log(`⚠ Cleared (no video found): ${lesson.title}`);
            }
        }

        if (needsUpdate) {
            await prisma.lesson.update({
                where: { id: lesson.id },
                data: { videoUrl: cleanUrl || null }
            });
        }
    }

    console.log(`\n✅ Fixed ${fixedCount} video URLs`);
    console.log(`⚠️  Cleared ${clearedCount} URLs without video`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
