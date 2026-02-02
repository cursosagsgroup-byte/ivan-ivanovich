
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // User: Mainor Sancho
    const userId = 'cmk7en4wh0000a478gmk4ycwp';

    // Courses
    const courses = [
        { id: 'cmio13v7r000064w1fs838sgw', name: 'Team Leader en Protección Ejecutiva' },
        { id: 'cmio13v7u000164w1bhkqj8ej', name: 'Contravigilancia Para Protección Ejecutiva' }
    ];

    console.log(`🔧 Fixing Certificates for User ID: ${userId}`);

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { certificates: true }
    });

    if (!user) {
        console.log('❌ User not found!');
        return;
    }

    for (const course of courses) {
        // Check if certificate already exists
        const existingCert = user.certificates.find(c => c.courseId === course.id);
        if (existingCert) {
            console.log(`⚠️ Certificate already exists for ${course.name}: ${existingCert.id}`);
            continue;
        }

        console.log(`Generating new certificate for ${course.name}...`);

        const newCert = await prisma.certificate.create({
            data: {
                userId: user.id,
                courseId: course.id,
                certificateUrl: 'PENDING_GENERATION'
            }
        });

        const finalUrl = `/api/certificate/${newCert.id}`;

        await prisma.certificate.update({
            where: { id: newCert.id },
            data: { certificateUrl: finalUrl }
        });

        console.log(`✅ Certificate Created for ${course.name}!`);
        console.log(`   ID: ${newCert.id}`);
        console.log(`   URL: ${finalUrl}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
