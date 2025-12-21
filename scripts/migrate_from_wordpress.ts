import { PrismaClient } from '@prisma/client';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// MySQL connection config for temporary database
const MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '', // Update if you have a MySQL password
    database: 'wordpress_temp'
};

interface WPUser {
    ID: number;
    user_login: string;
    user_email: string;
    display_name: string;
    user_registered: Date;
}

interface WPCourse {
    ID: number;
    post_title: string;
    post_content: string;
    post_excerpt: string;
    post_date: Date;
}

interface WPOrder {
    order_id: number;
    user_id: number;
    order_status: string;
    order_date: Date;
}

interface WPOrderItem {
    order_item_id: number;
    order_id: number;
    course_id: number;
}

async function main() {
    console.log('🚀 Starting WordPress/Tutor LMS migration...\n');

    // Connect to MySQL
    console.log('📡 Connecting to MySQL...');
    const connection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ Connected to MySQL\n');

    try {
        // 1. Migrate Users (Students)
        console.log('👥 Migrating users...');
        const [wpUsers] = await connection.execute<any[]>(`
            SELECT 
                u.ID,
                u.user_login,
                u.user_email,
                u.display_name,
                u.user_registered
            FROM wpgw_users u
            WHERE u.ID > 1
            ORDER BY u.ID
        `);

        let userCount = 0;
        for (const wpUser of wpUsers) {
            // Check if user already exists
            const existing = await prisma.user.findUnique({
                where: { email: wpUser.user_email }
            });

            if (!existing) {
                // Generate a random password (user will need to reset)
                const tempPassword = await bcrypt.hash('TempPassword123!', 10);

                await prisma.user.create({
                    data: {
                        email: wpUser.user_email,
                        name: wpUser.display_name || wpUser.user_login,
                        password: tempPassword,
                        role: 'STUDENT',
                        createdAt: new Date(wpUser.user_registered)
                    }
                });
                userCount++;
                console.log(`  ✓ Created user: ${wpUser.user_email}`);
            } else {
                console.log(`  ⏭️  User already exists: ${wpUser.user_email}`);
            }
        }
        console.log(`✅ Migrated ${userCount} users\n`);

        // 2. Migrate Courses
        console.log('📚 Migrating courses...');
        const [wpCourses] = await connection.execute<any[]>(`
            SELECT 
                p.ID,
                p.post_title,
                p.post_content,
                p.post_excerpt,
                p.post_date
            FROM wpgw_posts p
            WHERE p.post_type = 'courses'
            AND p.post_status = 'publish'
            ORDER BY p.ID
        `);

        let courseCount = 0;
        const courseMapping: Record<number, string> = {}; // WP ID -> Prisma ID

        for (const wpCourse of wpCourses) {
            // Get course metadata (price, image, etc.)
            const [metadata] = await connection.execute<any[]>(`
                SELECT meta_key, meta_value
                FROM wpgw_postmeta
                WHERE post_id = ?
                AND meta_key IN ('_tutor_course_price', '_thumbnail_id', 'course_duration')
            `, [wpCourse.ID]);

            const metaObj: Record<string, any> = {};
            for (const meta of metadata) {
                metaObj[meta.meta_key] = meta.meta_value;
            }

            // Get thumbnail URL if exists
            let imageUrl = null;
            if (metaObj._thumbnail_id) {
                const [thumbData] = await connection.execute<any[]>(`
                    SELECT guid FROM wpgw_posts WHERE ID = ?
                `, [metaObj._thumbnail_id]);
                if (thumbData.length > 0) {
                    imageUrl = thumbData[0].guid;
                }
            }

            const price = parseFloat(metaObj._tutor_course_price || '0');

            // Check if course already exists
            const existing = await prisma.course.findFirst({
                where: { title: wpCourse.post_title }
            });

            if (!existing) {
                const newCourse = await prisma.course.create({
                    data: {
                        title: wpCourse.post_title,
                        description: wpCourse.post_excerpt || wpCourse.post_content.substring(0, 500),
                        price: price,
                        image: imageUrl,
                        published: true,
                        createdAt: new Date(wpCourse.post_date)
                    }
                });
                courseMapping[wpCourse.ID] = newCourse.id;
                courseCount++;
                console.log(`  ✓ Created course: ${wpCourse.post_title} ($${price})`);
            } else {
                courseMapping[wpCourse.ID] = existing.id;
                console.log(`  ⏭️  Course already exists: ${wpCourse.post_title}`);
            }
        }
        console.log(`✅ Migrated ${courseCount} courses\n`);

        // 3. Migrate Orders & Enrollments
        console.log('🛒 Migrating orders and enrollments...');
        const [wpOrders] = await connection.execute<any[]>(`
            SELECT 
                o.id as order_id,
                o.user_id,
                o.order_status,
                o.created_at_gmt as order_date,
                o.total_price
            FROM wpgw_tutor_orders o
            WHERE o.order_status = 'completed'
            ORDER BY o.id
        `);

        let orderCount = 0;
        let enrollmentCount = 0;

        for (const wpOrder of wpOrders) {
            // Find the user in our system
            const [wpUserData] = await connection.execute<any[]>(`
                SELECT user_email FROM wpgw_users WHERE ID = ?
            `, [wpOrder.user_id]);

            if (wpUserData.length === 0) continue;

            const user = await prisma.user.findUnique({
                where: { email: wpUserData[0].user_email }
            });

            if (!user) continue;

            // Get order items (courses purchased)
            const [wpOrderItems] = await connection.execute<any[]>(`
                SELECT item_id, regular_price
                FROM wpgw_tutor_order_items
                WHERE order_id = ?
            `, [wpOrder.order_id]);

            if (wpOrderItems.length === 0) continue;

            // Create order
            const order = await prisma.order.create({
                data: {
                    userId: user.id,
                    orderNumber: `WP-${wpOrder.order_id}`,
                    total: parseFloat(wpOrder.total_price || '0'),
                    status: 'COMPLETED',
                    createdAt: new Date(wpOrder.order_date),
                    billingName: user.name || 'Unknown',
                    billingEmail: user.email,
                }
            });
            orderCount++;

            // Create order items and enrollments
            for (const item of wpOrderItems) {
                const courseId = courseMapping[item.item_id];
                if (!courseId) continue;

                // Create order item
                await prisma.orderItem.create({
                    data: {
                        orderId: order.id,
                        courseId: courseId,
                        price: parseFloat(item.regular_price || '0')
                    }
                });

                // Create enrollment
                const existingEnrollment = await prisma.enrollment.findFirst({
                    where: {
                        userId: user.id,
                        courseId: courseId
                    }
                });

                if (!existingEnrollment) {
                    await prisma.enrollment.create({
                        data: {
                            userId: user.id,
                            courseId: courseId,
                            progress: 0,
                            enrolledAt: new Date(wpOrder.order_date)
                        }
                    });
                    enrollmentCount++;
                    console.log(`  ✓ Enrolled ${user.email} in course`);
                }
            }
        }
        console.log(`✅ Migrated ${orderCount} orders and ${enrollmentCount} enrollments\n`);

        console.log('🎉 Migration completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Users: ${userCount}`);
        console.log(`   Courses: ${courseCount}`);
        console.log(`   Orders: ${orderCount}`);
        console.log(`   Enrollments: ${enrollmentCount}`);

    } catch (error) {
        console.error('❌ Migration error:', error);
        throw error;
    } finally {
        await connection.end();
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error('Fatal error:', e);
        process.exit(1);
    });
