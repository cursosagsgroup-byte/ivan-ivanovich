
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'gcc.mx@wso-security.com';
    const newPasswordRaw = 'Ivan2025!';

    console.log(`Resetting password for ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.error('User not found');
        return;
    }

    const hashedPassword = await bcrypt.hash(newPasswordRaw, 10);

    await prisma.user.update({
        where: { email },
        data: {
            password: hashedPassword,
            updatedAt: new Date()
        }
    });

    console.log(`Password for ${email} has been reset to: ${newPasswordRaw}`);
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
