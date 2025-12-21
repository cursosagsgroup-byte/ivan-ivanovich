
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking for Certificates in Database...');

    try {
        const count = await prisma.certificate.count();
        console.log(`Total Certificates Found: ${count}`);

        if (count > 0) {
            const certs = await prisma.certificate.findMany({
                take: 3,
                include: { user: { select: { email: true } } }
            });
            console.log('📝 Sample Certificates:', certs);
        } else {
            console.log('⚠️ No certificates found in the database table.');
        }
    } catch (e) {
        console.error("Error checking certificates:", e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
