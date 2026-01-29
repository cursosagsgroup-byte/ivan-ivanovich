
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Detecting Invalid Certificates (Progress < 100 but Cert Exists)...');

    const usersWithCerts = await prisma.user.findMany({
        where: {
            certificates: { some: {} }
        },
        include: {
            certificates: true,
            enrollments: { include: { course: true } }
        }
    });

    let invalidCount = 0;

    for (const user of usersWithCerts) {
        for (const cert of user.certificates) {
            // Find corresponding enrollment
            const enrollment = user.enrollments.find(e => e.courseId === cert.courseId);

            if (!enrollment) {
                console.log(`❌ Invalid Cert: User ${user.email} has cert for ${cert.courseId} but NO enrollment!`);
                invalidCount++;
            } else if (enrollment.progress < 100) {
                console.log(`⚠️ Invalid Cert: User ${user.email} has cert for ${enrollment.course.title} but Progress is ${enrollment.progress}%`);
                invalidCount++;
            }
        }
    }

    console.log(`\nTotal Invalid Certificates Found: ${invalidCount}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
