
import mysql from 'mysql2/promise';

const MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wordpress_temp'
};

async function main() {
    const connection = await mysql.createConnection(MYSQL_CONFIG);
    console.log(`🔍 Finding user with progress...`);

    const [results] = await connection.execute<any[]>(
        "SELECT user_id, count(*) as count FROM wpgw_usermeta WHERE meta_key LIKE '_tutor_completed_lesson_id_%' GROUP BY user_id ORDER BY count DESC LIMIT 1"
    );

    if (results.length === 0) {
        console.log('❌ No progress found for anyone');
        await connection.end();
        return;
    }

    const userId = results[0].user_id;
    const count = results[0].count;
    console.log(`✅ User ID ${userId} has ${count} completed lessons`);

    const [users] = await connection.execute<any[]>('SELECT user_email FROM wpgw_users WHERE ID = ?', [userId]);
    if (users.length > 0) {
        console.log(`📧 Email: ${users[0].user_email}`);
    }

    await connection.end();
}

main().catch(console.error);
