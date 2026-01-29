
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Checking for completed enrollments without certificates...");

    // 1. Find all completed enrollments (progress = 100 OR completedAt is not null)
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
        }
    });

    console.log(`Found ${completedEnrollments.length} completed enrollments total.`);

    let fixedCount = 0;
    let skippedCount = 0;

    for (const enrollment of completedEnrollments) {
        // 2. Check if a certificate exists for this user and course
        const existingCert = await prisma.certificate.findFirst({
            where: {
                userId: enrollment.userId,
                courseId: enrollment.courseId
            }
        });

        if (existingCert) {
            skippedCount++;
            continue;
        }

        // 3. Create missing certificate
        console.log(`🛠️ Creating missing certificate for:`);
        console.log(`   User: ${enrollment.user.email}`);
        console.log(`   Course: ${enrollment.course.title}`);

        const issueDate = enrollment.completedAt || new Date(); // Use completion date or now

        const newCert = await prisma.certificate.create({
            data: {
                userId: enrollment.userId,
                courseId: enrollment.courseId,
                issuedAt: issueDate,
                certificateUrl: `/api/certificate/placeholder` // The ID will be generated, URL is dynamic anyway usually, but we set a placeholder here as schema requires it. 
                // Wait, schema says: certificateUrl String. 
                // The API route uses the ID. 
                // Let's set it to a placeholder first, then update it with ID? 
                // Or just generate ID first? Prisma generates ID automatically.
                // We can set URL to `/api/certificate/PENDING` and then update? 
                // Or better: The logic in `certificates` table usually holds the URL. 
                // Let's verify what `check_montiel_certs.ts` showed.
                // It showed: URL: /api/certificate/cmjq8dg1400nhb3gh03ntm3ei
                // So the URL contains the ID.
                // We can creates it, get the ID, then update the URL.
            }
        });

        // Update with correct URL containing the ID
        const finalCert = await prisma.certificate.update({
            where: { id: newCert.id },
            data: {
                certificateUrl: `/api/certificate/${newCert.id}`
            }
        });

        console.log(`   ✅ Certificate created: ${finalCert.id}`);
        fixedCount++;
    }

    console.log('\n--- SUMMARY ---');
    console.log(`Total Completed Enrollments: ${completedEnrollments.length}`);
    console.log(`Already had certificates: ${skippedCount}`);
    console.log(`Newly created certificates: ${fixedCount}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
