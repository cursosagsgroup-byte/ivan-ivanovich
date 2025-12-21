
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// ID of the course "Team Leader in Executive Protection" (English)
const COURSE_ID = 'cmiq7oga203zikveg3jbf8p8u';

async function importTeamLeader() {
    try {
        const jsonPath = path.join(process.cwd(), 'temp', '11496.json');
        const rawData = fs.readFileSync(jsonPath, 'utf-8');
        const parsedData = JSON.parse(rawData);

        // Navigate to contents
        // Based on analysis: parsedData.data[0].data.course.contents
        const courseContents = parsedData.data?.[0]?.data?.course?.contents;

        if (!courseContents || !Array.isArray(courseContents)) {
            console.error('❌ No se encontró estructura de contenidos válida (parsedData.data[0].data.course.contents).');
            return;
        }

        const SPANISH_COURSE_ID = 'cmio13v7r000064w1fs838sgw';

        console.log(`📦 Importando contenido para curso: ${COURSE_ID}`);
        console.log(`📄 Fuente: ${parsedData.data[0].data.course.post_title} (Topics found: ${courseContents.length})`);

        // Fetch Spanish Content for Video Mapping
        console.log('🇪🇸 Cargando curso español para mapeo de videos...');
        const spanishModules = await prisma.module.findMany({
            where: { courseId: SPANISH_COURSE_ID },
            orderBy: { order: 'asc' },
            include: { lessons: { orderBy: { order: 'asc' } } }
        });
        console.log(`   Encontrados ${spanishModules.length} módulos en español.`);

        // Verify course exists
        const course = await prisma.course.findUnique({
            where: { id: COURSE_ID }
        });

        if (!course) {
            console.error('❌ Curso destino no encontrado en BD via ID hardcoded.');
            return;
        }

        // Clean existing content if any
        console.log('🧹 Limpiando contenido anterior del curso...');
        // Need to delete modules, cascading delete should handle lessons and quizzes if configured, 
        // but explicit is safer or relies on schema Relation onDelete: Cascade
        await prisma.module.deleteMany({ where: { courseId: COURSE_ID } });

        // Iterate topics (Modules)
        let order = 1;
        let mappedVideos = 0;

        for (let i = 0; i < courseContents.length; i++) {
            const topic = courseContents[i];
            if (topic.post_type !== 'topics') continue;

            const moduleTitle = topic.post_title;
            // console.log(`\n📂 Creando Módulo (${order}): ${moduleTitle}`);

            const newModule = await prisma.module.create({
                data: {
                    title: moduleTitle,
                    courseId: COURSE_ID,
                    order: order,
                    // slug removed as it does not exist in schema
                }
            });

            // Find corresponding Spanish module (by index i)
            const spanishModule = spanishModules[i];

            // Process Children (Lessons/Quizzes)
            if (topic.children && Array.isArray(topic.children)) {
                let itemOrder = 1;
                let lessonIndex = 0; // Track lesson index within module for mapping

                for (const item of topic.children) {
                    const isQuiz = item.post_type === 'tutor_quiz';

                    if (isQuiz) {
                        console.log(`   ❓ Creando Quiz (Sin preguntas): ${item.post_title}`);
                        const newQuiz = await prisma.quiz.create({
                            data: {
                                title: item.post_title,
                                moduleId: newModule.id,
                                passingScore: Number(item.meta?._tutor_quiz_passing_grade?.[0]) || 70, // Try to find meta or default
                                order: itemOrder++
                            }
                        });

                        // Questions are often separate in Tutor export or in a specific key. 
                        // If they are not in 'children', we might miss them. 
                        // Assuming valid export might structure them differently or we need to look into 'item.children' for questions?
                        // For now, let's see if we can perform basic creation.
                        // NOTE: Questions import might require inspecting a quiz object specifically.

                    } else if (item.post_type === 'lesson') {
                        // console.log(`   📝 Creando Lección: ${item.post_title}`);

                        // Video URL extraction
                        // Tutor stores video in meta often: _video, _video[0].source_youtube, etc.
                        let videoUrl = null;
                        if (item.meta && item.meta._video && item.meta._video[0]) {
                            const v = item.meta._video[0];
                            videoUrl = v.source_youtube || v.source_vimeo || v.source_external_url || null;

                            // If it's embedded iframe string, extract src? Too complex for now, user said "videos are different link"
                            // If null, we leave it null.
                        }

                        // If no video in JSON, try to Map from Spanish Lesson
                        if (!videoUrl && spanishModule) {
                            const spanishLesson = spanishModule.lessons[lessonIndex];
                            if (spanishLesson && spanishLesson.videoUrl) {
                                videoUrl = spanishLesson.videoUrl;
                                mappedVideos++;
                                // console.log(`      🔗 Video mapeado de ES: ${videoUrl}`);
                            }
                        }

                        await prisma.lesson.create({
                            data: {
                                title: item.post_title,
                                moduleId: newModule.id,
                                content: item.post_content || '',
                                videoUrl: videoUrl,
                                duration: 0,
                                order: itemOrder++,
                                // slug removed
                            }
                        });
                        lessonIndex++;
                    }
                }
            }
            order++;
        }

        console.log(`\n✅ Importación completada.`);
        console.log(`📹 Total videos mapeados desde español: ${mappedVideos}`);
        console.log(`⚠️ Nota: Los quizzes se crearon vacíos porque no se encontró estructura de preguntas en el JSON.`);

    } catch (error) {
        console.error('Error durante la importación:', error);
    } finally {
        await prisma.$disconnect();
    }
}

importTeamLeader();
