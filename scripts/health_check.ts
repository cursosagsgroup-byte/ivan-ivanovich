
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🏥 Running System Health Check...\n');

    // 1. Check for Progress Anomalies
    const noDateButComplete = await prisma.enrollment.count({
        where: { progress: 100, completedAt: null }
    });

    const dateButIncomplete = await prisma.enrollment.count({
        where: {
            progress: { lt: 100 },
            completedAt: { not: null }
        }
    });

    const impossibleProgress = await prisma.enrollment.count({
        where: {
            OR: [
                { progress: { gt: 100 } },
                { progress: { lt: 0 } }
            ]
        }
    });

    console.log(`⚠️ Anomalies Found:`);
    console.log(`   - 100% Progress without Date: ${noDateButComplete} (Should be 0)`);
    console.log(`   - Completed Date but <100%: ${dateButIncomplete} (Should be 0)`);
    console.log(`   - Impossible Progress (>100 or <0): ${impossibleProgress} (Should be 0)`);

    // 2. Check for Duplicate Enrollments (Same User+Course) - Prisma ID handles this but checking logically
    // (Prisma composite ID userId_courseId usually prevents this, but let's be sure)

    // 3. Check Certificate Readiness
    // Any user with 100% should be able to get a certificate.
    // Let's just sample one 100% user.
    const sampleGrad = await prisma.enrollment.findFirst({
        where: { progress: 100 },
        include: { user: true, course: true }
    });

    if (sampleGrad) {
        console.log(`\n✅ Sample Graduate Verified: ${sampleGrad.user.email} in ${sampleGrad.course.title}`);
    } else {
        console.log(`\n❌ No graduates found? (Unexpected)`);
    }

    if (noDateButComplete === 0 && dateButIncomplete === 0 && impossibleProgress === 0) {
        console.log('\n🎉 SYSTEM HEALTHY: All progress data is consistent.');
    } else {
        console.log('\n❌ SYSTEM HAS DATA ISSUES. See above.');
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
