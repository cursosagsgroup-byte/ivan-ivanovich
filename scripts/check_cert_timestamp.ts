
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const userId = 'cmkehunz20000k038zgkn7qgj';
    // Team Leader Course ID: cmio13v7r000064w1fs838sgw

    console.log(`🔍 Checking Certificate History for UserID: ${userId}`);

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { certificates: true }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    const cert = user.certificates.find(c => c.courseId === 'cmio13v7r000064w1fs838sgw');
    if (cert) {
        console.log(`✅ Team Leader Certificate:`);
        console.log(`   ID: ${cert.id}`);
        console.log(`   Issued At: ${cert.issuedAt}`);
    } else {
        console.log('❌ Team Leader Certificate NOT found (Should exist)');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
