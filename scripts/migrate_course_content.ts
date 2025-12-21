import { PrismaClient } from '@prisma/client';
import mysql from 'mysql2/promise';

const prisma = new PrismaClient();

const MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wordpress_temp'
};

async function main() {
    console.log('📚 Starting course content migration (Hierarchical)...\n');

    const connection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ Connected to MySQL\n');

    try {
        // Get courses
        const [wpCourses] = await connection.execute<any[]>(`
            SELECT ID, post_title
            FROM wpgw_posts
            WHERE post_type = 'courses' AND post_status = 'publish'
        `);

        console.log(`Found ${wpCourses.length} courses to process`);

        for (const wpCourse of wpCourses) {
            console.log(`\n📖 Processing course: ${wpCourse.post_title} (ID: ${wpCourse.ID})`);

            // Find course in Prisma
            const prismaCourse = await prisma.course.findFirst({
                where: {
                    title: {
                        contains: wpCourse.post_title.substring(0, 20)
                    }
                }
            });

            if (!prismaCourse) {
                console.log(`  ⏭️  Course not found in new system, skipping...`);
                continue;
            }
            console.log(`  ✓ Matched with Prisma Course ID: ${prismaCourse.id}`);

            // 1. Find Topics (Modules)
            const [topics] = await connection.execute<any[]>(`
                SELECT ID, post_title, post_content, menu_order
                FROM wpgw_posts
                WHERE post_type = 'topics'
                AND post_parent = ?
                ORDER BY menu_order ASC
            `, [wpCourse.ID]);

            console.log(`  Found ${topics.length} topics (modules)`);

            let moduleCount = 0;
            for (const wpTopic of topics) {
                // Create or update module
                let module = await prisma.module.findFirst({
                    where: {
                        courseId: prismaCourse.id,
                        title: wpTopic.post_title
                    }
                });

                if (!module) {
                    module = await prisma.module.create({
                        data: {
                            courseId: prismaCourse.id,
                            title: wpTopic.post_title,
                            description: wpTopic.post_content || '',
                            order: wpTopic.menu_order || moduleCount + 1
                        }
                    });
                    console.log(`    ✓ Created module: ${wpTopic.post_title}`);
                } else {
                    console.log(`    ✓ Module exists: ${wpTopic.post_title}`);
                }
                moduleCount++;

                // 2. Find Lessons for this Topic
                const [lessons] = await connection.execute<any[]>(`
                    SELECT ID, post_title, post_content, menu_order
                    FROM wpgw_posts
                    WHERE post_type = 'lesson'
                    AND post_parent = ?
                    ORDER BY menu_order ASC
                `, [wpTopic.ID]);

                console.log(`      Found ${lessons.length} lessons in topic`);

                for (const wpLesson of lessons) {
                    const existingLesson = await prisma.lesson.findFirst({
                        where: {
                            moduleId: module.id,
                            title: wpLesson.post_title
                        }
                    });

                    if (existingLesson) {
                        // console.log(`        ⏭️  Lesson exists: ${wpLesson.post_title}`);
                        continue;
                    }

                    // Get video URL
                    const [videoMeta] = await connection.execute<any[]>(`
                        SELECT meta_value
                        FROM wpgw_postmeta
                        WHERE post_id = ?
                        AND meta_key = '_video'
                    `, [wpLesson.ID]);

                    let videoUrl = null;
                    if (videoMeta.length > 0 && videoMeta[0].meta_value) {
                        try {
                            const videoData = JSON.parse(videoMeta[0].meta_value);
                            videoUrl = videoData.source_url || videoData.source_video_id || null;
                        } catch (e) {
                            videoUrl = videoMeta[0].meta_value;
                        }
                    }

                    await prisma.lesson.create({
                        data: {
                            moduleId: module.id,
                            title: wpLesson.post_title,
                            content: wpLesson.post_content || '',
                            videoUrl: videoUrl,
                            order: wpLesson.menu_order || 0,
                            duration: 0
                        }
                    });
                    // console.log(`        ✓ Created lesson: ${wpLesson.post_title}`);
                }

                // 3. Find Quizzes for this Topic
                const [quizzes] = await connection.execute<any[]>(`
                    SELECT ID, post_title, post_content, menu_order
                    FROM wpgw_posts
                    WHERE post_type = 'tutor_quiz'
                    AND post_parent = ?
                    ORDER BY menu_order ASC
                `, [wpTopic.ID]);

                console.log(`      Found ${quizzes.length} quizzes in topic`);

                for (const wpQuiz of quizzes) {
                    const existingQuiz = await prisma.quiz.findFirst({
                        where: {
                            moduleId: module.id,
                            title: wpQuiz.post_title
                        }
                    });

                    if (existingQuiz) {
                        continue;
                    }

                    const quiz = await prisma.quiz.create({
                        data: {
                            moduleId: module.id,
                            title: wpQuiz.post_title,
                            description: wpQuiz.post_content || '',
                            passingScore: 70,
                            timeLimit: 0,
                            order: wpQuiz.menu_order || 0
                        }
                    });

                    // Get Questions
                    const [questions] = await connection.execute<any[]>(`
                        SELECT 
                            question_id,
                            question_title,
                            question_description,
                            question_type,
                            question_mark,
                            question_order
                        FROM wpgw_tutor_quiz_questions
                        WHERE quiz_id = ?
                        ORDER BY question_order ASC
                    `, [wpQuiz.ID]);

                    for (const wpQuestion of questions) {
                        // Get Answers
                        const [answers] = await connection.execute<any[]>(`
                            SELECT 
                                answer_title,
                                is_correct,
                                answer_order
                            FROM wpgw_tutor_quiz_question_answers
                            WHERE belongs_question_id = ?
                            ORDER BY answer_order ASC
                        `, [wpQuestion.question_id]);

                        const options = answers.map((a: any) => ({
                            text: a.answer_title,
                            isCorrect: a.is_correct === '1' || a.is_correct === 1
                        }));

                        const correctAnswer = options.find((o: any) => o.isCorrect)?.text || '';

                        await prisma.question.create({
                            data: {
                                quizId: quiz.id,
                                question: wpQuestion.question_title,
                                type: wpQuestion.question_type === 'true_false' ? 'TRUE_FALSE' :
                                    wpQuestion.question_type === 'single_choice' ? 'MULTIPLE_CHOICE' :
                                        'MULTIPLE_CHOICE',
                                points: parseFloat(wpQuestion.question_mark) || 1,
                                order: wpQuestion.question_order || 0,
                                options: JSON.stringify(options),
                                correctAnswer: correctAnswer
                            }
                        });
                    }
                    console.log(`        ✓ Created quiz: ${wpQuiz.post_title}`);
                }
            }
        }

        console.log('\n🎉 Course content migration completed successfully!');

    } catch (error) {
        console.error('❌ Migration error:', error);
        throw error;
    } finally {
        await connection.end();
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error('Fatal error:', e);
        process.exit(1);
    });
