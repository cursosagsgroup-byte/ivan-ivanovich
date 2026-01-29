
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: { email: { contains: 'ketingmedia' } }
    });

    console.log(`Found ${users.length} remaining users matching "ketingmedia":`);
    users.forEach(u => console.log(`- ${u.email}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
