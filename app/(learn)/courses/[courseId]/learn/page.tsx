import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import CoursePlayer from '@/components/course/CoursePlayer';

interface LearnPageProps {
    params: Promise<{
        courseId: string;
    }>;
}

export default async function LearnPage({ params }: LearnPageProps) {
    const { courseId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        redirect('/login');
    }

    // Get user ID
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    });

    if (!user) {
        redirect('/login');
    }

    // Verify enrollment
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: user.id,
                courseId: courseId
            }
        }
    });

    if (!enrollment) {
        redirect('/dashboard');
    }

    // Fetch course data with modules, lessons and quizzes
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
        redirect('/dashboard');
    }

    // Transform and merge data for the player
    const modules = course.modules.map((module, moduleIndex) => {
        // Transform lessons
        const lessons = module.lessons.map(lesson => {
            const lessonData = {
                id: lesson.id,
                title: lesson.title,
                description: lesson.content || null,
                videoUrl: lesson.videoUrl || null,
                vimeoUrl: lesson.videoUrl || null, // Duplicate with different name
                duration: lesson.duration || null,
                isCompleted: lesson.progress.length > 0 && lesson.progress[0].completed,
                type: 'video' as const,
                order: lesson.order,
                isLocked: false // Will be set after module processing
            };
            return lessonData;
        });

        // Transform quizzes
        const quizzes = module.quizzes.map(quiz => {
            const quizData = {
                id: quiz.id,
                title: quiz.title,
                description: null as string | null,
                videoUrl: null as string | null,
                duration: quiz.timeLimit || null,
                isCompleted: quiz.attempts.length > 0 && quiz.attempts[0].passed,
                type: 'quiz' as const,
                order: quiz.order,
                questions: quiz.questions,
                isLocked: false, // Will be set after module processing
                lastAttemptScore: quiz.attempts.length > 0 ? quiz.attempts[0].score : null
            };
            return quizData;
        });

        // Merge and sort by order
        const items = [...lessons, ...quizzes].sort((a, b) => a.order - b.order);

        const moduleData = {
            id: module.id,
            title: module.title,
            lessons: items,
            order: module.order
        };

        return moduleData;
    });

    // Apply locking logic: Module N is locked if Module N-1's quiz is not passed with 60%+
    modules.forEach((module, moduleIndex) => {
        if (moduleIndex === 0) {
            // First module is always unlocked
            module.lessons.forEach(lesson => {
                lesson.isLocked = false;
            });
        } else {
            // Check if previous module's quiz is passed
            const previousModule = modules[moduleIndex - 1];
            const previousQuiz = previousModule.lessons.find(l => l.type === 'quiz');

            // Lock this module if previous quiz doesn't exist, isn't completed, or score < 60%
            const isPreviousQuizPassed = previousQuiz &&
                previousQuiz.isCompleted &&
                (previousQuiz.lastAttemptScore ?? 0) >= 60;

            const isModuleLocked = !isPreviousQuizPassed;

            // Lock all lessons in this module if module is locked
            module.lessons.forEach(lesson => {
                lesson.isLocked = isModuleLocked;
            });
        }
    });

    // DEBUG: Log data before passing to client component
    console.log('=== SERVER SIDE DEBUG ===');
    console.log('Course:', course.title);
    console.log('Total modules:', modules.length);
    if (modules.length > 0) {
        console.log('First module:', modules[0].title);
        console.log('First module lessons count:', modules[0].lessons.length);
        if (modules[0].lessons.length > 0) {
            const firstLesson = modules[0].lessons[0];
            console.log('First lesson:', firstLesson.title);
            console.log('First lesson videoUrl:', firstLesson.videoUrl);
            console.log('First lesson type:', typeof firstLesson.videoUrl);
            console.log('First lesson full object:', JSON.stringify(firstLesson, null, 2));
        }
    }
    console.log('========================');

    // Explicitly serialize to ensure proper data transfer
    const serializedModules = JSON.parse(JSON.stringify(modules));

    return (
        <CoursePlayer
            courseId={course.id}
            courseTitle={course.title}
            modules={serializedModules}
            initialProgress={enrollment.progress}
            userId={user.id}
        />
    );
}
