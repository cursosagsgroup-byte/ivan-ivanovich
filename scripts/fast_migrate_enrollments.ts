
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
    console.log('🚀 Starting FAST migration...');

    // 1. PRE-FETCH DATA DICTIONARIES
    console.log('📦 Pre-fetching Prisma data...');

    // Users: Email -> ID
    const allUsers = await prisma.user.findMany({ select: { id: true, email: true } });
    const userMap = new Map<string, string>();
    allUsers.forEach(u => userMap.set(u.email.toLowerCase(), u.id));
    console.log(`   Loaded ${allUsers.length} users.`);

    // Courses: Title -> ID
    const allCourses = await prisma.course.findMany({ select: { id: true, title: true } });
    const courseMap = new Map<string, string>();
    allCourses.forEach(c => courseMap.set(c.title, c.id));
    console.log(`   Loaded ${allCourses.length} courses.`);

    // Quizzes: Title + CourseID -> ID
    // We need to map Quiz Title to ID. But one course might have same quiz names? 
    // Usually title is unique enough or we map by Module -> Course.
    // Let's load all quizzes with their course ID (via module).
    const allQuizzes = await prisma.quiz.findMany({
        include: { module: true }
    });
    // Map: CourseID -> QuizTitle -> QuizID
    const quizMap = new Map<string, Map<string, string>>();
    allQuizzes.forEach(q => {
        const courseId = q.module.courseId;
        if (!quizMap.has(courseId)) {
            quizMap.set(courseId, new Map());
        }
        quizMap.get(courseId)!.set(q.title, q.id);
    });
    console.log(`   Loaded ${allQuizzes.length} quizzes.`);


    const connection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ Connected to MySQL');

    // ==========================================
    // 2. ENROLLMENTS
    // ==========================================
    console.log('\n📚 2. Processing Enrollments...');
    const [wpEnrollments] = await connection.execute<any[]>(`
        SELECT 
            e.post_author as user_wp_id,
            e.post_parent as course_wp_id,
            e.post_date as enrolled_at,
            c.post_title as course_title
        FROM wpgw_posts e
        INNER JOIN wpgw_posts c ON e.post_parent = c.ID
        WHERE e.post_type = 'tutor_enrolled'
        AND e.post_status = 'completed'
    `);

    // Fetch WP User Emails for mapping
    const [wpUsers] = await connection.execute<any[]>('SELECT ID, user_email FROM wpgw_users');
    const wpUserEmailMap = new Map<number, string>();
    wpUsers.forEach(u => wpUserEmailMap.set(u.ID, u.user_email));

    const enrollmentsToCreate: any[] = [];
    const existingEnrollments = new Set<string>(); // key: userId_courseId

    // Pre-fill existing to avoid constraint errors (skipDuplicates handles ID collisions but not always composite unique? Prisma createMany skipDuplicates is ON)
    // Actually, Prisma's skipDuplicates works on unique constraints.
    // But let's verify what the unique constraint is on Enrollment.
    // schema.prisma: @@unique([userId, courseId]) ? Yes, likely.

    let enrollmentCount = 0;
    for (const record of wpEnrollments) {
        const email = wpUserEmailMap.get(record.user_wp_id);
        if (!email) continue;

        const userId = userMap.get(email.toLowerCase());
        const courseId = courseMap.get(record.course_title);

        if (userId && courseId) {
            enrollmentsToCreate.push({
                userId,
                courseId,
                progress: 0,
                enrolledAt: new Date(record.enrolled_at)
            });
            enrollmentCount++;
        }
    }

    if (enrollmentsToCreate.length > 0) {
        console.log(`   Preparing to insert ${enrollmentsToCreate.length} enrollments...`);
        // Batch insert
        await prisma.enrollment.createMany({
            data: enrollmentsToCreate,
            skipDuplicates: true
        });
        console.log('   ✅ Enrollments inserted.');
    } else {
        console.log('   ⚠️ No enrollments to insert.');
    }


    // ==========================================
    // 3. QUIZ ATTEMPTS
    // ==========================================
    console.log('\n📝 3. Processing Quiz Attempts...');
    const [wpAttempts] = await connection.execute<any[]>(`
        SELECT 
            qa.attempt_id,
            qa.user_id,
            qa.course_id,
            qa.quiz_id,
            qa.total_marks,
            qa.earned_marks,
            qa.attempt_started_at,
            u.user_email,
            c.post_title as course_title,
            q.post_title as quiz_title
        FROM wpgw_tutor_quiz_attempts qa
        LEFT JOIN wpgw_users u ON qa.user_id = u.ID
        LEFT JOIN wpgw_posts c ON qa.course_id = c.ID
        LEFT JOIN wpgw_posts q ON qa.quiz_id = q.ID
    `);

    const attemptsToCreate: any[] = [];

    for (const attempt of wpAttempts) {
        if (!attempt.user_email) continue;

        const userId = userMap.get(attempt.user_email.toLowerCase());
        const courseId = courseMap.get(attempt.course_title);

        if (!userId || !courseId) continue;

        const quizId = quizMap.get(courseId)?.get(attempt.quiz_title);

        if (quizId) {
            const score = attempt.total_marks > 0
                ? Math.round((attempt.earned_marks / attempt.total_marks) * 100)
                : 0;

            attemptsToCreate.push({
                userId,
                quizId,
                score,
                passed: score >= 70,
                answers: JSON.stringify({ migrated: true }),
                attemptedAt: attempt.attempt_started_at ? new Date(attempt.attempt_started_at) : new Date()
            });
        }
    }

    if (attemptsToCreate.length > 0) {
        console.log(`   Preparing to insert ${attemptsToCreate.length} quiz attempts...`);
        await prisma.quizAttempt.createMany({
            data: attemptsToCreate,
            skipDuplicates: true
        });
        console.log('   ✅ Quiz Attempts inserted.');
    } else {
        console.log('   ⚠️ No quiz attempts to insert.');
    }

    await connection.end();
    await prisma.$disconnect();
    console.log('\n🎉 Fast Migration Complete!');
}

main().catch(console.error);
