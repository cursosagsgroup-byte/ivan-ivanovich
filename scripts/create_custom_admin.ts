import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'c.beuvrin@ketingmedia.com';
    const password = 'cbcb.CBCB0251'; // Password requested by user

    console.log(`Setting up admin user: ${email}...`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
            emailVerified: new Date()
        },
        create: {
            email,
            name: 'Carlos Beuvrin',
            password: hashedPassword,
            role: 'ADMIN',
            emailVerified: new Date()
        }
    });

    console.log(`✅ User ${user.email} is now an ADMIN.`);
    console.log(`   ID: ${user.id}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
