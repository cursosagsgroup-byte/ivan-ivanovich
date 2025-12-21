import { prisma } from '../lib/prisma';

const email = process.argv[2];

if (!email) {
    console.error('Please provide an email address as an argument.');
    console.log('Usage: npx tsx scripts/promote_admin.ts <email>');
    process.exit(1);
}

async function main() {
    try {
        const user = await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' },
        });
        console.log(`Success! User ${user.email} is now an ADMIN.`);
    } catch (error) {
        console.error('Error updating user:', error);
        console.log('Make sure the email exists in the database.');
    }
}

main();
