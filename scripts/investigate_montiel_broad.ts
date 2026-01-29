
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Searching for users with 'Montiel'...");

    const users = await prisma.user.findMany({
        where: {
            name: {
                contains: 'Montiel',
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
        console.log("No user found with name containing 'Montiel'");
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
