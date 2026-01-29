
import mysql from 'mysql2/promise';

const MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wordpress_temp'
};

const EMAIL = process.argv[2] || 'eligiofernandez@gmail.com';

async function main() {
    const connection = await mysql.createConnection(MYSQL_CONFIG);
    console.log(`🔍 Debugging progress for: ${EMAIL}`);

    // 1. Get WP User ID
    const [users] = await connection.execute<any[]>('SELECT ID, user_email FROM wpgw_users WHERE user_email = ?', [EMAIL]);
    if (users.length === 0) {
        console.log('❌ User not found in WP DB');
        await connection.end();
        return;
    }
    const user = users[0];
    console.log(`✅ Found WP User: ID ${user.ID}`);

    // 2. Check Completed Lessons Meta
    const [lessons] = await connection.execute<any[]>(
        "SELECT meta_key, meta_value FROM wpgw_usermeta WHERE user_id = ? AND meta_key LIKE '_tutor_completed_lesson_id_%'",
        [user.ID]
    );
    console.log(`📚 Found ${lessons.length} completed lessons in wpgw_usermeta`);
    if (lessons.length > 0) {
        console.log('Sample:', lessons.slice(0, 3));
    }

    // 3. Check Quiz Attempts
    const [quizzes] = await connection.execute<any[]>(
        "SELECT attempt_id, quiz_id, attempt_status, earned_marks FROM wpgw_tutor_quiz_attempts WHERE user_id = ?",
        [user.ID]
    );
    console.log(`🏆 Found ${quizzes.length} quiz attempts in wpgw_tutor_quiz_attempts`);
    if (quizzes.length > 0) {
        console.table(quizzes);
    }

    await connection.end();
}

main().catch(console.error);
