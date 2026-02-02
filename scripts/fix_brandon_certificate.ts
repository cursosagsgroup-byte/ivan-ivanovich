
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // User: Brandon Alberto Valverde Navarro
    const userId = 'cmk7n8tld0000nz7vbvnj5d82';
    // Course: Team Leader en Protección Ejecutiva
    const courseId = 'cmio13v7r000064w1fs838sgw';

    console.log(`🔧 Fixing Certificate for User ID: ${userId}`);

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { certificates: true }
    });

    if (!user) {
        console.log('❌ User not found!');
        return;
    }

    // Check if certificate already exists
    const existingCert = user.certificates.find(c => c.courseId === courseId);
    if (existingCert) {
        console.log(`⚠️ Certificate already exists: ${existingCert.id}`);
        return;
    }

    console.log('Generating new certificate...');

    const newCert = await prisma.certificate.create({
        data: {
            userId: user.id,
            courseId: courseId,
            certificateUrl: 'PENDING_GENERATION'
        }
    });

    const finalUrl = `/api/certificate/${newCert.id}`;

    await prisma.certificate.update({
        where: { id: newCert.id },
        data: { certificateUrl: finalUrl }
    });

    console.log(`✅ Certificate Created!`);
    console.log(`ID: ${newCert.id}`);
    console.log(`URL: ${finalUrl}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
