
import { PrismaClient } from '@prisma/client';
import mysql from 'mysql2/promise';

const prisma = new PrismaClient();

const MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wordpress_temp'
};

async function main() {
    console.log('🚀 Starting detailed progress migration...');

    // 1. Build Prisma Map (Course -> Module -> Lesson -> ID)
    console.log('🗺️  Building Prisma Content Map...');
    const prismaCourses = await prisma.course.findMany({
        include: {
            modules: {
                include: {
                    lessons: true
                }
            }
        }
    });

    // Map: CourseTitle -> ModuleTitle -> LessonTitle -> LessonID
    const prismaMap = new Map<string, Map<string, Map<string, string>>>();

    for (const course of prismaCourses) {
        if (!prismaMap.has(course.title)) {
            prismaMap.set(course.title, new Map());
        }
        const moduleMap = prismaMap.get(course.title)!;

        for (const module of course.modules) {
            if (!moduleMap.has(module.title)) {
                moduleMap.set(module.title, new Map());
            }
            const lessonMap = moduleMap.get(module.title)!;

            for (const lesson of module.lessons) {
                lessonMap.set(lesson.title, lesson.id);
            }
        }
    }
    console.log('✅ Prisma Map Built.');


    // 2. Connect to MySQL and Build WP Map
    const connection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('📡 Connected to MySQL.');

    // Fetch all relevant posts to build hierarchy in memory
    // Optimization: Fetch all 'courses', 'topics', 'lessons'
    const [wpPosts] = await connection.execute<any[]>(`
        SELECT ID, post_title, post_type, post_parent 
        FROM wpgw_posts 
        WHERE post_type IN ('courses', 'topics', 'lesson')
    `);

    const wpDict = new Map<number, { title: string, type: string, parent: number }>();
    for (const p of wpPosts) {
        wpDict.set(p.ID, { title: p.post_title, type: p.post_type, parent: p.post_parent });
    }

    // 3. Fetch Completion Data
    console.log('📥 Fetching completion data from usermeta...');
    const [completions] = await connection.execute<any[]>(`
        SELECT user_id, meta_key, meta_value 
        FROM wpgw_usermeta 
        WHERE meta_key LIKE '_tutor_completed_lesson_id_%'
    `);
    console.log(`Found ${completions.length} completion records.`);

    // 4. Migrate
    let migratedCount = 0;
    let skippedCount = 0;
    const usersToRecalculate = new Set<string>();

    // Pre-fetch prisma users for ID lookup by email to save time
    // But we have WP User ID in meta. We need to map WP User ID -> Prisma User ID.
    // The previous migration matched by Email.
    // So: WP User ID -> WP Email -> Prisma User Email -> Prisma User ID.

    // Build WP User ID -> Email map
    const [wpUsers] = await connection.execute<any[]>('SELECT ID, user_email FROM wpgw_users');
    const wpUserMap = new Map<number, string>();
    for (const u of wpUsers) {
        wpUserMap.set(u.ID, u.user_email);
    }

    // Build Prisma Email -> ID map
    const allPrismaUsers = await prisma.user.findMany({ select: { id: true, email: true } });
    const prismaUserMap = new Map<string, string>();
    for (const u of allPrismaUsers) {
        prismaUserMap.set(u.email.toLowerCase(), u.id);
    }


    for (const record of completions) {
        // Parse WP Lesson ID from key "_tutor_completed_lesson_id_1864"
        const parts = record.meta_key.split('_id_'); // split at last _id_
        // Actually key is likely "_tutor_completed_lesson_id_XXXX"
        const wpLessonId = parseInt(parts[1]);

        if (!wpLessonId || !wpDict.has(wpLessonId)) {
            skippedCount++;
            continue;
        }

        const wpLesson = wpDict.get(wpLessonId)!;
        const wpTopic = wpDict.get(wpLesson.parent);
        if (!wpTopic || wpTopic.type !== 'topics') {
            // Handle orphaned lesson or direct-to-course (rare in Tutor?)
            skippedCount++;
            continue;
        }

        const wpCourse = wpDict.get(wpTopic.parent);
        if (!wpCourse || wpCourse.type !== 'courses') {
            skippedCount++;
            continue;
        }

        // Now we have the titles: wpCourse.title -> wpTopic.title -> wpLesson.title
        // Find in Prisma Map
        const prismaLessonId = prismaMap.get(wpCourse.title)?.get(wpTopic.title)?.get(wpLesson.title);

        if (!prismaLessonId) {
            // console.warn(`Could not map lesson: ${wpCourse.title} > ${wpTopic.title} > ${wpLesson.title}`);
            skippedCount++;
            continue;
        }

        // Find User
        const userEmail = wpUserMap.get(record.user_id);
        if (!userEmail) continue;

        const prismaUserId = prismaUserMap.get(userEmail.toLowerCase());
        if (!prismaUserId) continue;

        // Perform Insert
        try {
            await prisma.lessonProgress.upsert({
                where: {
                    userId_lessonId: {
                        userId: prismaUserId,
                        lessonId: prismaLessonId
                    }
                },
                update: { completed: true, completedAt: new Date(parseInt(record.meta_value) * 1000) },
                create: {
                    userId: prismaUserId,
                    lessonId: prismaLessonId,
                    completed: true,
                    completedAt: new Date(parseInt(record.meta_value) * 1000)
                }
            });
            usersToRecalculate.add(prismaUserId); // Add user to recalculation list
            migratedCount++;
        } catch (e) {
            console.error(`Error saving progress for ${userEmail}:`, e);
        }
    }

    console.log(`✅ Migrated ${migratedCount} lesson completions.`);
    console.log(`⚠️  Skipped/Unmapped ${skippedCount} records.`);

    // 5. Recalculate Enrollment Progress
    console.log(`🔄 Recalculating progress for ${usersToRecalculate.size} users...`);

    // We also need to update progress for users who currently have 0% but might have completions,
    // OR we just assume the usersToRecalculate list covers everyone who got an update.

    // Improved Recalculation:
    // For each unique user in the batch:
    //   Find all their enrollments.
    //   For each enrollment (Course):
    //     Count total lessons in course.
    //     Count completed lessons for user in that course.
    //     Update Enrollment.

    for (const userId of usersToRecalculate) {
        // Get user's enrollments
        const enrollments = await prisma.enrollment.findMany({
            where: { userId: userId },
            include: { course: { include: { modules: { include: { lessons: true } } } } }
        });

        for (const enrollment of enrollments) {
            const course = enrollment.course;
            let totalLessons = 0;
            let completedLessons = 0;

            // Flatten lessons
            const allLessonIds: string[] = [];
            course.modules.forEach(m => {
                m.lessons.forEach(l => {
                    allLessonIds.push(l.id);
                    totalLessons++;
                });
            });

            if (totalLessons === 0) continue;

            const completedCount = await prisma.lessonProgress.count({
                where: {
                    userId: userId,
                    lessonId: { in: allLessonIds },
                    completed: true
                }
            });

            const newProgress = Math.round((completedCount / totalLessons) * 100);

            if (newProgress !== enrollment.progress) {
                await prisma.enrollment.update({
                    where: { id: enrollment.id },
                    data: { progress: newProgress }
                });
                // console.log(`   Updated ${course.title} for user: ${newProgress}%`);
            }
        }
    }

    await connection.end();
    await prisma.$disconnect();

    console.log('🎉 Progress Migration and Calculation Complete!');
}

main().catch(console.error);
