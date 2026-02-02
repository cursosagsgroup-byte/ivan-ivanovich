
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function retry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (retries <= 0) throw error;
        console.log(`⚠️ Database error, retrying in ${delay}ms... (${retries} attempts left)`);
        await wait(delay);
        return retry(fn, retries - 1, delay * 2);
    }
}

async function main() {
    console.log("🔍 Starting Robust Audit...");

    const BATCH_SIZE = 50;
    let skip = 0;
    let hasMore = true;
    let missingCount = 0;
    const missingList: any[] = [];

    // Load certificates with retry
    console.log("📥 Loading certificates into memory...");
    const allCertificates = await retry(() => prisma.certificate.findMany({
        select: { userId: true, courseId: true }
    }));

    // Safety check for null/undefined
    if (!allCertificates) {
        throw new Error("Failed to load certificates");
    }

    const certMap = new Set(allCertificates.map(c => `${c.userId}-${c.courseId}`));
    console.log(`✅ Loaded ${allCertificates.length} certificates.`);

    console.log("🔍 Scanning 100% completed enrollments...");

    while (hasMore) {
        const enrollments = await retry(() => prisma.enrollment.findMany({
            where: {
                progress: 100
            },
            include: {
                user: true,
                course: true
            },
            take: BATCH_SIZE,
            skip: skip
        }));

        if (enrollments.length === 0) {
            hasMore = false;
            break;
        }

        for (const enrollment of enrollments) {
            const key = `${enrollment.userId}-${enrollment.courseId}`;
            if (!certMap.has(key)) {
                missingCount++;
                missingList.push({
                    user: enrollment.user.email,
                    name: enrollment.user.name,
                    course: enrollment.course.title
                });
            }
        }

        skip += BATCH_SIZE;
        // console.log(`Processed ${skip} records...`);
        await wait(200); // Gentle delay
    }

    console.log("\n" + "=".repeat(60));
    console.log(`🔴 Total Missing Certificates: ${missingCount}`);
    console.log("=".repeat(60));

    if (missingList.length > 0) {
        console.log("List for review:");
        missingList.forEach(item => {
            console.log(`- ${item.user} (${item.name}) | ${item.course}`);
        });
    } else {
        console.log("✅ All completed courses have certificates!");
    }
}

main()
    .catch(e => {
        console.error("Includes Fatal Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
