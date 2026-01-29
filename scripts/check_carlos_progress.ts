
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'c.beuvrin@ketingmedia.com';
    console.log(`Checking progress for user: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            enrollments: {
                include: {
                    course: true
                }
            }
        }
    });

    if (!user) {
        console.log("User not found.");
        return;
    }

    console.log(`User found: ${user.name} (${user.role})`);
    if (user.enrollments.length === 0) {
        console.log("No enrollments found for this user.");
    } else {
        console.log(`Found ${user.enrollments.length} enrollments:`);
        for (const enrollment of user.enrollments) {
            console.log(`- Course: ${enrollment.course.title}`);
            console.log(`  Progress: ${enrollment.progress}%`);
            console.log(`  Completed At: ${enrollment.completedAt}`);
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
