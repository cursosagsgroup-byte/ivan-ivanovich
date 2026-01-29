
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Searching for user...');
    const user = await prisma.user.findUnique({
        where: { email: 'notificacionesluis@outlook.com' },
        include: {
            enrollments: {
                include: {
                    course: {
                        include: {
                            modules: {
                                include: {
                                    lessons: true,
                                    quizzes: true
                                }
                            }
                        }
                    }
                }
            },
            lessonProgress: true,
            quizAttempts: true
        }
    })

    if (!user) {
        console.log('User not found');
    } else {
        console.log('User found:', user.email, user.id);
        console.log('Enrollments:', user.enrollments.map(e => e.course.title));

        // Find if any module matches "Puesta a Punto"
        const modules = await prisma.module.findMany({
            where: {
                title: {
                    contains: 'Puesta a Punto',
                    mode: 'insensitive'
                }
            },
            include: {
                course: true
            }
        });

        console.log('Modules matching "Puesta a Punto":', modules.map(m => `${m.title} (Course: ${m.course.title})`));


        const courseTitle = 'Team Leader en Protección Ejecutiva';
        const enrollment = user.enrollments.find(e => e.course.title === courseTitle);

        if (enrollment) {
            console.log(`\nAnalyzing progress for course: ${courseTitle}`);
            console.log(`Enrollment Progress: ${enrollment.progress}%`); // Added log
            const modules = enrollment.course.modules.sort((a, b) => a.order - b.order);

            for (const module of modules) {
                console.log(`\nModule: ${module.title} (Order: ${module.order})`);

                // Check Lessons
                for (const lesson of module.lessons.sort((a, b) => a.order - b.order)) {
                    const progress = user.lessonProgress.find(lp => lp.lessonId === lesson.id);
                    console.log(`  Lesson: ${lesson.title} - ${progress?.completed ? 'COMPLETED' : 'INCOMPLETE'}`);
                }

                // Check Quizzes
                for (const quiz of module.quizzes.sort((a, b) => a.order - b.order)) {
                    const attempts = user.quizAttempts.filter(qa => qa.quizId === quiz.id);
                    const passed = attempts.some(a => a.passed);
                    console.log(`  Quiz: ${quiz.title} - ${passed ? 'PASSED' : 'NOT PASSED'} (Attempts: ${attempts.length})`);
                    if (attempts.length > 0) {
                        attempts.forEach(a => console.log(`    - Score: ${a.score}, Date: ${a.attemptedAt}`));
                    }
                }
            }
        } else {
            console.log(`User not enrolled in ${courseTitle}`);
        }

    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
