
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Verifying Course IDs for Montiel...");

    const user = await prisma.user.findFirst({
        where: {
            email: 'f.enriquemontiel@gmail.com'
        },
        include: {
            enrollments: {
                include: { course: true }
            },
            certificates: true
        }
    });

    if (!user) { console.log("User not found"); return; }

    const enrollment = user.enrollments[0]; // Assuming he has one
    const cert = user.certificates[0]; // Assuming he has one

    console.log(`Enrollment Course ID: '${enrollment.courseId}'`);
    console.log(`Certificate Course ID: '${cert.courseId}'`);

    const match = enrollment.courseId === cert.courseId;
    console.log(`Match: ${match}`);

    if (!match) {
        console.log("IDS DO NOT MATCH! This is the bug.");
        console.log(`Difference: '${enrollment.courseId}' vs '${cert.courseId}'`);
    } else {
        console.log("IDs match perfectly.");
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
