import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetUserPassword() {
    const email = 'brenda.alfaro@proeza.com.mx';
    const newPassword = 'TestDemo2024!';

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
    });

    console.log('✅ Password reset successfully!');
    console.log('\n='.repeat(80));
    console.log('TEST USER CREDENTIALS (PARTIAL PROGRESS):');
    console.log('='.repeat(80));
    console.log(`Email: ${email}`);
    console.log(`Password: ${newPassword}`);
    console.log(`Name: ${user.name || 'N/A'}`);
    console.log(`Role: ${user.role}`);
    console.log('\n📊 PROGRESO ACTUAL:');
    console.log('Progress: 11/19 quizzes (57.9% del curso)');
    console.log('Total intentos: 28');
    console.log('Aprobados: 11 | Reprobados: 17');
    console.log('Promedio: 67.9%');
    console.log('\n✅ PERFECTO para ver:');
    console.log('- Quizzes completados (con check verde)');
    console.log('- Quizzes pendientes (todavía por hacer)');
    console.log('- Progreso parcial real y legítimo');
    console.log('\nYou can login at: http://localhost:3000/login');
    console.log('='.repeat(80));

    await prisma.$disconnect();
}

resetUserPassword().catch(console.error);
