import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('📹 Extracting video URLs from Contravigilancia export (temp/9917.json)...\n');

    const jsonData = JSON.parse(fs.readFileSync('temp/9917.json', 'utf-8'));

    let lessonsFound = 0;
    let videosFound = 0;
    let updatedCount = 0;

    // Adjust this path if the JSON structure is different, but usually it's data[0].data.course
    const courseData = jsonData.data[0].data.course;
    const contents = courseData.contents || [];

    // Iterate through topics (Modules)
    for (const topic of contents) {
        const moduleTitle = topic.post_title;
        console.log(`\nProcessing Module: ${moduleTitle}`);

        // Find module in DB
        const dbModule = await prisma.module.findFirst({
            where: {
                title: moduleTitle,
                course: {
                    title: { contains: 'Contravigilancia' }
                }
            },
            include: {
                lessons: true
            }
        });

        if (!dbModule) {
            console.log(`⚠️  Module not found in DB: ${moduleTitle}`);
            continue;
        }

        if (topic.children && Array.isArray(topic.children)) {
            for (const lesson of topic.children) {
                if (lesson.post_type === 'lesson') {
                    lessonsFound++;
                    const lessonTitle = lesson.post_title;
                    let videoUrl = null;

                    // Extract video from meta
                    if (lesson.meta && lesson.meta._video && Array.isArray(lesson.meta._video)) {
                        const videoData = lesson.meta._video[0];

                        if (videoData) {
                            // Try source_embedded first
                            if (videoData.source_embedded) {
                                const vimeoMatch = videoData.source_embedded.match(/https:\/\/player\.vimeo\.com\/video\/(\d+)/);
                                if (vimeoMatch) {
                                    videoUrl = `https://vimeo.com/${vimeoMatch[1]}`;
                                }
                            }

                            // If not found, try source_vimeo
                            if (!videoUrl && videoData.source_vimeo) {
                                const vimeoMatch = videoData.source_vimeo.match(/vimeo\.com\/(\d+)/);
                                if (vimeoMatch) {
                                    videoUrl = `https://vimeo.com/${vimeoMatch[1]}`;
                                }
                            }

                            if (videoUrl) {
                                videosFound++;
                            }
                        }
                    }

                    // Update in database if we found a video
                    if (videoUrl) {
                        // Find lesson specifically in this module
                        const dbLesson = dbModule.lessons.find(l => l.title === lessonTitle);

                        if (dbLesson && !dbLesson.videoUrl) {
                            await prisma.lesson.update({
                                where: { id: dbLesson.id },
                                data: { videoUrl }
                            });
                            updatedCount++;
                            console.log(`  ✓ Updated: ${lessonTitle}`);
                            console.log(`    URL: ${videoUrl}`);
                        } else if (dbLesson) {
                            console.log(`  ⏭️  Skipped: ${lessonTitle} (already has URL)`);
                        } else {
                            console.log(`  ⚠️  Lesson not found in Module: ${lessonTitle}`);
                        }
                    } else {
                        console.log(`  ❌ No video in JSON: ${lessonTitle}`);
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
