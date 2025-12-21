import mysql from 'mysql2/promise';

const MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wordpress_temp'
};

async function main() {
    console.log('📊 Checking Source DB (wordpress_temp) Status...\n');

    try {
        const connection = await mysql.createConnection(MYSQL_CONFIG);
        console.log('✅ Connected to MySQL');

        const [courses] = await connection.execute<any[]>('SELECT COUNT(*) as count FROM wpgw_posts WHERE post_type = "courses"');
        const [lessons] = await connection.execute<any[]>('SELECT COUNT(*) as count FROM wpgw_posts WHERE post_type = "lesson"');
        const [quizzes] = await connection.execute<any[]>('SELECT COUNT(*) as count FROM wpgw_posts WHERE post_type = "tutor_quiz"');
        const [users] = await connection.execute<any[]>('SELECT COUNT(*) as count FROM wpgw_users');

        console.log(`Source Courses: ${courses[0].count}`);
        console.log(`Source Lessons: ${lessons[0].count}`);
        console.log(`Source Quizzes: ${quizzes[0].count}`);
        console.log(`Source Users: ${users[0].count}`);

        await connection.end();
    } catch (error) {
        console.error('❌ Error connecting to source DB:', error);
    }
}

main();
