import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Searching for Don Jordan...\n");

    // Search for user
    const users = await prisma.user.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: 'Don Jordan',
                        mode: 'insensitive'
                    }
                },
                {
                    name: {
                        contains: 'Donald Jordan',
                        mode: 'insensitive'
                    }
                },
                {
                    email: {
                        contains: 'jordan',
                        mode: 'insensitive'
                    }
                }
            ]
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
        console.log("❌ User not found.");
        return;
    }

    for (const user of users) {
        console.log(`✅ User: ${user.name}`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`🆔 User ID: ${user.id}`);
        console.log(`🌐 Language: ${user.language}\n`);

        console.log("📚 ENROLLMENTS:");
        if (user.enrollments.length === 0) {
            console.log("  ❌ No enrollments found.\n");
        } else {
            for (const enrollment of user.enrollments) {
                console.log(`  - ${enrollment.course.title}`);
                console.log(`    Progress: ${enrollment.progress}%`);
                console.log(`    Enrolled: ${enrollment.enrolledAt}`);
                console.log(`    Completed: ${enrollment.completedAt ? 'Yes' : 'No'}`);
                if (enrollment.completedAt) {
                    console.log(`    Completed Date: ${enrollment.completedAt}`);
                }
                console.log(`    Enrollment ID: ${enrollment.id}\n`);
            }
        }

        console.log("🎓 CERTIFICATES:");
        if (user.certificates.length === 0) {
            console.log("  ❌ NO CERTIFICATES FOUND!");

            // Check if should have certificates
            const completedCourses = user.enrollments.filter(e => e.progress === 100);
            if (completedCourses.length > 0) {
                console.log(`  ⚠️  Has ${completedCourses.length} completed course(s) but no certificates!\n`);
            } else {
                console.log("  ℹ️  No completed courses yet.\n");
            }
        } else {
            for (const cert of user.certificates) {
                const course = await prisma.course.findUnique({ where: { id: cert.courseId } });
                console.log(`  ✅ ${course?.title || 'Unknown Course'}`);
                console.log(`     Certificate ID: ${cert.id}`);
                console.log(`     Issued: ${cert.issuedAt}`);
                console.log(`     URL: /api/certificate/${cert.id}\n`);
            }
        }

        console.log("=".repeat(60) + "\n");
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
