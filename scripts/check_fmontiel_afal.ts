
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Investigating user 'fmontiel@afal.mx'...");

    const user = await prisma.user.findUnique({
        where: { email: 'fmontiel@afal.mx' },
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

    console.log(`User Name: ${user.name}`);
    console.log(`Email: ${user.email}`);

    console.log(`\nEnrollments:`);
    for (const enrollment of user.enrollments) {
        console.log(`  - Course: ${enrollment.course.title}`);
        console.log(`    Progress: ${enrollment.progress}%`);
    }

    console.log(`\nCertificates:`);
    for (const cert of user.certificates) {
        console.log(`  - Certificate ID: ${cert.id}`);
        console.log(`    Course ID: ${cert.courseId}`);
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
