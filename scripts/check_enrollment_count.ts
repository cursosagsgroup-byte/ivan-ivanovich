
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.enrollment.count();
    console.log(`Current Enrollments in DB: ${count}`);

    const attempts = await prisma.quizAttempt.count();
    console.log(`Current Quiz Attempts in DB: ${attempts}`);

    const lessons = await prisma.lessonProgress.count();
    console.log(`Current Lesson Progress in DB: ${lessons}`);

    await prisma.$disconnect();
}

main().catch(console.error);
