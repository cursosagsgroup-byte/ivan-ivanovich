
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = 'f.enriquemontiel@gmail.com';

    console.log(`Checking status for ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            updatedAt: true,
            createdAt: true
        }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    console.log(`User found: ${user.email}`);
    console.log(`Created At: ${user.createdAt}`);
    console.log(`Last Updated At: ${user.updatedAt}`);

    // Calculate time difference
    const now = new Date();
    const diff = now.getTime() - new Date(user.updatedAt).getTime();
    const diffMinutes = Math.floor(diff / 60000);
    const diffHours = Math.floor(diff / 3600000);

    console.log(`Updated ${diffMinutes} minutes ago (${diffHours} hours ago)`);
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
