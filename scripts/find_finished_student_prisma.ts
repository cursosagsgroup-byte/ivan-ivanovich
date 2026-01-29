
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Searching for users with completed enrollments...");

    // Find enrollments where progress is 100 or completedAt is not null
    const completedEnrollments = await prisma.enrollment.findMany({
        where: {
            OR: [
                { progress: 100 },
                { completedAt: { not: null } }
            ]
        },
        include: {
            user: true,
            course: true
        },
        take: 5
    });

    if (completedEnrollments.length === 0) {
        console.log("No users found with completed enrollments.");
    } else {
        console.log(`Found ${completedEnrollments.length} completed enrollments:`);
        for (const enrollment of completedEnrollments) {
            console.log(`User: ${enrollment.user.email} (ID: ${enrollment.user.id})`);
            console.log(`Course: ${enrollment.course.title}`);
            console.log(`Progress: ${enrollment.progress}%`);
            console.log('---');
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
