import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Resetting Admin Password...\n');

    const email = 'admin@ivanivanovich.com';
    const password = 'AdminPassword123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
        where: { email },
        data: {
            password: hashedPassword
        }
    });

    console.log(`✅ Password reset for: ${updatedUser.email}`);
    console.log(`   New Password: ${password}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
