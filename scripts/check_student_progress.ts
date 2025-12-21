import mysql from 'mysql2/promise';

const MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wordpress_temp'
};

async function main() {
    console.log('🔍 Buscando datos de progreso de estudiantes...\n');

    try {
        const connection = await mysql.createConnection(MYSQL_CONFIG);
        console.log('✅ Conectado a MySQL\n');

        // Buscar en postmeta relaciones de estudiantes con cursos
        console.log('📊 Buscando inscripciones en postmeta...\n');

        const [enrollmentMeta] = await connection.execute<any[]>(`
            SELECT COUNT(*) as count 
            FROM wpgw_postmeta 
            WHERE meta_key = '_tutor_enrolled_course_users'
        `);
        console.log(`Registros de inscripciones en postmeta: ${enrollmentMeta[0].count}`);

        // Buscar en usermeta
        const [userCourseMeta] = await connection.execute<any[]>(`
            SELECT COUNT(*) as count 
            FROM wpgw_usermeta 
            WHERE meta_key LIKE '%tutor%course%' OR meta_key LIKE '%enrolled%'
        `);
        console.log(`Registros de cursos en usermeta: ${userCourseMeta[0].count}`);

        // Buscar intentos de quiz (esto indica estudiantes activos)
        const [quizAttempts] = await connection.execute<any[]>(`
            SELECT COUNT(*) as count FROM wpgw_tutor_quiz_attempts
        `);
        console.log(`Intentos de quiz: ${quizAttempts[0].count}`);

        if (quizAttempts[0].count > 0) {
            const [uniqueStudentsQuiz] = await connection.execute<any[]>(`
                SELECT COUNT(DISTINCT user_id) as count FROM wpgw_tutor_quiz_attempts
            `);
            console.log(`Estudiantes únicos con intentos de quiz: ${uniqueStudentsQuiz[0].count}`);

            // Mostrar ejemplo
            const [sample] = await connection.execute<any[]>(`
                SELECT 
                    qa.user_id,
                    u.user_email,
                    u.display_name,
                    qa.course_id,
                    p.post_title as course_name,
                    COUNT(*) as quiz_attempts
                FROM wpgw_tutor_quiz_attempts qa
                LEFT JOIN wpgw_users u ON qa.user_id = u.ID
                LEFT JOIN wpgw_posts p ON qa.course_id = p.ID
                GROUP BY qa.user_id, qa.course_id
                LIMIT 5
            `);

            console.log('\n📚 Ejemplos de estudiantes con actividad:');
            sample.forEach((s: any) => {
                console.log(`  - ${s.display_name} (${s.user_email})`);
                console.log(`    Curso: ${s.course_name}`);
                console.log(`    Intentos de quiz: ${s.quiz_attempts}\n`);
            });
        }

        // Buscar en comments (Tutor a veces usa comments para progreso)
        const [comments] = await connection.execute<any[]>(`
            SELECT COUNT(*) as count 
            FROM wpgw_comments 
            WHERE comment_type LIKE '%tutor%'
        `);
        console.log(`\nComentarios de Tutor: ${comments[0].count}`);

        // Buscar relaciones curso-estudiante en cualquier tabla
        console.log('\n🔎 Buscando otras posibles fuentes de inscripciones...');

        const [postRelations] = await connection.execute<any[]>(`
            SELECT 
                pm.meta_key,
                COUNT(*) as count
            FROM wpgw_postmeta pm
            INNER JOIN wpgw_posts p ON pm.post_id = p.ID
            WHERE p.post_type = 'courses'
            AND pm.meta_key LIKE '%student%' OR pm.meta_key LIKE '%enroll%' OR pm.meta_key LIKE '%user%'
            GROUP BY pm.meta_key
            ORDER BY count DESC
            LIMIT 10
        `);

        if (postRelations.length > 0) {
            console.log('\nMeta keys relacionados con estudiantes en cursos:');
            postRelations.forEach((r: any) => {
                console.log(`  - ${r.meta_key}: ${r.count} registros`);
            });
        }

        await connection.end();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

main();
