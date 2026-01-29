
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Searching for user 'Rigoberto Aguayo'...");

    const users = await prisma.user.findMany({
        where: {
            name: {
                contains: 'Rigoberto Aguayo',
                mode: 'insensitive' // Case insensitive search
            }
        },
        include: {
            enrollments: {
                include: { course: true }
            }
        }
    });

    if (users.length === 0) {
        // Try just 'Rigoberto' if full name fails
        console.log("No exact match. Searching for 'Rigoberto'...");
        const usersBroad = await prisma.user.findMany({
            where: {
                name: {
                    contains: 'Rigoberto',
                    mode: 'insensitive'
                }
            },
            include: {
                enrollments: {
                    include: { course: true }
                }
            }
        });

        if (usersBroad.length === 0) {
            console.log("❌ User not found.");
            return;
        }

        printUsers(usersBroad);
        return;
    }

    printUsers(users);
}

function printUsers(users: any[]) {
    for (const user of users) {
        console.log(`\nUser: ${user.name}`);
        console.log(`Email: ${user.email}`);

        if (user.enrollments.length === 0) {
            console.log("  No enrollments found.");
        } else {
            console.log("  Courses:");
            for (const enrollment of user.enrollments) {
                console.log(`  - ${enrollment.course.title} (Progress: ${enrollment.progress}%)`);
            }
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
