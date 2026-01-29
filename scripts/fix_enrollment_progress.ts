
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = 'notificacionesluis@outlook.com';
    const courseTitle = 'Team Leader en Protección Ejecutiva';

    console.log(`Recalculating progress for ${email} in course ${courseTitle}`);

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true }
    });

    if (!user) {
        console.error('User not found');
        return;
    }

    const course = await prisma.course.findFirst({
        where: { title: courseTitle },
        select: { id: true }
    });

    if (!course) {
        console.error('Course not found');
        return;
    }

    // Get total lessons in course (video + quiz, assuming all lessons count for progress)
    // Note: The API logic counts record in 'Lesson' table. Quizzes are sometimes modeled as lessons or separate.
    // In schema.prisma: Module has Lessons and Quizzes.
    // The API logic shown previously:
    // const totalLessons = await prisma.lesson.count({ where: { module: { courseId: ... } } });
    // This ONLY counts Lessons, not Quizzes? 
    // Let's re-read schema. Lesson model has type? No, Lesson model is separate from Quiz model.
    // Wait, the API I read was `app/api/lessons/complete/route.ts`.
    // It counted `prisma.lesson.count`.
    // Let's check `CoursePlayer.tsx`:
    // It maps module.lessons AND module.quizzes to a unified list.
    // But the API might only be counting 'Lesson' table rows.
    // Let's check the schema again. 'Lesson' and 'Quiz' are separate models.
    // If the API only counts 'Lesson', then Quizzes don't contribute to percentage?
    // Or maybe Quizzes are also in Lesson table?
    // Schema: 
    // model Lesson { ... }
    // model Quiz { ... }
    // They are separate.

    // However, looking at the API code I read:
    // const totalLessons = await prisma.lesson.count(...)
    // It seems to ignore quizzes for the progress percentage!
    // But let's verify if `Lesson.type` exists. 
    // Schema doesn't show `type` on `Lesson`. `Question` has `type`. `Lesson` has `videoUrl`, `content`.

    // So, strict adherence to the EXISTING API logic means only counting Lessons.

    const totalLessons = await prisma.lesson.count({
        where: {
            module: {
                courseId: course.id
            }
        }
    });

    const completedLessons = await prisma.lessonProgress.count({
        where: {
            userId: user.id,
            completed: true,
            lesson: {
                module: {
                    courseId: course.id
                }
            }
        }
    });

    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    console.log(`Total Lessons: ${totalLessons}`);
    console.log(`Completed Lessons: ${completedLessons}`);
    console.log(`Calculated Progress: ${progress}%`);

    const enrollment = await prisma.enrollment.update({
        where: {
            userId_courseId: {
                userId: user.id,
                courseId: course.id
            }
        },
        data: {
            progress: progress
        }
    });

    console.log(`Updated Enrollment Progress to: ${enrollment.progress}%`);
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
