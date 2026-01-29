
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'yorman5281@gmail.com'; // User found to have completed courses
    const newPassword = '051312898'; // The "key" requested

    console.log(`Resetting password for ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            enrollments: {
                include: { course: true }
            }
        }
    });

    if (!user) {
        console.log("User not found.");
        return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
    });

    console.log(`✅ Password updated to: ${newPassword}`);
    console.log(`User: ${user.name}`);
    console.log(`Courses:`);
    user.enrollments.forEach(e => {
        console.log(`- ${e.course.title}: ${e.progress}%`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
