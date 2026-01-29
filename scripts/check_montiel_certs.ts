
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Checking certificates for 'Francisco Enrique Montiel'...");

    const user = await prisma.user.findFirst({
        where: {
            email: 'f.enriquemontiel@gmail.com'
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

    if (!user) {
        console.log("User not found.");
        return;
    }

    console.log(`User: ${user.name}`);
    console.log(`Email: ${user.email}`);

    console.log(`\nEnrollments:`);
    for (const enrollment of user.enrollments) {
        console.log(`- Course: ${enrollment.course.title}`);
        console.log(`  Progress: ${enrollment.progress}%`);
        console.log(`  Completed At: ${enrollment.completedAt}`);
    }

    console.log(`\nCertificates in DB:`);
    if (user.certificates.length === 0) {
        console.log("  ❌ No certificates found.");
    } else {
        for (const cert of user.certificates) {
            console.log(`  - ID: ${cert.id}`);
            console.log(`    Course ID: ${cert.courseId}`);
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
