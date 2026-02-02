
import { prisma } from '../lib/prisma';

async function main() {
    const email = 'prueba@prueba.com';
    console.log(`Checking courses for ${email}...`);

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

    user.enrollments.forEach(e => {
        console.log(`Course: ${e.course.title}`);
        console.log(`  ID: ${e.course.id}`);
        console.log(`  Image: ${e.course.image}`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
