import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- ANALYZING EXISTING PROGRESS DATA ---\n');

    // Check if there's LessonProgress data in the DB
    const totalLessonProgress = await prisma.lessonProgress.count();
    const usersWithProgress = await prisma.user.count({
        where: {
            role: 'STUDENT',
            lessonProgress: {
                some: {}
            }
        }
    });

    console.log(`Total LessonProgress records: ${totalLessonProgress}`);
    console.log(`Users with at least one lesson progress: ${usersWithProgress}`);

    // Sample lesson progress records
    const sampleProgress = await prisma.lessonProgress.findMany({
        take: 5,
        select: {
            id: true,
            userId: true,
            lessonId: true,
            completed: true,
            completedAt: true,
            user: { select: { email: true } }
        }
    });

    console.log('\nSample LessonProgress records:');
    console.log(JSON.stringify(sampleProgress, null, 2));

    // Check for certificates
    const totalCertificates = await prisma.certificate.count();
    console.log(`\nTotal Certificates: ${totalCertificates}`);

    if (totalCertificates > 0) {
        const sampleCerts = await prisma.certificate.findMany({
            take: 3,
            select: {
                id: true,
                userId: true,
                courseId: true,
                user: { select: { email: true } }
            }
        });
        console.log('Sample Certificates:');
        console.log(JSON.stringify(sampleCerts, null, 2));
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
