import { PrismaClient } from '@prisma/client';
import mysql from 'mysql2/promise';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Restoring video URLs from WordPress...\n');

    // Connect to WordPress database
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'wordpress_temp'
    });

    // Get all lessons from WordPress with video metadata
    const [wpLessons] = await connection.execute<any[]>(`
        SELECT 
            p.ID,
            p.post_title,
            pm.meta_value as video_data
        FROM wpgw_posts p
        JOIN wpgw_postmeta pm ON p.ID = pm.post_id
        WHERE p.post_type = 'lesson'
        AND pm.meta_key = '_video'
        AND pm.meta_value != ''
    `);

    console.log(`Found ${wpLessons.length} lessons with video in WordPress\n`);

    let restoredCount = 0;
    let skippedCount = 0;

    for (const wpLesson of wpLessons) {
        let vimeoUrl = null;

        // Try to extract Vimeo URL from iframe/embedded code
        const vimeoMatch = wpLesson.video_data.match(/https:\/\/player\.vimeo\.com\/video\/(\d+)/);
        if (vimeoMatch) {
            vimeoUrl = `https://vimeo.com/${vimeoMatch[1]}`;
        } else {
            // Try to parse as JSON
            try {
                const videoData = JSON.parse(wpLesson.video_data);
                if (videoData.source_url) {
                    vimeoUrl = videoData.source_url;
                } else if (videoData.source_video_id) {
                    vimeoUrl = videoData.source_video_id;
                }
            } catch (e) {
                // Not JSON, skip
            }
        }

        if (vimeoUrl) {
            // Clean the title (remove markdown formatting)
            const cleanTitle = wpLesson.post_title.replace(/\*\*/g, '').trim();

            // Find the lesson in our database by title (try both original and cleaned)
            let lesson = await prisma.lesson.findFirst({
                where: {
                    OR: [
                        { title: wpLesson.post_title },
                        { title: cleanTitle }
                    ]
                }
            });

            if (lesson) {
                // Update only if the current videoUrl is empty or null
                if (!lesson.videoUrl) {
                    await prisma.lesson.update({
                        where: { id: lesson.id },
                        data: { videoUrl: vimeoUrl }
                    });
                    restoredCount++;
                    console.log(`✓ Restored: ${lesson.title} -> ${vimeoUrl}`);
                } else {
                    skippedCount++;
                }
            }
        }
    }

    await connection.end();
    console.log(`\n✅ Restored ${restoredCount} video URLs`);
    console.log(`⏭️  Skipped ${skippedCount} (already have URL)`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
