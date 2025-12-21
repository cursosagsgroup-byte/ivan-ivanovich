
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const COURSE_ID = 'cmiq7oga703zjkvegaq8v1ir4'; // English Course ID

async function importCounterSurveillance() {
    try {
        const jsonPath = path.join(process.cwd(), 'temp', '17283.json');
        const rawData = fs.readFileSync(jsonPath, 'utf-8');
        const parsedData = JSON.parse(rawData);

        // Navigate to contents
        const courseContents = parsedData.data?.[0]?.data?.course?.contents;

        if (!courseContents || !Array.isArray(courseContents)) {
            console.error('❌ No se encontró estructura de contenidos válida (parsedData.data[0].data.course.contents).');
            return;
        }

        console.log(`📦 Importando contenido para curso: ${COURSE_ID}`);
        console.log(`📄 Fuente: ${parsedData.data[0].data.course.post_title} (Topics found: ${courseContents.length})`);

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
        await prisma.module.deleteMany({ where: { courseId: COURSE_ID } });

        // Iterate topics (Modules)
        let order = 1;

        for (const topic of courseContents) {
            if (topic.post_type !== 'topics') continue;

            const moduleTitle = topic.post_title;
            // console.log(`\n📂 Creando Módulo (${order}): ${moduleTitle}`);

            const newModule = await prisma.module.create({
                data: {
                    title: moduleTitle,
                    courseId: COURSE_ID,
                    order: order,
                }
            });

            // Process Children (Lessons/Quizzes)
            if (topic.children && Array.isArray(topic.children)) {
                let itemOrder = 1;

                for (const item of topic.children) {
                    const isQuiz = item.post_type === 'tutor_quiz';

                    if (isQuiz) {
                        console.log(`   ❓ Creando Quiz (Sin preguntas): ${item.post_title}`);
                        const newQuiz = await prisma.quiz.create({
                            data: {
                                title: item.post_title,
                                moduleId: newModule.id,
                                passingScore: Number(item.meta?._tutor_quiz_passing_grade?.[0]) || 70,
                                order: itemOrder++
                            }
                        });

                    } else if (item.post_type === 'lesson') {
                        // console.log(`   📝 Creando Lección: ${item.post_title}`);

                        // Video URL extraction (Direct from JSON this time!)
                        let videoUrl = null;
                        if (item.meta && item.meta._video && item.meta._video[0]) {
                            const v = item.meta._video[0];
                            videoUrl = v.source_vimeo || v.source_youtube || v.source_external_url || null;
                        }

                        // Fallback/Check log
                        /*
                        if (videoUrl) {
                            console.log(`      🔗 Video encontrado: ${videoUrl}`);
                        } else {
                            console.log(`      ⚠️ Sin video para lección: ${item.post_title}`);
                        }
                        */

                        await prisma.lesson.create({
                            data: {
                                title: item.post_title,
                                moduleId: newModule.id,
                                content: item.post_content || '',
                                videoUrl: videoUrl,
                                duration: 0,
                                order: itemOrder++,
                            }
                        });
                    }
                }
            }
            order++;
        }

        console.log(`\n✅ Importación completada.`);
        console.log(`ℹ️  Videos extraídos directamente del JSON.`);
        console.log(`⚠️ Nota: Los quizzes no se encontraron en el JSON.`);

    } catch (error) {
        console.error('Error durante la importación:', error);
    } finally {
        await prisma.$disconnect();
    }
}

importCounterSurveillance();
