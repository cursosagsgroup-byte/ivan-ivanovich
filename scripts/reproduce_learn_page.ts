import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const courseId = 'cmio13v7r000064w1fs838sgw';

    // Get a user (simulating the logged-in user)
    const user = await prisma.user.findFirst({
        where: {
            email: 'jdmejia@gmail.com'
        }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    console.log(`User: ${user.email} (${user.id})`);

    // Fetch course data EXACTLY as the LearnPage does
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            modules: {
                orderBy: { order: 'asc' },
                include: {
                    lessons: {
                        orderBy: { order: 'asc' },
                        include: {
                            progress: {
                                where: { userId: user.id }
                            }
                        }
                    },
                    quizzes: {
                        include: {
                            questions: {
                                orderBy: { order: 'asc' }
                            },
                            attempts: {
                                where: { userId: user.id },
                                orderBy: { attemptedAt: 'desc' },
                                take: 1
                            }
                        }
                    }
                }
            }
        }
    });

    if (!course) {
        console.log('Course not found');
        return;
    }

    console.log(`\nCourse: ${course.title}`);
    console.log(`Modules: ${course.modules.length}`);

    // Transform data EXACTLY as LearnPage does
    const modules = course.modules.map(module => {
        const lessons = module.lessons.map(lesson => {
            console.log(`\n  Lesson: ${lesson.title}`);
            console.log(`    ID: ${lesson.id}`);
            console.log(`    VideoURL from DB: ${lesson.videoUrl}`);
            console.log(`    Order: ${lesson.order}`);

            return {
                id: lesson.id,
                title: lesson.title,
                description: lesson.content,
                videoUrl: lesson.videoUrl,
                duration: lesson.duration,
                isCompleted: lesson.progress.length > 0 && lesson.progress[0].completed,
                type: 'video' as const,
                order: lesson.order
            };
        });

        const quizzes = module.quizzes.map(quiz => ({
            id: quiz.id,
            title: quiz.title,
            description: null,
            videoUrl: null,
            duration: quiz.timeLimit,
            isCompleted: quiz.attempts.length > 0 && quiz.attempts[0].passed,
            type: 'quiz' as const,
            order: quiz.order,
            questions: quiz.questions
        }));

        const items = [...lessons, ...quizzes].sort((a, b) => a.order - b.order);

        return {
            id: module.id,
            title: module.title,
            lessons: items
        };
    });

    console.log('\n\n=== TRANSFORMED DATA ===');
    console.log(JSON.stringify(modules, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
