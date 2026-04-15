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

        const [post] = await connection.execute('SELECT * FROM wp_posts WHERE ID = 17557');
        console.log('Order 17557 Post Data:', post);

        const [orders] = await connection.execute('SELECT * FROM wp_postmeta WHERE post_id = 17557');
        console.log('Order 17557 Meta Data:', orders);

        // search for user email
        const [users] = await connection.execute("SELECT * FROM wp_users WHERE user_email LIKE '%provan%'");
        console.log('Users matching provan:', users);

        await connection.end();
    } catch (err) {
        console.error('Error:', err);
    }
}

main();
