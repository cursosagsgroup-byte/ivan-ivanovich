
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Investigating user 'manuesparta75@gmail.com'...");

    const user = await prisma.user.findUnique({
        where: { email: 'manuesparta75@gmail.com' },
        include: {
            enrollments: {
                include: { course: true }
            },
            certificates: true
        }
    });

    if (!user) {
        console.log("❌ User not found.");
        return;
    }

    console.log(`User: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`ID: ${user.id}`);

    console.log(`\nEnrollments:`);
    if (user.enrollments.length === 0) console.log("  No enrollments.");
    for (const enrollment of user.enrollments) {
        console.log(`  - Course: ${enrollment.course.title}`);
        console.log(`    ID: ${enrollment.course.id}`);
        console.log(`    Progress: ${enrollment.progress}%`);
        console.log(`    Completed At: ${enrollment.completedAt}`);
    }

    console.log(`\nCertificates in DB:`);
    if (user.certificates.length === 0) {
        console.log("  ❌ NO CERTIFICATES FOUND IN DB.");
    } else {
        for (const cert of user.certificates) {
            console.log(`  - Cert ID: ${cert.id}`);
            console.log(`    Course ID: ${cert.courseId}`);
            console.log(`    Issued At: ${cert.issuedAt}`);
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
