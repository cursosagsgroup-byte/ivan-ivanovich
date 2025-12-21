
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'eligiofernandez@gmail.com';
    const name = 'Eligio Fernández Blanco';
    const courseInterest = 'Team Leader'; // Just for logging context

    console.log(`🔍 Checking for user: ${name} (${email})...`);

    const existingUser = await prisma.user.findUnique({
        where: { email: email }
    });

    if (existingUser) {
        console.log(`✅ User already exists in database with ID: ${existingUser.id}`);
        return;
    }

    console.log('User not found. Creating...');
    const defaultPassword = await bcrypt.hash('IvanIvanovich123!', 10);

    const newUser = await prisma.user.create({
        data: {
            email: email,
            name: name,
            password: defaultPassword,
            role: 'STUDENT',
            // createdAt will default to now (2025-12-19...) which matches the user's "today"
        }
    });

    console.log(`🎉 Successfully added user: ${newUser.name} (ID: ${newUser.id})`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
