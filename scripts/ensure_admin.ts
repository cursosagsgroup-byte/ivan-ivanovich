import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('👤 Checking for Admin User...\n');

    const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    });

    if (admin) {
        console.log(`✅ Admin user found: ${admin.email}`);
        // console.log(`   Password (hashed): ${admin.password}`);
    } else {
        console.log('⚠️ No admin user found. Creating one...');
        const email = 'admin@ivanivanovich.com';
        const password = 'AdminPassword123!';
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await prisma.user.create({
            data: {
                email,
                name: 'Admin User',
                password: hashedPassword,
                role: 'ADMIN',
                emailVerified: new Date()
            }
        });
        console.log(`✅ Created admin user: ${newAdmin.email}`);
        console.log(`   Password: ${password}`);
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
