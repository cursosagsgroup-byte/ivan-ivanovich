import { prisma } from '../lib/prisma';
import { format } from 'date-fns';

async function main() {
    try {
        const oldest = await prisma.user.findFirst({
            where: { role: 'STUDENT' },
            orderBy: { createdAt: 'asc' },
            select: { createdAt: true, email: true }
        });

        const newest = await prisma.user.findFirst({
            where: { role: 'STUDENT' },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true, email: true }
        });

        const total = await prisma.user.count({ where: { role: 'STUDENT' } });

        console.log('--- Student Data Analysis ---');
        console.log(`Total Students: ${total}`);
        if (oldest) {
            console.log(`Oldest Record: ${format(oldest.createdAt, 'yyyy-MM-dd HH:mm')} (${oldest.email})`);
        }
        if (newest) {
            console.log(`Newest Record: ${format(newest.createdAt, 'yyyy-MM-dd HH:mm')} (${newest.email})`);
        }
        console.log('-----------------------------');

    } catch (error) {
        console.error('Error analyzing data:', error);
    }
}

main();
