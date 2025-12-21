import mysql from 'mysql2/promise';

const MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wordpress_temp'
};

async function main() {
    console.log('🔍 Debugging Source Data Relationships...\n');

    const connection = await mysql.createConnection(MYSQL_CONFIG);

    try {
        // 1. Count lessons with and without _tutor_course_id_for_lesson
        console.log('📊 Lesson Linkage Stats:');
        const [totalLessons] = await connection.execute<any[]>('SELECT COUNT(*) as count FROM wpgw_posts WHERE post_type = "lesson"');
        console.log(`  Total Lessons: ${totalLessons[0].count}`);

        const [linkedLessons] = await connection.execute<any[]>(`
            SELECT COUNT(DISTINCT p.ID) as count
            FROM wpgw_posts p
            JOIN wpgw_postmeta pm ON p.ID = pm.post_id
            WHERE p.post_type = 'lesson'
            AND pm.meta_key = '_tutor_course_id_for_lesson'
        `);
        console.log(`  Linked Lessons (via meta): ${linkedLessons[0].count}`);

        // 2. Check for lessons linked via post_parent
        const [parentLinked] = await connection.execute<any[]>(`
            SELECT COUNT(*) as count
            FROM wpgw_posts
            WHERE post_type = 'lesson'
            AND post_parent > 0
        `);
        console.log(`  Linked Lessons (via post_parent): ${parentLinked[0].count}`);

        // 3. List samples of unlinked lessons (if any)
        if (totalLessons[0].count > linkedLessons[0].count) {
            console.log('\n⚠️ Unlinked Lessons Sample:');
            const [unlinked] = await connection.execute<any[]>(`
                SELECT p.ID, p.post_title, p.post_parent
                FROM wpgw_posts p
                LEFT JOIN wpgw_postmeta pm ON p.ID = pm.post_id AND pm.meta_key = '_tutor_course_id_for_lesson'
                WHERE p.post_type = 'lesson'
                AND pm.post_id IS NULL
                LIMIT 10
            `);
            unlinked.forEach((l: any) => console.log(`  [${l.ID}] ${l.post_title} (Parent: ${l.post_parent})`));
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await connection.end();
    }
}

main();
