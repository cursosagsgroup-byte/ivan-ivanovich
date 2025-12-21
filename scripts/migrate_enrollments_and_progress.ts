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
    console.log('🚀 Iniciando migración de inscripciones y progreso...\n');
    console.log('⚠️  MODO SEGURO: Solo se agregarán datos nuevos, NO se borrará nada.\n');

    const connection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ Conectado a MySQL\n');

    try {
        // ============================================
        // PASO 1: Migrar Inscripciones
        // ============================================
        console.log('📚 PASO 1: Migrando inscripciones...\n');

        // Obtener todas las inscripciones desde WordPress
        const [enrollmentRecords] = await connection.execute<any[]>(`
            SELECT 
                pm.post_id as course_wp_id,
                pm.meta_value as user_wp_id,
                p.post_title as course_title
            FROM wpgw_postmeta pm
            INNER JOIN wpgw_posts p ON pm.post_id = p.ID
            WHERE pm.meta_key = '_tutor_enrolled_by_order_id'
            AND p.post_type = 'courses'
            AND p.post_status = 'publish'
        `);

        console.log(`Encontradas ${enrollmentRecords.length} inscripciones en WordPress\n`);

        let enrollmentsCreated = 0;
        let enrollmentsSkipped = 0;

        for (const record of enrollmentRecords) {
            // Obtener el email del usuario de WordPress
            const [wpUser] = await connection.execute<any[]>(
                'SELECT user_email FROM wpgw_users WHERE ID = ?',
                [record.user_wp_id]
            );

            if (wpUser.length === 0) {
                console.log(`⚠️  Usuario WP ID ${record.user_wp_id} no encontrado, saltando...`);
                continue;
            }

            // Buscar el usuario en nuestra base de datos
            const user = await prisma.user.findUnique({
                where: { email: wpUser[0].user_email }
            });

            if (!user) {
                console.log(`⚠️  Usuario ${wpUser[0].user_email} no encontrado en DB, saltando...`);
                continue;
            }

            // Buscar el curso en nuestra base de datos
            const course = await prisma.course.findFirst({
                where: { title: record.course_title }
            });

            if (!course) {
                console.log(`⚠️  Curso "${record.course_title}" no encontrado en DB, saltando...`);
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
                    progress: 0, // Lo actualizaremos después con el progreso real
                    enrolledAt: new Date()
                }
            });

            enrollmentsCreated++;

            if (enrollmentsCreated % 100 === 0) {
                console.log(`  ✓ ${enrollmentsCreated} inscripciones creadas...`);
            }
        }

        console.log(`\n✅ Inscripciones creadas: ${enrollmentsCreated}`);
        console.log(`⏭️  Inscripciones ya existentes: ${enrollmentsSkipped}\n`);

        // ============================================
        // PASO 2: Migrar Progreso de Quizzes
        // ============================================
        console.log('📝 PASO 2: Migrando progreso de quizzes...\n');

        const [quizAttempts] = await connection.execute<any[]>(`
            SELECT 
                qa.attempt_id,
                qa.user_id,
                qa.course_id,
                qa.quiz_id,
                qa.total_questions,
                qa.total_answered_questions,
                qa.total_marks,
                qa.earned_marks,
                qa.attempt_status,
                qa.attempt_started_at,
                qa.attempt_ended_at,
                qa.is_manually_reviewed,
                u.user_email,
                c.post_title as course_title,
                q.post_title as quiz_title
            FROM wpgw_tutor_quiz_attempts qa
            LEFT JOIN wpgw_users u ON qa.user_id = u.ID
            LEFT JOIN wpgw_posts c ON qa.course_id = c.ID
            LEFT JOIN wpgw_posts q ON qa.quiz_id = q.ID
            ORDER BY qa.attempt_id
        `);

        console.log(`Encontrados ${quizAttempts.length} intentos de quiz en WordPress\n`);

        let quizAttemptsCreated = 0;
        let quizAttemptsSkipped = 0;

        for (const attempt of quizAttempts) {
            if (!attempt.user_email) {
                quizAttemptsSkipped++;
                continue;
            }

            // Buscar el usuario en nuestra base de datos
            const user = await prisma.user.findUnique({
                where: { email: attempt.user_email }
            });

            if (!user) {
                quizAttemptsSkipped++;
                continue;
            }

            // Buscar el curso
            const course = await prisma.course.findFirst({
                where: { title: attempt.course_title }
            });

            if (!course) {
                quizAttemptsSkipped++;
                continue;
            }

            // Buscar el quiz por título
            const quiz = await prisma.quiz.findFirst({
                where: {
                    title: attempt.quiz_title,
                    module: {
                        courseId: course.id
                    }
                },
                include: {
                    module: true
                }
            });

            if (!quiz) {
                quizAttemptsSkipped++;
                continue;
            }

            // Verificar si el intento ya existe (usando datos únicos del intento)
            const existingAttempt = await prisma.quizAttempt.findFirst({
                where: {
                    userId: user.id,
                    quizId: quiz.id,
                    attemptedAt: attempt.attempt_started_at ? new Date(attempt.attempt_started_at) : undefined
                }
            });

            if (existingAttempt) {
                quizAttemptsSkipped++;
                continue;
            }

            // Calcular el score
            const score = attempt.total_marks > 0
                ? Math.round((attempt.earned_marks / attempt.total_marks) * 100)
                : 0;

            // Crear el intento de quiz
            await prisma.quizAttempt.create({
                data: {
                    userId: user.id,
                    quizId: quiz.id,
                    score: score,
                    passed: score >= 70, // Asumiendo 70% como passing score
                    answers: JSON.stringify({}), // Campo requerido, se puede mejorar después
                    attemptedAt: attempt.attempt_started_at ? new Date(attempt.attempt_started_at) : new Date()
                }
            });

            quizAttemptsCreated++;

            if (quizAttemptsCreated % 500 === 0) {
                console.log(`  ✓ ${quizAttemptsCreated} intentos de quiz migrados...`);
            }
        }

        console.log(`\n✅ Intentos de quiz creados: ${quizAttemptsCreated}`);
        console.log(`⏭️  Intentos ya existentes o sin datos: ${quizAttemptsSkipped}\n`);

        // ============================================
        // PASO 3: Actualizar Progreso de Inscripciones
        // ============================================
        console.log('📊 PASO 3: Calculando progreso de estudiantes...\n');

        // Obtener todas las inscripciones
        const enrollments = await prisma.enrollment.findMany({
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

        for (const enrollment of enrollments) {
            // Contar total de items en el curso (lecciones + quizzes)
            let totalItems = 0;
            let completedItems = 0;

            for (const module of enrollment.course.modules) {
                totalItems += module.lessons.length;
                totalItems += module.quizzes.length;

                // Contar quizzes completados
                for (const quiz of module.quizzes) {
                    const passedAttempt = await prisma.quizAttempt.findFirst({
                        where: {
                            userId: enrollment.userId,
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
            if (enrollment.progress !== progress) {
                await prisma.enrollment.update({
                    where: { id: enrollment.id },
                    data: { progress }
                });
                progressUpdated++;
            }
        }

        console.log(`✅ Progreso actualizado para ${progressUpdated} inscripciones\n`);

        // ============================================
        // RESUMEN FINAL
        // ============================================
        console.log('🎉 Migración completada!\n');
        console.log('📊 RESUMEN:');
        console.log(`   Inscripciones creadas: ${enrollmentsCreated}`);
        console.log(`   Inscripciones ya existentes: ${enrollmentsSkipped}`);
        console.log(`   Intentos de quiz migrados: ${quizAttemptsCreated}`);
        console.log(`   Intentos ya existentes: ${quizAttemptsSkipped}`);
        console.log(`   Progresos actualizados: ${progressUpdated}`);

    } catch (error) {
        console.error('❌ Error durante la migración:', error);
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
