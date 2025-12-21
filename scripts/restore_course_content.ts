import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function importCourseFromJSON(jsonPath: string, courseTitle: string) {
    console.log(`\n📚 Importing course from ${path.basename(jsonPath)}...`);

    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    const fullData = JSON.parse(jsonContent);

    // Navigate to the correct structure: data[0].data.course
    const courseData = fullData.data[0].data.course;
    const contents = courseData.contents || [];

    console.log(`Found ${contents.length} topics (modules) in JSON`);

    // Find the course in the database
    const course = await prisma.course.findFirst({
        where: {
            title: {
                contains: courseTitle
            }
        }
    });

    if (!course) {
        console.log(`❌ Course "${courseTitle}" not found in database`);
        return;
    }

    console.log(`✅ Found course: ${course.title} (ID: ${course.id})\n`);

    let totalLessons = 0;
    let totalVideos = 0;
    let totalQuizzes = 0;

    // Import topics (modules)
    for (const topic of contents) {
        // Create module
        const module = await prisma.module.create({
            data: {
                courseId: course.id,
                title: topic.post_title,
                description: topic.post_content || '',
                order: topic.menu_order || 0
            }
        });

        console.log(`📖 Module: ${module.title}`);

        // Import lessons and quizzes from children
        if (topic.children && Array.isArray(topic.children)) {
            for (const child of topic.children) {
                if (child.post_type === 'lesson') {
                    let videoUrl = null;

                    // Extract video URL from meta
                    if (child.meta && child.meta._video && Array.isArray(child.meta._video)) {
                        const videoData = child.meta._video[0];

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

                            // Try source_url
                            if (!videoUrl && videoData.source_url) {
                                videoUrl = videoData.source_url;
                            }
                        }
                    }

                    await prisma.lesson.create({
                        data: {
                            moduleId: module.id,
                            title: child.post_title,
                            content: child.post_content || '',
                            videoUrl: videoUrl,
                            order: child.menu_order || 0,
                            duration: 0
                        }
                    });

                    totalLessons++;
                    if (videoUrl) totalVideos++;

                    const videoStatus = videoUrl ? '🎥' : '📄';
                    console.log(`  ${videoStatus} ${child.post_title}`);

                } else if (child.post_type === 'tutor_quiz') {
                    const quiz = await prisma.quiz.create({
                        data: {
                            moduleId: module.id,
                            title: child.post_title,
                            description: child.post_content || '',
                            passingScore: 70,
                            timeLimit: 0,
                            order: child.menu_order || 0
                        }
                    });

                    totalQuizzes++;
                    console.log(`  ❓ Quiz: ${child.post_title}`);

                    // Import questions if available
                    if (child.questions && Array.isArray(child.questions)) {
                        for (const questionData of child.questions) {
                            const options = questionData.answers?.map((a: any) => ({
                                text: a.answer_title,
                                isCorrect: a.is_correct === '1' || a.is_correct === 1
                            })) || [];

                            const correctAnswer = options.find((o: any) => o.isCorrect)?.text || '';

                            await prisma.question.create({
                                data: {
                                    quizId: quiz.id,
                                    question: questionData.question_title,
                                    type: questionData.question_type === 'true_false' ? 'TRUE_FALSE' : 'MULTIPLE_CHOICE',
                                    points: parseFloat(questionData.question_mark) || 1,
                                    order: questionData.question_order || 0,
                                    options: JSON.stringify(options),
                                    correctAnswer: correctAnswer
                                }
                            });
                        }
                        console.log(`    ✓ Imported ${child.questions.length} questions`);
                    }
                }
            }
        }
        console.log('');
    }

    console.log(`✨ Import complete for "${course.title}":`);
    console.log(`   📖 Modules: ${contents.length}`);
    console.log(`   📝 Lessons: ${totalLessons}`);
    console.log(`   🎥 Videos: ${totalVideos}`);
    console.log(`   ❓ Quizzes: ${totalQuizzes}`);
}

async function main() {
    console.log('🚀 Starting course content restoration...\n');

    try {
        // Import Team Leader course
        await importCourseFromJSON(
            path.join(process.cwd(), 'temp', '883.json'),
            'Team Leader'
        );

        // Import Contravigilancia course
        await importCourseFromJSON(
            path.join(process.cwd(), 'temp', '9917.json'),
            'Contravigilancia'
        );

        console.log('\n🎉 All courses restored successfully!');

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error('Fatal error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
