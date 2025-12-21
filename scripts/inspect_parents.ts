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
        const parentIds = [1111, 1142, 1144]; // Sample quizzes from previous debug output
        console.log(`🔍 Inspecting Parents: ${parentIds.join(', ')}\n`);

        for (const id of parentIds) {
            const [posts] = await connection.execute<any[]>('SELECT ID, post_title, post_type, post_parent FROM wpgw_posts WHERE ID = ?', [id]);
            if (posts.length > 0) {
                const p = posts[0];
                console.log(`[${p.ID}] ${p.post_title} (Type: ${p.post_type}, Parent: ${p.post_parent})`);

                // Check meta
                const [meta] = await connection.execute<any[]>('SELECT meta_key, meta_value FROM wpgw_postmeta WHERE post_id = ?', [id]);
                const relevantMeta = meta.filter((m: any) => m.meta_key.includes('course') || m.meta_key.includes('parent'));
                relevantMeta.forEach((m: any) => console.log(`    - ${m.meta_key}: ${m.meta_value}`));
            } else {
                console.log(`[${id}] Not found`);
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await connection.end();
    }
}
main();
