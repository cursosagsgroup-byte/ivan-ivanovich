
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TARGETS = [
    {
        email: 'kennethcrc@hotmail.com',
        courses: [
            { id: 'cmio13v7r000064w1fs838sgw', name: 'Team Leader en Protección Ejecutiva' },
            { id: 'cmio13v7u000164w1bhkqj8ej', name: 'Contravigilancia Para Protección Ejecutiva' }
        ]
    },
    {
        email: 'Rodolfo.fallas@disna.go.cr',
        courses: [
            { id: 'cmio13v7u000164w1bhkqj8ej', name: 'Contravigilancia Para Protección Ejecutiva' }
        ]
    },
    {
        email: 'jlsanba19@gmail.com',
        courses: [
            { id: 'cmio13v7u000164w1bhkqj8ej', name: 'Contravigilancia Para Protección Ejecutiva' }
        ]
    }
];

async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function retry<T>(fn: () => Promise<T>, retries = 5, delay = 2000): Promise<T> {
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
    console.log("🔧 Starting Robust Batch Fix for Missing Certificates...\n");

    for (const target of TARGETS) {
        let user;

        try {
            user = await retry(() => prisma.user.findUnique({
                where: { email: target.email }
            }));

            if (!user) {
                console.log(`❌ User not found by email: ${target.email}, searching by iterating (fallback)...`);
                user = await retry(() => prisma.user.findFirst({
                    where: {
                        email: {
                            equals: target.email,
                            mode: 'insensitive'
                        }
                    }
                }));
            }
        } catch (e) {
            console.error(`🚨 Fatal error finding user ${target.email}:`, e);
            continue;
        }

        if (!user) {
            console.error(`🚨 Fatal: Could not find user ${target.email}. Skipping.`);
            continue;
        }

        console.log(`👤 Processing: ${user.name} (${user.email})`);

        for (const course of target.courses) {
            try {
                const existingCert = await retry(() => prisma.certificate.findFirst({
                    where: {
                        userId: user.id,
                        courseId: course.id
                    }
                }));

                if (existingCert) {
                    console.log(`   ⚠️  Certificate already exists for '${course.name}'. Skipping.`);
                    continue;
                }

                // Find enrollment to use its completedAt date if possible, otherwise now
                const enrollment = await retry(() => prisma.enrollment.findUnique({
                    where: {
                        userId_courseId: {
                            userId: user.id,
                            courseId: course.id
                        }
                    }
                }));

                const issuedAt = enrollment?.completedAt || new Date();

                const newCert = await retry(() => prisma.certificate.create({
                    data: {
                        userId: user.id,
                        courseId: course.id,
                        issuedAt: issuedAt,
                        certificateUrl: 'PENDING_GENERATION'
                    }
                }));

                const finalUrl = `/api/certificate/${newCert.id}`;
                await retry(() => prisma.certificate.update({
                    where: { id: newCert.id },
                    data: { certificateUrl: finalUrl }
                }));

                console.log(`   ✅ Generated for '${course.name}'`);
                console.log(`      ID: ${newCert.id}`);
            } catch (err) {
                console.error(`   ❌ Failed to generate for '${course.name}':`, err);
            }
        }
        console.log('');
    }

    console.log("✨ Batch processing complete.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
