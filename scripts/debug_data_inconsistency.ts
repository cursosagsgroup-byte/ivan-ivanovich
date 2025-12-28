
import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- CHECKING DATA INCONSISTENCIES ---');

    // 1. Check for users with Certificates but NO Enrollments
    // This would mean they "finished" a course but lost the enrollment record
    const usersWithCertNoEnrollment = await prisma.user.findMany({
        where: {
            role: 'STUDENT',
            certificates: { some: {} },
            enrollments: { none: {} }
        },
        select: { id: true, email: true, _count: { select: { certificates: true } } },
        take: 10
    });

    console.log(`\nUsers with Certificates but 0 Enrollments: ${usersWithCertNoEnrollment.length} (showing max 10)`);
    usersWithCertNoEnrollment.forEach(u => {
        console.log(`- ${u.email}: ${u._count.certificates} certificates`);
    });

    // 2. Check for users with LessonProgress but NO Enrollments
    const usersWithProgressNoEnrollment = await prisma.user.findMany({
        where: {
            role: 'STUDENT',
            lessonProgress: { some: {} },
            enrollments: { none: {} }
        },
        select: { id: true, email: true, _count: { select: { lessonProgress: true } } },
        take: 10
    });

    console.log(`\nUsers with LessonProgress but 0 Enrollments: ${usersWithProgressNoEnrollment.length} (showing max 10)`);
    usersWithProgressNoEnrollment.forEach(u => {
        console.log(`- ${u.email}: ${u._count.lessonProgress} lesson progress records`);
    });

    // 3. Check for specific users mentioned in previous output (VW users)
    // e.g. miguel.lopez2@vw.com.mx
    const targetEmail = 'miguel.lopez2@vw.com.mx';
    const specificUser = await prisma.user.findUnique({
        where: { email: targetEmail },
        include: {
            enrollments: true,
            certificates: true,
            orders: true,
            lessonProgress: { take: 1 }, // just check existence
            quizAttempts: { take: 1 }
        }
    });

    if (specificUser) {
        console.log(`\n--- DEEP DIVE: ${targetEmail} ---`);
        console.log(`Enrollments: ${specificUser.enrollments.length}`);
        console.log(`Certificates: ${specificUser.certificates.length}`);
        console.log(`Orders: ${specificUser.orders.length}`);
        console.log(`LessonProgress (any?): ${specificUser.lessonProgress.length > 0}`);
        console.log(`QuizAttempts (any?): ${specificUser.quizAttempts.length > 0}`);
    } else {
        console.log(`\nUser ${targetEmail} not found.`);
    }

}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
