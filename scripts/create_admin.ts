import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        const email = 'admin@ivan.com';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if admin already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email }
        });

        if (existingAdmin) {
            // Update existing user to admin
            const updatedUser = await prisma.user.update({
                where: { email },
                data: {
                    role: 'ADMIN',
                    password: hashedPassword,
                    name: 'Administrador'
                }
            });
            console.log('✅ Usuario actualizado a ADMIN:');
            console.log('Email:', email);
            console.log('Password:', password);
            console.log('Role:', updatedUser.role);
        } else {
            // Create new admin user
            const newAdmin = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: 'Administrador',
                    role: 'ADMIN',
                    emailVerified: new Date()
                }
            });
            console.log('✅ Nuevo usuario ADMIN creado:');
            console.log('Email:', email);
            console.log('Password:', password);
            console.log('Role:', newAdmin.role);
        }

        console.log('\n📝 Credenciales de acceso:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('URL: http://localhost:3000/login');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('Error creando admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
