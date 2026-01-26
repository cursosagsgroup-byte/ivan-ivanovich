import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Checking Rigoberto Aguayo's certificates...\n");

    const user = await prisma.user.findFirst({
        where: {
            name: {
                contains: 'Rigoberto Aguayo',
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

    if (!user) {
        console.log("❌ User not found.");
        return;
    }

    console.log(`✅ User: ${user.name}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🆔 User ID: ${user.id}\n`);

    console.log("📚 ENROLLMENTS:");
    for (const enrollment of user.enrollments) {
        console.log(`  - ${enrollment.course.title}`);
        console.log(`    Progress: ${enrollment.progress}%`);
        console.log(`    Completed: ${enrollment.completedAt ? 'Yes' : 'No'}`);
        console.log(`    Enrollment ID: ${enrollment.id}\n`);
    }

    console.log("🎓 CERTIFICATES:");
    if (user.certificates.length === 0) {
        console.log("  ❌ NO CERTIFICATES FOUND!");
        console.log("  This is the problem - certificates need to be generated.\n");
    } else {
        for (const cert of user.certificates) {
            const course = await prisma.course.findUnique({ where: { id: cert.courseId } });
            console.log(`  - ${course?.title || 'Unknown Course'}`);
            console.log(`    Certificate ID: ${cert.id}`);
            console.log(`    Issued: ${cert.issuedAt}`);
            console.log(`    URL: /api/certificate/${cert.id}\n`);
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
