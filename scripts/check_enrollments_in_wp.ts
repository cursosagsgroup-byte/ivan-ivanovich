import mysql from 'mysql2/promise';

const MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wordpress_temp'
};

async function main() {
    console.log('🔍 Buscando información de inscripciones en WordPress...\n');

    try {
        const connection = await mysql.createConnection(MYSQL_CONFIG);
        console.log('✅ Conectado a MySQL\n');

        // Buscar tablas relacionadas con Tutor LMS
        console.log('📋 Tablas de Tutor LMS disponibles:');
        const [tables] = await connection.execute<any[]>('SHOW TABLES LIKE "wpgw_tutor%"');
        tables.forEach((table: any) => {
            console.log(`  - ${Object.values(table)[0]}`);
        });

        console.log('\n📊 Verificando datos de inscripciones:\n');

        // Verificar tabla de órdenes
        const [orders] = await connection.execute<any[]>('SELECT COUNT(*) as count FROM wpgw_tutor_orders');
        console.log(`Total de órdenes: ${orders[0].count}`);

        // Verificar órdenes completadas
        const [completedOrders] = await connection.execute<any[]>(
            'SELECT COUNT(*) as count FROM wpgw_tutor_orders WHERE order_status = "completed"'
        );
        console.log(`Órdenes completadas: ${completedOrders[0].count}`);

        // Verificar items de órdenes
        const [orderItems] = await connection.execute<any[]>('SELECT COUNT(*) as count FROM wpgw_tutor_order_items');
        console.log(`Items de órdenes: ${orderItems[0].count}`);

        // Verificar enrollments si existe la tabla
        try {
            const [enrollments] = await connection.execute<any[]>('SELECT COUNT(*) as count FROM wpgw_tutor_enrolled_courses');
            console.log(`Inscripciones directas: ${enrollments[0].count}`);
        } catch (e) {
            console.log('⚠️  Tabla wpgw_tutor_enrolled_courses no existe');
        }

        // Mostrar ejemplo de una orden completada
        console.log('\n📦 Ejemplo de orden completada:');
        const [sampleOrder] = await connection.execute<any[]>(`
            SELECT 
                o.id,
                o.user_id,
                o.order_status,
                o.total_price,
                o.created_at_gmt,
                u.user_email,
                u.display_name
            FROM wpgw_tutor_orders o
            LEFT JOIN wpgw_users u ON o.user_id = u.ID
            WHERE o.order_status = 'completed'
            LIMIT 1
        `);

        if (sampleOrder.length > 0) {
            console.log(JSON.stringify(sampleOrder[0], null, 2));

            // Mostrar items de esa orden
            const orderId = sampleOrder[0].id;
            const [items] = await connection.execute<any[]>(`
                SELECT 
                    oi.item_id,
                    oi.regular_price,
                    p.post_title
                FROM wpgw_tutor_order_items oi
                LEFT JOIN wpgw_posts p ON oi.item_id = p.ID
                WHERE oi.order_id = ?
            `, [orderId]);

            console.log('\n📚 Cursos en esta orden:');
            items.forEach((item: any) => {
                console.log(`  - ${item.post_title} ($${item.regular_price})`);
            });
        }

        // Contar cuántos usuarios únicos tienen órdenes completadas
        const [uniqueStudents] = await connection.execute<any[]>(`
            SELECT COUNT(DISTINCT user_id) as count 
            FROM wpgw_tutor_orders 
            WHERE order_status = 'completed'
        `);
        console.log(`\n👥 Estudiantes únicos con compras: ${uniqueStudents[0].count}`);

        // Contar total de inscripciones (órdenes completadas * items)
        const [totalEnrollments] = await connection.execute<any[]>(`
            SELECT COUNT(*) as count
            FROM wpgw_tutor_order_items oi
            INNER JOIN wpgw_tutor_orders o ON oi.order_id = o.id
            WHERE o.order_status = 'completed'
        `);
        console.log(`📝 Total de inscripciones potenciales: ${totalEnrollments[0].count}`);

        await connection.end();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

main();
