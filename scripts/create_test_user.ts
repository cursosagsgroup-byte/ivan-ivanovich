
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    const email = 'prueba@prueba.com';
    const password = '051312898';

    console.log(`Checking if user ${email} exists...`);

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        console.log(`User ${email} already exists. Updating password...`);
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });
        console.log('Password updated successfully.');
    } else {
        console.log(`Creating user ${email}...`);
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Test User',
                role: 'STUDENT',
                language: 'es',
            },
        });
        console.log('User created successfully.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
