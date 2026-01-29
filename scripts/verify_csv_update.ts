
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Verifying Update Progress...');

    const kevin = await prisma.user.findFirst({
        where: { email: 'kevin_ishirio@hotmail.com' },
        include: { enrollments: true }
    });

    console.log('\n👤 User: kevin_ishirio@hotmail.com');
    if (kevin) {
        console.log('   ✅ User Exists');
        console.log('   Enrollments:', kevin.enrollments);
    } else {
        console.log('   ❌ User Not Found');
    }

    const completedCount = await prisma.enrollment.count({
        where: { progress: 100 }
    });
    console.log(`\n📊 Total Completely Finished Enrollments (Progress=100): ${completedCount}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
