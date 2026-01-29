
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🗑️ Deleting Invalid Certificates (Progress < 100 but Cert Exists)...');

    const usersWithCerts = await prisma.user.findMany({
        where: {
            certificates: { some: {} }
        },
        include: {
            certificates: true,
            enrollments: { include: { course: true } }
        }
    });

    let deletedCount = 0;

    for (const user of usersWithCerts) {
        for (const cert of user.certificates) {
            // Find corresponding enrollment
            const enrollment = user.enrollments.find(e => e.courseId === cert.courseId);

            if (!enrollment) {
                console.log(`❌ Deleting Orphaned Cert (No Enrollment): User ${user.email} for ${cert.courseId}`);
                await prisma.certificate.delete({ where: { id: cert.id } });
                deletedCount++;
            } else if (enrollment.progress < 100) {
                console.log(`⚠️ Deleting Premature Cert: User ${user.email} (Progress ${enrollment.progress}%) for ${enrollment.course.title}`);
                await prisma.certificate.delete({ where: { id: cert.id } });
                deletedCount++;
            }
        }
    }

    console.log(`\n✅ Successfully Deleted ${deletedCount} Invalid Certificates.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
