
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

    // Get 3 sample lessons
    const [lessons] = await connection.execute<any[]>(`
        SELECT ID, post_title, post_parent, post_name
        FROM wpgw_posts 
        WHERE post_type = 'lesson' 
        LIMIT 3
    `);

    console.log('📝 Sample Lessons:');
    for (const lesson of lessons) {
        console.log(`\nLesson ID: ${lesson.ID}`);
        console.log(`Title: ${lesson.post_title}`);
        console.log(`Parent ID (Course?): ${lesson.post_parent}`);

        // Check parent type
        if (lesson.post_parent) {
            const [parent] = await connection.execute<any[]>(`
                SELECT ID, post_title, post_type FROM wpgw_posts WHERE ID = ?
            `, [lesson.post_parent]);
            if (parent.length > 0) {
                console.log(`Parent is: [${parent[0].post_type}] ${parent[0].post_title}`);
            }
        }
    }

    await connection.end();
}

main().catch(console.error);
