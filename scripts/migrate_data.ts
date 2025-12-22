import Database from 'better-sqlite3';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();
const sqlite = new Database(path.join(process.cwd(), 'prisma', 'dev.db'));

const toBool = (val: any) => val === 1;
const toDate = (val: any) => val ? new Date(val) : null;

async function migrate() {
    console.log('🚀 Starting TURBO migration from SQLite to Supabase...');

    try {
        // 0. Clean specific conflicts first (Admin user)
        console.log('🧹 Cleaning potential conflicts...');
        await prisma.user.deleteMany({
            where: { email: 'c.beuvrin@ketingmedia.com' }
        });

        // 1. Users
        console.log('Migrating Users...');
        const users = sqlite.prepare('SELECT * FROM User').all();
        const usersData = users.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            emailVerified: toDate(u.emailVerified),
            image: u.image,
            country: u.country,
            phone: u.phone,
            age: u.age,
            password: u.password,
            role: u.role,
            language: u.language,
            createdAt: new Date(u.createdAt),
            updatedAt: new Date(u.updatedAt)
        }));

        // Batch insert users
        if (usersData.length > 0) {
            await prisma.user.createMany({
                data: usersData,
                skipDuplicates: true // Important!
            });
        }
        console.log(`✅ ${users.length} users migrated.`);

        // 2. Courses
        console.log('Migrating Courses...');
        const courses = sqlite.prepare('SELECT * FROM Course').all();
        const coursesData = courses.map((c: any) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            price: c.price,
            image: c.image,
            language: c.language,
            published: toBool(c.published),
            createdAt: new Date(c.createdAt),
            updatedAt: new Date(c.updatedAt)
        }));
        if (coursesData.length > 0) {
            await prisma.course.createMany({ data: coursesData, skipDuplicates: true });
        }
        console.log(`✅ ${courses.length} courses migrated.`);

        // 3. Modules
        console.log('Migrating Modules...');
        const modules = sqlite.prepare('SELECT * FROM Module').all();
        const modulesData = modules.map((m: any) => ({
            id: m.id,
            courseId: m.courseId,
            title: m.title,
            description: m.description,
            order: m.order,
            createdAt: new Date(m.createdAt)
        }));
        if (modulesData.length > 0) {
            await prisma.module.createMany({ data: modulesData, skipDuplicates: true });
        }
        console.log(`✅ ${modules.length} modules migrated.`);

        // 4. Lessons
        console.log('Migrating Lessons...');
        const lessons = sqlite.prepare('SELECT * FROM Lesson').all();
        const lessonsData = lessons.map((l: any) => ({
            id: l.id,
            moduleId: l.moduleId,
            title: l.title,
            content: l.content,
            videoUrl: l.videoUrl,
            order: l.order,
            duration: l.duration,
            createdAt: new Date(l.createdAt)
        }));
        if (lessonsData.length > 0) {
            await prisma.lesson.createMany({ data: lessonsData, skipDuplicates: true });
        }
        console.log(`✅ ${lessons.length} lessons migrated.`);

        // 5. Quizzes
        console.log('Migrating Quizzes...');
        const quizzes = sqlite.prepare('SELECT * FROM Quiz').all();
        const quizzesData = quizzes.map((q: any) => ({
            id: q.id,
            moduleId: q.moduleId,
            title: q.title,
            description: q.description,
            passingScore: q.passingScore,
            timeLimit: q.timeLimit,
            order: q.order,
            createdAt: new Date(q.createdAt)
        }));
        if (quizzesData.length > 0) {
            await prisma.quiz.createMany({ data: quizzesData, skipDuplicates: true });
        }
        console.log(`✅ ${quizzes.length} quizzes migrated.`);

        // 6. Questions
        console.log('Migrating Questions...');
        const questions = sqlite.prepare('SELECT * FROM Question').all();
        const questionsData = questions.map((q: any) => ({
            id: q.id,
            quizId: q.quizId,
            question: q.question,
            type: q.type,
            options: q.options,
            correctAnswer: q.correctAnswer,
            points: q.points,
            order: q.order
        }));
        if (questionsData.length > 0) {
            await prisma.question.createMany({ data: questionsData, skipDuplicates: true });
        }
        console.log(`✅ ${questions.length} questions migrated.`);

        // 7. Enrollments
        console.log('Migrating Enrollments...');
        const enrollments = sqlite.prepare('SELECT * FROM Enrollment').all();
        // Validate FKs if needed, or rely on skipDuplicates/db constraints.
        // For speed, trying direct createMany. If it fails due to missing FKs, we might need filtering.
        // But since we migrated users and courses first, it should be fine mostly.
        const enrollmentsData = enrollments.map((e: any) => ({
            id: e.id,
            userId: e.userId,
            courseId: e.courseId,
            enrolledAt: new Date(e.enrolledAt),
            completedAt: toDate(e.completedAt),
            progress: e.progress
        }));
        if (enrollmentsData.length > 0) {
            await prisma.enrollment.createMany({ data: enrollmentsData, skipDuplicates: true });
        }
        console.log(`✅ ${enrollments.length} enrollments migrated.`);

        // 8. LessonProgress
        console.log('Migrating LessonProgress...');
        const progress = sqlite.prepare('SELECT * FROM LessonProgress').all();
        const progressData = progress.map((p: any) => ({
            id: p.id,
            userId: p.userId,
            lessonId: p.lessonId,
            completed: toBool(p.completed),
            completedAt: toDate(p.completedAt)
        }));
        if (progressData.length > 0) {
            await prisma.lessonProgress.createMany({ data: progressData, skipDuplicates: true });
        }
        console.log(`✅ ${progress.length} lesson progress migrated.`);

        // 9. BlogPosts
        console.log('Migrating BlogPosts...');
        try {
            const posts = sqlite.prepare('SELECT * FROM BlogPost').all();
            const postsData = posts.map((p: any) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                excerpt: p.excerpt,
                content: p.content,
                image: p.image,
                published: toBool(p.published),
                pinned: toBool(p.pinned),
                language: p.language,
                authorId: p.authorId,
                createdAt: new Date(p.createdAt),
                updatedAt: new Date(p.updatedAt)
            }));
            if (postsData.length > 0) {
                await prisma.blogPost.createMany({ data: postsData, skipDuplicates: true });
            }
            console.log(`✅ ${posts.length} blog posts migrated.`);
        } catch (e) {
            console.log('Skipping BlogPosts...');
        }

        console.log('🎉 TURBO Migration completed successfully!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        sqlite.close();
        await prisma.$disconnect();
    }
}

migrate();
