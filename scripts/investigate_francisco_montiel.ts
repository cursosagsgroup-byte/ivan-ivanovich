
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Searching for user 'Francisco Montiel'...");

    // Search by name (case insensitive usually depends on DB collation, but we'll try direct match or partial)
    // Prisma `contains` is case insensitive in Postgres by default usually, but let's be safe.
    const users = await prisma.user.findMany({
        where: {
            name: {
                contains: 'Francisco Montiel',
                mode: 'insensitive'
            }
        },
        include: {
            enrollments: {
                include: {
                    course: true
                }
            },
            certificates: true
        }
    });

    if (users.length === 0) {
        console.log("No user found with name containing 'Francisco Montiel'");
        return;
    }

    console.log(`Found ${users.length} user(s):`);

    for (const user of users) {
        console.log(`\nUser: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`ID: ${user.id}`);
        console.log(`Role: ${user.role}`);

        console.log(`\nEnrollments:`);
        if (user.enrollments.length === 0) console.log("  No enrollments.");
        for (const enrollment of user.enrollments) {
            console.log(`  - Course: ${enrollment.course.title} (ID: ${enrollment.course.id})`);
            console.log(`    Progress: ${enrollment.progress}%`);
            console.log(`    Completed At: ${enrollment.completedAt}`);
        }

        console.log(`\nCertificates in DB:`);
        if (user.certificates.length === 0) console.log("  No certificates.");
        for (const cert of user.certificates) {
            console.log(`  - ID: ${cert.id}`);
            console.log(`    Course ID: ${cert.courseId}`);
            console.log(`    Issued At: ${cert.issuedAt}`);
            console.log(`    URL: ${cert.certificateUrl}`);
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
