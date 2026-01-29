
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Finding Example Users by Progress Status...\n');

    // 1. Not Started (0%)
    const notStarted = await prisma.enrollment.findFirst({
        where: { progress: 0 },
        include: { user: true, course: true }
    });

    // 2. In Process (1% - 99%)
    const inProcess = await prisma.enrollment.findFirst({
        where: {
            progress: { gt: 0, lt: 100 }
        },
        include: { user: true, course: true }
    });

    // 3. Completed (100%)
    const completed = await prisma.enrollment.findFirst({
        where: { progress: 100 },
        include: { user: true, course: true }
    });

    console.log('--------------------------------------------------');

    if (notStarted) {
        console.log(`🔴 SIN COMENZAR (0%):`);
        console.log(`   User: ${notStarted.user.email}`);
        console.log(`   Course: ${notStarted.course.title}`);
    } else {
        console.log('🔴 SIN COMENZAR: None found');
    }

    console.log('\n--------------------------------------------------');

    if (inProcess) {
        console.log(`🟡 EN PROCESO (${inProcess.progress}%):`);
        console.log(`   User: ${inProcess.user.email}`);
        console.log(`   Course: ${inProcess.course.title}`);
    } else {
        console.log('🟡 EN PROCESO: None found');
    }

    console.log('\n--------------------------------------------------');

    if (completed) {
        console.log(`🟢 CONCLUIDO (100%):`);
        console.log(`   User: ${completed.user.email}`);
        console.log(`   Course: ${completed.course.title}`);
    } else {
        console.log('🟢 CONCLUIDO: None found');
    }

    console.log('--------------------------------------------------');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
