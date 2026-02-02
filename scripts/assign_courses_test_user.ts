
import { prisma } from '../lib/prisma';

async function main() {
    const email = 'prueba@prueba.com';
    const courseUnstartedId = 'cmio13v7r000064w1fs838sgw'; // Team Leader
    const courseCompletedId = 'cmio13v7u000164w1bhkqj8ej'; // Contravigilancia

    console.log(`Finding user ${email}...`);
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.error('User not found!');
        process.exit(1);
    }

    console.log('Enrolling in "Team Leader" (Unstarted)...');
    await prisma.enrollment.upsert({
        where: {
            userId_courseId: {
                userId: user.id,
                courseId: courseUnstartedId,
            },
        },
        update: {
            progress: 0,
            completedAt: null,
        },
        create: {
            userId: user.id,
            courseId: courseUnstartedId,
            progress: 0,
            completedAt: null,
        },
    });

    console.log('Enrolling in "Contravigilancia" (Completed)...');
    await prisma.enrollment.upsert({
        where: {
            userId_courseId: {
                userId: user.id,
                courseId: courseCompletedId,
            },
        },
        update: {
            progress: 100,
            completedAt: new Date(),
        },
        create: {
            userId: user.id,
            courseId: courseCompletedId,
            progress: 100,
            completedAt: new Date(),
        },
    });

    console.log('Enrollments updated successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
