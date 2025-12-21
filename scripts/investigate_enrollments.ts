import mysql from 'mysql2/promise';

const MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wordpress_temp'
};

async function main() {
    console.log('🔍 Investigando inscripciones en WordPress...\n');

    const connection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ Conectado a MySQL\n');

    try {
        // Verificar diferentes formas de encontrar inscripciones
        console.log('1️⃣ Buscando por _tutor_enrolled_by_order_id:');
        const [enrollByOrder] = await connection.execute<any[]>(`
            SELECT COUNT(*) as count
            FROM wpgw_postmeta
            WHERE meta_key = '_tutor_enrolled_by_order_id'
        `);
        console.log(`   Encontrados: ${enrollByOrder[0].count}\n`);

        // Mostrar ejemplo
        if (enrollByOrder[0].count > 0) {
            const [sample] = await connection.execute<any[]>(`
                SELECT 
                    pm.post_id,
                    pm.meta_value as order_id,
                    p.post_title,
                    p.post_type
                FROM wpgw_postmeta pm
                LEFT JOIN wpgw_posts p ON pm.post_id = p.ID
                WHERE pm.meta_key = '_tutor_enrolled_by_order_id'
                LIMIT 5
            `);
            console.log('   Ejemplos:');
            sample.forEach((s: any) => {
                console.log(`   - Post ID: ${s.post_id}, Tipo: ${s.post_type}, Título: ${s.post_title}, Order ID: ${s.order_id}`);
            });
        }

        console.log('\n2️⃣ Buscando por _tutor_enrolled_by_product_id:');
        const [enrollByProduct] = await connection.execute<any[]>(`
            SELECT COUNT(*) as count
            FROM wpgw_postmeta
            WHERE meta_key = '_tutor_enrolled_by_product_id'
        `);
        console.log(`   Encontrados: ${enrollByProduct[0].count}\n`);

        // Mostrar ejemplo
        if (enrollByProduct[0].count > 0) {
            const [sample] = await connection.execute<any[]>(`
                SELECT 
                    pm.post_id,
                    pm.meta_value as product_id,
                    p.post_title,
                    p.post_type
                FROM wpgw_postmeta pm
                LEFT JOIN wpgw_posts p ON pm.post_id = p.ID
                WHERE pm.meta_key = '_tutor_enrolled_by_product_id'
                LIMIT 5
            `);
            console.log('   Ejemplos:');
            sample.forEach((s: any) => {
                console.log(`   - Post ID: ${s.post_id}, Tipo: ${s.post_type}, Título: ${s.post_title}, Product ID: ${s.product_id}`);
            });
        }

        // Buscar inscripciones basadas en quiz attempts
        console.log('\n3️⃣ Estudiantes únicos con intentos de quiz por curso:');
        const [studentsByCourse] = await connection.execute<any[]>(`
            SELECT 
                qa.course_id,
                c.post_title as course_name,
                COUNT(DISTINCT qa.user_id) as unique_students
            FROM wpgw_tutor_quiz_attempts qa
            LEFT JOIN wpgw_posts c ON qa.course_id = c.ID
            GROUP BY qa.course_id, c.post_title
        `);

        studentsByCourse.forEach((s: any) => {
            console.log(`   - ${s.course_name}: ${s.unique_students} estudiantes`);
        });

        // Total de estudiantes únicos con actividad
        const [totalUniqueStudents] = await connection.execute<any[]>(`
            SELECT COUNT(DISTINCT user_id) as count
            FROM wpgw_tutor_quiz_attempts
        `);
        console.log(`\n   Total de estudiantes únicos con actividad: ${totalUniqueStudents[0].count}`);

        await connection.end();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

main();
