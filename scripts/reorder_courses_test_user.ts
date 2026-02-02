
import { prisma } from '../lib/prisma';

async function main() {
    const email = 'prueba@prueba.com';
    const courseTeamLeaderId = 'cmio13v7r000064w1fs838sgw'; // Should be first (Newer date)
    const courseContraId = 'cmio13v7u000164w1bhkqj8ej'; // Should be second (Older date)

    console.log(`Finding user ${email}...`);
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.error('User not found!');
        process.exit(1);
    }

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    console.log('Updating "Team Leader" to Now (First)...');
    await prisma.enrollment.update({
        where: {
            userId_courseId: {
                userId: user.id,
                courseId: courseTeamLeaderId,
            },
        },
        data: {
            enrolledAt: now,
        },
    });

    console.log('Updating "Contravigilancia" to Yesterday (Second)...');
    await prisma.enrollment.update({
        where: {
            userId_courseId: {
                userId: user.id,
                courseId: courseContraId,
            },
        },
        data: {
            enrolledAt: yesterday,
        },
    });

    console.log('Enrollments reordered successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
