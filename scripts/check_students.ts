import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking Students in Database...\n');

    const totalUsers = await prisma.user.count();
    const studentCount = await prisma.user.count({
        where: {
            role: 'STUDENT'
        }
    });

    console.log(`📊 Total Users: ${totalUsers}`);
    console.log(`👨‍🎓 Total Students: ${studentCount}`);

    console.log('\n📋 All Users in Database:');
    const allUsers = await prisma.user.findMany({
        select: {
            email: true,
            name: true,
            role: true,
            createdAt: true
        }
    });

    allUsers.forEach(user => {
        console.log(`  - [${user.role}] ${user.name} (${user.email}) - Joined: ${user.createdAt.toISOString().split('T')[0]}`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
