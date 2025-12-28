import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- CHECKING USER PASSWORDS ---\n');

    const totalStudents = await prisma.user.count({
        where: { role: 'STUDENT' }
    });

    const studentsWithPassword = await prisma.user.count({
        where: {
            role: 'STUDENT',
            password: { not: null }
        }
    });

    const studentsWithoutPassword = totalStudents - studentsWithPassword;

    console.log(`Total Students: ${totalStudents}`);
    console.log(`With Password: ${studentsWithPassword}`);
    console.log(`Without Password (NULL): ${studentsWithoutPassword}`);

    // Sample users without password
    if (studentsWithoutPassword > 0) {
        const sampleNoPassword = await prisma.user.findMany({
            where: {
                role: 'STUDENT',
                password: null
            },
            select: { id: true, email: true, name: true },
            take: 5
        });
        console.log('\nSample users WITHOUT password:');
        console.log(sampleNoPassword);
    }

    // Sample users with password
    if (studentsWithPassword > 0) {
        const sampleWithPassword = await prisma.user.findMany({
            where: {
                role: 'STUDENT',
                password: { not: null }
            },
            select: { id: true, email: true, name: true },
            take: 5
        });
        console.log('\nSample users WITH password:');
        console.log(sampleWithPassword);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
