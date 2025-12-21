
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Fetch one certificate to get a user ID
    const cert = await prisma.certificate.findFirst({
        include: {
            user: {
                select: { email: true, name: true }
            }
        }
    });

    if (cert) {
        console.log('Credentials for verification:');
        console.log(`Email: ${cert.user.email}`);
        console.log(`Name: ${cert.user.name}`);
        console.log('Password: TempPassword123! (Standard migration password)');
        console.log(`Certificate Link (Direct): ${cert.certificateUrl}`);
    } else {
        console.log('No certificates found.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
