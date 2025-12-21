
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'barrera_gtz@yahoo.com.mx';
    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, role: true, name: true }
    });

    console.log('User Check:', user);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
