
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔧 Fixing Missing Completion Dates...');

    const result = await prisma.enrollment.updateMany({
        where: {
            progress: 100,
            completedAt: null
        },
        data: {
            completedAt: new Date()
        }
    });

    console.log(`✅ Updated ${result.count} enrollments with current date.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
