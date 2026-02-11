
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log(`🔍 Listing all courses to find "Protección Ejecutiva"...`);

    try {
        const courses = await prisma.course.findMany({
            include: {
                topics: {
                    include: {
                        lessons: true
                    }
                }
            }
        });

        console.log(`Fetched ${courses.length} courses.`);

        const targetCourse = courses.find(c => c.title.includes("Protección Ejecutiva") || c.title.includes("Proteccion Ejecutiva"));

        if (targetCourse) {
            console.log('✅ Course found:');
            console.log(`ID: ${targetCourse.id}`);
            console.log(`Slug: ${targetCourse.slug}`);
            console.log(`Title: ${targetCourse.title}`);
            console.log(`Status: ${targetCourse.published ? 'Published' : 'Draft'}`);

            console.log('\n--- Structure ---');
            if (targetCourse.topics) {
                for (const topic of targetCourse.topics) {
                    console.log(`Topic: ${topic.title} (${topic.lessons.length} lessons)`);
                    for (const lesson of topic.lessons) {
                        console.log(`  - Lesson: ${lesson.title} (ID: ${lesson.id})`);
                        // Check for potential issues in content
                        if (!lesson.content) console.log('    ⚠️  Content is empty');
                        else {
                            if (lesson.content.includes('<script')) console.log('    ⚠️  Contains <script> tag');
                            if (lesson.content.includes('iframe')) console.log('    ⚠️  Contains <iframe> tag');
                            // Check for empty paragraphs or suspicious HTML
                            if (lesson.content.includes('<p></p>')) console.log('    ⚠️  Contains empty <p> tags');
                        }
                    }
                }
            }

            // Output the full content of the first lesson for inspection
            if (targetCourse.topics.length > 0 && targetCourse.topics[0].lessons.length > 0) {
                console.log('\n--- First Lesson Content Preview ---');
                console.log(targetCourse.topics[0].lessons[0].content?.substring(0, 500));
            }

        } else {
            console.log('❌ Course NOT found. Listing all titles:');
            courses.forEach(c => console.log(`- ${c.title} (${c.slug})`));
        }

    } catch (e) {
        console.error('Error querying:', e);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
