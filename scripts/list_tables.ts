
import mysql from 'mysql2/promise';

const MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wordpress_temp'
};

async function main() {
    try {
        const connection = await mysql.createConnection(MYSQL_CONFIG);
        console.log('✅ Connected to MySQL\n');
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('Tables in database:', tables);
        await connection.end();
    } catch (err) {
        console.error('Error:', err);
    }
}
main();
