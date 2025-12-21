import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('📹 Extracting video URLs from Tutor LMS export...\n');

    const jsonData = JSON.parse(fs.readFileSync('temp/883.json', 'utf-8'));

    let lessonsFound = 0;
    let videosFound = 0;
    let updatedCount = 0;

    const courseData = jsonData.data[0].data.course;
    const contents = courseData.contents || [];

    for (const topic of contents) {
        if (topic.children && Array.isArray(topic.children)) {
            for (const lesson of topic.children) {
                if (lesson.post_type === 'lesson') {
                    lessonsFound++;
                    const lessonTitle = lesson.post_title;
                    let videoUrl = null;

                    // Extract video from meta
                    if (lesson.meta && lesson.meta._video && Array.isArray(lesson.meta._video)) {
                        const videoData = lesson.meta._video[0];

                        if (videoData && videoData.source_embedded) {
                            const vimeoMatch = videoData.source_embedded.match(/https:\/\/player\.vimeo\.com\/video\/(\d+)/);
                            if (vimeoMatch) {
                                videoUrl = `https://vimeo.com/${vimeoMatch[1]}`;
                                videosFound++;
                            }
                        }
                    }

                    // Update in database if we found a video
                    if (videoUrl) {
                        const dbLesson = await prisma.lesson.findFirst({
                            where: {
                                title: lessonTitle
                            }
                        });

                        if (dbLesson && !dbLesson.videoUrl) {
                            await prisma.lesson.update({
                                where: { id: dbLesson.id },
                                data: { videoUrl }
                            });
                            updatedCount++;
                            console.log(`✓ Updated: ${lessonTitle}`);
                            console.log(`  URL: ${videoUrl}`);
                        } else if (dbLesson) {
                            console.log(`⏭️  Skipped: ${lessonTitle} (already has URL)`);
                        } else {
                            console.log(`⚠️  Not found in DB: ${lessonTitle}`);
                        }
                    } else {
                        console.log(`❌ No video: ${lessonTitle}`);
                    }
                }
            }
        }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Lessons found in JSON: ${lessonsFound}`);
    console.log(`   Videos found: ${videosFound}`);
    console.log(`   ✅ Updated in database: ${updatedCount}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
