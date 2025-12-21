import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const courseId = 'cmio13v7r000064w1fs838sgw';
    const user = await prisma.user.findFirst({
        where: { email: 'jdmejia@gmail.com' }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

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

    // Check first lesson
    const firstLesson = course.modules[0]?.lessons[0];
    if (firstLesson) {
        console.log('First Lesson:');
        console.log('  ID:', firstLesson.id);
        console.log('  Title:', firstLesson.title);
        console.log('  VideoURL:', firstLesson.videoUrl);
        console.log('  Content length:', firstLesson.content?.length || 0);
        console.log('  Duration:', firstLesson.duration);
    }

    // Calculate total data size
    const jsonString = JSON.stringify(course);
    console.log('\nTotal JSON size:', (jsonString.length / 1024).toFixed(2), 'KB');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
