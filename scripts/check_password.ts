
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = 'notificacionesluis@outlook.com';

    console.log(`Fetching password info for ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, password: true }
    });

    if (!user) {
        console.error('User not found');
        return;
    }

    console.log(`User ID: ${user.id}`);
    console.log(`Password Hash: ${user.password}`);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
