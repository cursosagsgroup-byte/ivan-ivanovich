
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Inspecting Braulio Certificates...');

    const user = await prisma.user.findFirst({
        where: { email: 'barrera_gtz@yahoo.com.mx' },
        include: {
            certificates: true
        }
    });

    if (!user) {
        console.log('❌ User not found');
        return;
    }

    console.log(`certificates count: ${user.certificates.length}`);
    user.certificates.forEach(c => {
        console.log(`- Cert ID: ${c.id}`);
        console.log(`  Course ID: ${c.courseId}`);
        console.log(`  Code: ${c.code}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
