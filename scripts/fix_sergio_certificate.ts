
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


async function main() {
    // User: Sergio Berrocal
    const userId = 'cmkehunz20000k038zgkn7qgj';
    // Course: Contravigilancia Para Protección Ejecutiva
    const courseId = 'cmio13v7u000164w1bhkqj8ej';

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

    // Generate a new certificate ID (using cuid-like behavior or letting Prisma handle it if default)
    // Prisma schema says @default(cuid()), so we just create.
    // certificateUrl is required. Based on other certs, it seems to be /api/certificate/{id}
    // We will create it first, get the ID, then update the URL if needed, or construct it.

    // Actually, we can just put a placeholder and then update it, or better yet, since we don't have the ID yet,
    // we can rely on the fact that we can construct the URL after creation or use a temporary one.
    // However, looking at the schema: certificateUrl is String.
    // Let's create it with a placeholder and update it immediately, or generate a CUID manually if we had a library.
    // Since we don't want to import extra libs if not needed, we'll let Prisma generate ID.

    const newCert = await prisma.certificate.create({
        data: {
            userId: user.id,
            courseId: courseId,
            certificateUrl: 'PENDING_GENERATION' // Placeholder
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
