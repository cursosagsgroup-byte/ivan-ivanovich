import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // First, fetch a user ID. For this example, we'll use a hardcoded one or find the first user.
    // In a real application, this would come from authentication context.
    const user = await prisma.user.findFirst(); // Or findUnique({ where: { email: 'test@example.com' } })
    if (!user) {
        console.log('No user found. Please ensure there is at least one user in the database.');
        return;
    }
    const userId = user.id;
    console.log(`Fetching progress for user ID: ${userId}`);

    const courses = await prisma.course.findMany({
        where: {
            id: 'cmio13v7r000064w1fs838sgw'
        },
        include: {
            modules: {
                include: {
                    lessons: {
                        include: {
                            // Include progress for the specific user
                            progress: {
                                where: {
                                    userId: userId
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (courses.length === 0) {
        console.log('No courses found with ID cmio13v7r000064w1fs838sgw');
        return;
    }

    const course = courses[0];
    console.log(`Checking course: ${course.title} (${course.id})`);

    for (const module of course.modules) {
        console.log(`  Module: ${module.title}`);
        for (const lesson of module.lessons) {
            console.log(`    Lesson: ${lesson.title}`);
            console.log(`      Video URL: ${lesson.videoUrl || 'MISSING'}`);
        }
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
