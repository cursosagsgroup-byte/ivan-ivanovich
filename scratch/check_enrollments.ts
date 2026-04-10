import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- Checking Enrollments for 800 USD Course ---');

    const courseId = 'cmmdxl4jq00002djx81x89qm2';
    const enrollments = await prisma.enrollment.count({
        where: {
            courseId: courseId
        }
    });

    console.log(`Enrollments for Costa Rica course: ${enrollments}`);

    // Let's see which courses have the most enrollments
    const enrollmentCounts = await prisma.enrollment.groupBy({
        by: ['courseId'],
        _count: true,
        orderBy: {
            _count: {
                courseId: 'desc'
            }
        },
        take: 10
    });

    console.log('\nTop Enrolled Courses:');
    for (const ec of enrollmentCounts) {
        const course = await prisma.course.findUnique({
            where: { id: ec.courseId },
            select: { title: true, price: true }
        });
        console.log(`- ${course?.title || 'Unknown'} ($${course?.price}): ${ec._count} enrollments`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
