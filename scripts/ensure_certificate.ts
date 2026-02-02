
import { prisma } from '../lib/prisma';

async function main() {
    const email = 'prueba@prueba.com';
    // Contravigilancia ID from previous steps
    const courseId = 'cmio13v7u000164w1bhkqj8ej';

    console.log(`Checking certificate for ${email} in course ${courseId}...`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.error('User not found');
        return;
    }

    const cert = await prisma.certificate.findFirst({
        where: {
            userId: user.id,
            courseId: courseId
        }
    });

    if (cert) {
        console.log(`Certificate found: ${cert.certificateUrl}`);
    } else {
        console.log('No certificate found. Creating one...');
        // Assuming a dummy URL or generating one if the logic exists.
        // For now, let's point to a placeholder or the generic certificate logic if applicable.
        // Since I don't have the full PDF generation logic here, I'll use a placeholder URL 
        // that points to the web app's certificate view or a static file.
        // Let's assume the web app serves certificates at /certificates/[id] or similar 
        // OR simply put a placeholder PDF link if this is just for testing UI.
        // Realistically, it should be generated. 
        // I will use a placeholder URL for testing: https://ivanivanovich.com/certificado-demo.pdf

        await prisma.certificate.create({
            data: {
                userId: user.id,
                courseId: courseId,
                certificateUrl: 'https://ivanivanovich.com/wp-content/uploads/2023/08/Certificado-Demo.pdf', // Example
                issuedAt: new Date()
            }
        });
        console.log('Certificate created.');
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
