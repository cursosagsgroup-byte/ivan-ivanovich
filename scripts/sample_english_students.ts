
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Sampling English Course Enrollments...\n');

    const englishCourse = await prisma.course.findFirst({
        where: { title: 'Team Leader in Executive Protection' },
        include: {
            enrollments: {
                take: 20,
                include: { user: true }
            }
        }
    });

    if (!englishCourse) {
        console.log('Course not found');
        return;
    }

    console.log(`Course: ${englishCourse.title}`);
    console.log('First 20 Students:');
    englishCourse.enrollments.forEach(e => {
        console.log(`- ${e.user.email} (${e.user.name})`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
