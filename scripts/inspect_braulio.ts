
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Inspecting Braulio Barrera (barrera_gtz@yahoo.com.mx)...');

    const user = await prisma.user.findFirst({
        where: { email: 'barrera_gtz@yahoo.com.mx' },
        include: {
            enrollments: {
                include: { course: true }
            }
        }
    });

    if (!user) {
        console.log('❌ User not found');
        return;
    }

    console.log(`User ID: ${user.id}`);
    console.log('Enrollments:');
    user.enrollments.forEach(e => {
        console.log(`- Course: ${e.course.title}`);
        console.log(`  Progress: ${e.progress}%`);
        console.log(`  Completed At: ${e.completedAt}`);
        console.log(`  ID: ${e.id}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
