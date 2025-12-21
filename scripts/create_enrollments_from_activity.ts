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
    console.log('🚀 Creando inscripciones basadas en actividad de estudiantes...\n');
    console.log('⚠️  MODO SEGURO: Solo se agregarán inscripciones nuevas.\n');

    const connection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ Conectado a MySQL\n');

    try {
        // Obtener todos los estudiantes con actividad en cada curso
        const [enrollments] = await connection.execute<any[]>(`
            SELECT DISTINCT
                qa.user_id,
                qa.course_id,
                u.user_email,
                u.display_name,
                c.post_title as course_name,
                MIN(qa.attempt_started_at) as first_activity
            FROM wpgw_tutor_quiz_attempts qa
            LEFT JOIN wpgw_users u ON qa.user_id = u.ID
            LEFT JOIN wpgw_posts c ON qa.course_id = c.ID
            WHERE u.user_email IS NOT NULL
            AND c.post_title IS NOT NULL
            GROUP BY qa.user_id, qa.course_id, u.user_email, u.display_name, c.post_title
            ORDER BY first_activity
        `);

        console.log(`Encontradas ${enrollments.length} inscripciones potenciales basadas en actividad\n`);

        let enrollmentsCreated = 0;
        let enrollmentsSkipped = 0;
        let usersNotFound = 0;
        let coursesNotFound = 0;

        for (const enrollment of enrollments) {
            // Buscar el usuario en nuestra base de datos
            const user = await prisma.user.findUnique({
                where: { email: enrollment.user_email }
            });

            if (!user) {
                usersNotFound++;
                continue;
            }

            // Buscar el curso en nuestra base de datos
            const course = await prisma.course.findFirst({
                where: { title: enrollment.course_name }
            });

            if (!course) {
                coursesNotFound++;
                console.log(`⚠️  Curso no encontrado: "${enrollment.course_name}"`);
                continue;
            }

            // Verificar si la inscripción ya existe
            const existingEnrollment = await prisma.enrollment.findFirst({
                where: {
                    userId: user.id,
                    courseId: course.id
                }
            });

            if (existingEnrollment) {
                enrollmentsSkipped++;
                continue;
            }

            // Crear la inscripción
            await prisma.enrollment.create({
                data: {
                    userId: user.id,
                    courseId: course.id,
                    progress: 0, // Se calculará después
                    enrolledAt: enrollment.first_activity ? new Date(enrollment.first_activity) : new Date()
                }
            });

            enrollmentsCreated++;

            if (enrollmentsCreated % 50 === 0) {
                console.log(`  ✓ ${enrollmentsCreated} inscripciones creadas...`);
            }
        }

        console.log(`\n✅ Inscripciones creadas: ${enrollmentsCreated}`);
        console.log(`⏭️  Inscripciones ya existentes: ${enrollmentsSkipped}`);
        console.log(`⚠️  Usuarios no encontrados: ${usersNotFound}`);
        console.log(`⚠️  Cursos no encontrados: ${coursesNotFound}\n`);

        // Ahora calcular el progreso de cada inscripción
        console.log('📊 Calculando progreso de estudiantes...\n');

        const allEnrollments = await prisma.enrollment.findMany({
            include: {
                course: {
                    include: {
                        modules: {
                            include: {
                                lessons: true,
                                quizzes: true
                            }
                        }
                    }
                },
                user: true
            }
        });

        let progressUpdated = 0;

        for (const enroll of allEnrollments) {
            // Contar total de items en el curso (lecciones + quizzes)
            let totalItems = 0;
            let completedItems = 0;

            for (const module of enroll.course.modules) {
                totalItems += module.lessons.length;
                totalItems += module.quizzes.length;

                // Contar quizzes completados (aprobados)
                for (const quiz of module.quizzes) {
                    const passedAttempt = await prisma.quizAttempt.findFirst({
                        where: {
                            userId: enroll.userId,
                            quizId: quiz.id,
                            passed: true
                        }
                    });

                    if (passedAttempt) {
                        completedItems++;
                    }
                }
            }

            // Calcular progreso
            const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

            // Actualizar solo si el progreso cambió
            if (enroll.progress !== progress) {
                await prisma.enrollment.update({
                    where: { id: enroll.id },
                    data: { progress }
                });
                progressUpdated++;
            }

            if (progressUpdated % 100 === 0 && progressUpdated > 0) {
                console.log(`  ✓ ${progressUpdated} progresos actualizados...`);
            }
        }

        console.log(`\n✅ Progreso actualizado para ${progressUpdated} inscripciones\n`);

        // Resumen final
        console.log('🎉 Proceso completado!\n');
        console.log('📊 RESUMEN FINAL:');
        console.log(`   Inscripciones creadas: ${enrollmentsCreated}`);
        console.log(`   Inscripciones ya existentes: ${enrollmentsSkipped}`);
        console.log(`   Progresos actualizados: ${progressUpdated}`);

    } catch (error) {
        console.error('❌ Error:', error);
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
