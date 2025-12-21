import mysql from 'mysql2/promise';

const MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wordpress_temp'
};

async function main() {
    const connection = await mysql.createConnection(MYSQL_CONFIG);
    try {
        const [posts] = await connection.execute<any[]>('SELECT * FROM wpgw_posts WHERE ID = 882');
        console.log('Post 882:', posts[0]);
    } catch (e) {
        console.error(e);
    } finally {
        await connection.end();
    }
}
main();
