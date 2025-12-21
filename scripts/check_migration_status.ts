import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('📊 Checking Migration Status...\n');

    const userCount = await prisma.user.count();
    const courseCount = await prisma.course.count();
    const moduleCount = await prisma.module.count();
    const lessonCount = await prisma.lesson.count();
    const quizCount = await prisma.quiz.count();
    const questionCount = await prisma.question.count();
    const enrollmentCount = await prisma.enrollment.count();

    console.log(`Users: ${userCount}`);
    console.log(`Courses: ${courseCount}`);
    console.log(`Modules: ${moduleCount}`);
    console.log(`Lessons: ${lessonCount}`);
    console.log(`Quizzes: ${quizCount}`);
    console.log(`Questions: ${questionCount}`);
    console.log(`Enrollments: ${enrollmentCount}`);

    console.log('\n🔍 Sample Course Data:');
    const course = await prisma.course.findFirst({
        include: {
            modules: {
                include: {
                    lessons: true,
                    quizzes: {
                        include: {
                            questions: true
                        }
                    }
                }
            }
        }
    });

    if (course) {
        console.log(`Course: ${course.title}`);
        console.log(`  Modules: ${course.modules.length}`);
        course.modules.forEach(module => {
            console.log(`    Module: ${module.title}`);
            console.log(`      Lessons: ${module.lessons.length}`);
            module.lessons.slice(0, 3).forEach(lesson => {
                console.log(`        - ${lesson.title} (Video: ${lesson.videoUrl ? 'Yes' : 'No'})`);
            });
            console.log(`      Quizzes: ${module.quizzes.length}`);
            module.quizzes.forEach(quiz => {
                console.log(`        - ${quiz.title} (${quiz.questions.length} questions)`);
            });
        });
    } else {
        console.log('No courses found.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
