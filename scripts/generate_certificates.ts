import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- GENERATING MISSING CERTIFICATES ---\n');

    // Get all enrollments with 100% completion
    const completedEnrollments = await prisma.enrollment.findMany({
        where: {
            progress: 100
        },
        select: {
            id: true,
            userId: true,
            courseId: true,
            enrolledAt: true,
            user: { select: { email: true, name: true } },
            course: { select: { title: true } }
        }
    });

    console.log(`Found ${completedEnrollments.length} completed enrollments\n`);

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const enrollment of completedEnrollments) {
        try {
            // Check if certificate already exists
            const existingCert = await prisma.certificate.findFirst({
                where: {
                    userId: enrollment.userId,
                    courseId: enrollment.courseId
                }
            });

            if (existingCert) {
                skipped++;
                continue;
            }

            // Create certificate with a placeholder ID that will be replaced after creation
            const cert = await prisma.certificate.create({
                data: {
                    userId: enrollment.userId,
                    courseId: enrollment.courseId,
                    issuedAt: new Date(),
                    certificateUrl: 'PENDING' // Will be updated below
                }
            });

            // Update with actual URL using the certificate ID
            await prisma.certificate.update({
                where: { id: cert.id },
                data: {
                    certificateUrl: `/api/certificate/${cert.id}`
                }
            });

            created++;

            if (created % 100 === 0) {
                console.log(`Progress: ${created} created, ${skipped} skipped`);
            }
        } catch (error) {
            console.error(`Error creating certificate for ${enrollment.user.email}:`, error);
            errors++;
        }
    }

    console.log('\n--- SUMMARY ---');
    console.log(`Total Completed Enrollments: ${completedEnrollments.length}`);
    console.log(`Certificates Created: ${created}`);
    console.log(`Skipped (already existed): ${skipped}`);
    console.log(`Errors: ${errors}`);

    // Verify final count
    const totalCerts = await prisma.certificate.count();
    console.log(`\nTotal Certificates in DB: ${totalCerts}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
