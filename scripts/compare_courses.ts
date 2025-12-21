import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEnglishCourses() {
    try {
        const courses = await prisma.course.findMany({
            include: {
                modules: {
                    include: {
                        lessons: true,
                        quizzes: true
                    }
                }
            }
        });

        const spanishCourses = courses.filter(c => c.language === 'es' || !c.language);
        const englishCourses = courses.filter(c => c.language === 'en');

        console.log('\n📊 COMPARACIÓN DE CURSOS (ES vs EN)\n');
        console.log('━'.repeat(60));

        for (const enCourse of englishCourses) {
            console.log(`\n🇬🇧 Curso EN: ${enCourse.title} (ID: ${enCourse.id})`);

            // Find corresponding Spanish course (simplified matching by similarity or assumption)
            const esCourse = spanishCourses.find(c =>
                (enCourse.title.includes('Team Leader') && c.title.includes('Team Leader')) ||
                (enCourse.title.includes('Counter Surveillance') && c.title.includes('Contravigilancia'))
            );

            if (esCourse) {
                console.log(`EO Curso ES: ${esCourse.title} (ID: ${esCourse.id})`);

                console.log(`\n   Comparación de Estructura:`);
                console.log(`   - Módulos: EN=${enCourse.modules.length} vs ES=${esCourse.modules.length}`);

                let totalLessonsEn = 0;
                let totalLessonsEs = 0;
                let totalQuizzesEn = 0;
                let totalQuizzesEs = 0;

                enCourse.modules.forEach(m => {
                    totalLessonsEn += m.lessons.length;
                    totalQuizzesEn += m.quizzes.length;
                });
                esCourse.modules.forEach(m => {
                    totalLessonsEs += m.lessons.length;
                    totalQuizzesEs += m.quizzes.length;
                });

                console.log(`   - Lecciones: EN=${totalLessonsEn} vs ES=${totalLessonsEs}`);
                console.log(`   - Quizzes:   EN=${totalQuizzesEn} vs ES=${totalQuizzesEs}`);

                console.log(`\n   Muestra de Video URLs (Primeras 3 lecciones):`);
                const enLessons = enCourse.modules.flatMap(m => m.lessons).slice(0, 3);
                const esLessons = esCourse.modules.flatMap(m => m.lessons).slice(0, 3);

                enLessons.forEach((l, i) => {
                    console.log(`   EN [${l.title.substring(0, 20)}...]: ${l.videoUrl || 'SIN VIDEO'}`);
                    if (esLessons[i]) {
                        console.log(`   ES [${esLessons[i].title.substring(0, 20)}...]: ${esLessons[i].videoUrl || 'SIN VIDEO'}`);
                    }
                });

            } else {
                console.log('   ⚠️ No se encontró contraparte en Español automática.');
            }
            console.log('   ' + '─'.repeat(55));
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkEnglishCourses();
