import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetPassword() {
    const email = 'asaeltc@hotmail.com';
    const newPassword = 'test123';

    console.log(`🔐 Resetting password for ${email}...`);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
    });

    console.log('✅ Password reset successfully!');
    console.log('');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', newPassword);
    console.log('');
    console.log('You can now login at http://localhost:3000/login');

    await prisma.$disconnect();
}

resetPassword().catch(console.error);
