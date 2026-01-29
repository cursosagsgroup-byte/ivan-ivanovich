
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log(`Searching for a student user...`);

    const student = await prisma.user.findFirst({
        where: {
            role: 'STUDENT',
            email: {
                notIn: ['notificacionesluis@outlook.com', 'f.enriquemontiel@gmail.com', 'admin@ivanivanovich.com']
            }
        },
        select: {
            email: true
        }
        // I won't know the password, but I can reset it if needed. 
        // Or I can look for a user created by seed if any, e.g. student@example.com (usually in seed).
    });

    if (student) {
        console.log(`Found student: ${student.email}`);
        // Consider reseting password to 'Ivan2025!' so the user can definitely log in.
        // But the user might want to test with an EXISTING user without changing password if possible.
        // However, I can't give the password if I don't know it.
        // The user asked "dame otro alumno" (give me another student).
        // Usually implies they want credentials to log in.
        // If I can't read the hash, I MUST reset it to give them access, unless I know a default password.
        // I'll check if there's a 'student@ivanivanovich.com' from seed which usually has a known password.
    } else {
        console.log('No other unique students found.');
    }

    const seedStudent = await prisma.user.findFirst({
        where: { email: 'student@ivanivanovich.com' }
    });

    if (seedStudent) {
        console.log(`Found seed student: ${seedStudent.email}`);
    }
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
