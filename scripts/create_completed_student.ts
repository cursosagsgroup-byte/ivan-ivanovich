
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log("Creating a test user with completed enrollment...");

    const email = 'estudiante_finalizado@test.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Create or update user
    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'STUDENT',
            name: 'Estudiante Finalizado'
        },
        create: {
            email,
            name: 'Estudiante Finalizado',
            password: hashedPassword,
            role: 'STUDENT',
        },
    });

    console.log(`User created/updated: ${user.email}`);

    // 2. Find a course
    const course = await prisma.course.findFirst({
        where: { published: true }
    });

    if (!course) {
        console.error("No published courses found!");
        return;
    }

    console.log(`Enrolling in course: ${course.title} (${course.id})`);

    // 3. Create or update enrollment
    const enrollment = await prisma.enrollment.upsert({
        where: {
            userId_courseId: {
                userId: user.id,
                courseId: course.id
            }
        },
        update: {
            progress: 100,
            completedAt: new Date()
        },
        create: {
            userId: user.id,
            courseId: course.id,
            progress: 100,
            completedAt: new Date(),
            enrolledAt: new Date()
        }
    });

    console.log("Enrollment completed.");
    console.log("------------------------------------------------");
    console.log("✅ User ready:");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Course Completed: ${course.title}`);
    console.log("------------------------------------------------");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
