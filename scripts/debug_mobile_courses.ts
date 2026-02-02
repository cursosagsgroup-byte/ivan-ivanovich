
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'jlsanba19@gmail.com';
    console.log(`Checking enrollments for: ${email}...`);

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
        console.log('User not found');
        return;
    }

    console.log(`Found ${user.enrollments.length} enrollments:`);
    user.enrollments.forEach(e => {
        console.log(`- Course: ${e.course.title} (ID: ${e.courseId}) - Progress: ${e.progress}%`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
