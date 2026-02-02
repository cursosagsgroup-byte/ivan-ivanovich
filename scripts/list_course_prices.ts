
import { prisma } from '@/lib/prisma';

async function listCoursePrices() {
    try {
        console.log('Listing all courses and their prices...\n');

        const courses = await prisma.course.findMany({
            select: {
                id: true,
                title: true,
                price: true,
                language: true
            },
            orderBy: {
                title: 'asc'
            }
        });

        if (courses.length === 0) {
            console.log('No courses found.');
        } else {
            console.log(`Found ${courses.length} courses:\n`);
            courses.forEach(c => {
                console.log(`- ${c.title}`);
                console.log(`  Language: ${c.language}`);
                console.log(`  Price: $${c.price.toFixed(2)}`);

                // Simple heuristic check
                if (c.price < 50 && c.price > 0) {
                    console.log('  ⚠️ WARNING: Price seems low for MXN. Verify if this is intentional.');
                }
                console.log('---------------------------------------------------');
            });
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

listCoursePrices();
