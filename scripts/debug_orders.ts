import mysql from 'mysql2/promise';

const MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wordpress_temp'
};

async function main() {
    console.log('📡 Connecting to MySQL...');
    const connection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ Connected\n');

    try {
        // Check total orders
        const [count] = await connection.execute<any[]>('SELECT COUNT(*) as count FROM wpgw_tutor_orders');
        console.log(`Total Orders: ${count[0].count}`);

        // Check order statuses
        const [statuses] = await connection.execute<any[]>('SELECT order_status, COUNT(*) as count FROM wpgw_tutor_orders GROUP BY order_status');
        console.log('\nOrder Statuses:');
        console.table(statuses);

        // Check a sample completed order
        const [sample] = await connection.execute<any[]>('SELECT * FROM wpgw_tutor_orders LIMIT 1');
        console.log('\nSample Order:');
        console.log(sample[0]);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

main();
