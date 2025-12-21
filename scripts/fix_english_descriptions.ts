import { prisma } from '../lib/prisma';

async function main() {
    // Team Leader (EN)
    await prisma.course.updateMany({
        where: {
            title: { contains: 'Team Leader' },
            language: 'en'
        },
        data: {
            description: "Advanced training for executive protection team leaders. Learn the techniques and strategies used by the world's security elite."
        }
    });

    // Counter Surveillance (EN)
    await prisma.course.updateMany({
        where: {
            title: { contains: 'Counter Surveillance' },
            language: 'en'
        },
        data: {
            description: "Advanced techniques for detecting and preventing hostile surveillance. Protect your clients by identifying threats before they materialize."
        }
    });

    console.log('Descriptions updated successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
