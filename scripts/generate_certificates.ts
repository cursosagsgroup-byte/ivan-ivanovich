
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting Certificate Generation...');

    // 1. Fetch eligible enrollments
    const enrollments = await prisma.enrollment.findMany({
        where: {
            OR: [
                { progress: 100 },
                { completedAt: { not: null } }
            ]
        },
        include: {
            // Need to check if certificate exists for this user/course
            // But Certificate model isn't directly linked to Enrollment in schema (it has userId, courseId)
            // So we'll fetch existing certificates first to compare.
        }
    });

    console.log(`Found ${enrollments.length} eligible enrollments.`);

    // 2. Fetch existing certificates to avoid duplicates
    const existingCerts = await prisma.certificate.findMany();
    const existingSet = new Set(existingCerts.map(c => `${c.userId}-${c.courseId}`));

    let createdCount = 0;

    // Base URL for where the certificate API lives
    const baseUrl = process.env.NEXTAUTH_URL || 'https://ivanivanovich.com';

    for (const enrollment of enrollments) {
        const key = `${enrollment.userId}-${enrollment.courseId}`;

        if (existingSet.has(key)) {
            // console.log(`⏩ Certificate already exists for user ${enrollment.userId}`);
            continue;
        }

        // Generate Certificate
        // Note: The Certificate model has 'certificateUrl'. 
        // We will store the API route URL as the "certificateUrl" so the frontend can just link to it.
        // But to do that, we need the ID first. 
        // Actually, we create the record, get the ID, then we know the URL: /api/certificate/{id}

        // Issued Date: use completedAt if available, else now.
        const issuedAt = enrollment.completedAt || new Date();

        const cert = await prisma.certificate.create({
            data: {
                userId: enrollment.userId,
                courseId: enrollment.courseId,
                issuedAt: issuedAt,
                certificateUrl: 'placeholder' // Update after creation or use ID driven URL
            }
        });

        // Update URL with real ID
        const finalUrl = `/api/certificate/${cert.id}`;

        await prisma.certificate.update({
            where: { id: cert.id },
            data: { certificateUrl: finalUrl }
        });

        createdCount++;
        // console.log(`✅ Created certificate for ${enrollment.userId}`);
    }

    console.log(`\n🎉 Process Complete.`);
    console.log(`   Total Eligible: ${enrollments.length}`);
    console.log(`   Newly Created: ${createdCount}`);
    console.log(`   Already Existing: ${existingSet.size}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
