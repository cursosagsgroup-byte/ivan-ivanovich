import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- Analyzing 800 USD Course Sales ---');

    // 1. Find all courses that have a price of 800 OR 14400
    const relevantCourses = await prisma.course.findMany({
        where: {
            OR: [
                { price: 800 },
                { price: 14400 }
            ]
        }
    });

    if (relevantCourses.length === 0) {
        console.log('No courses found with price 800 or 14400.');
        const allCourses = await prisma.course.findMany({
            select: { id: true, title: true, price: true },
            take: 20
        });
        console.log('Some available courses:', allCourses);
    } else {
        console.log(`Found ${relevantCourses.length} relevant course(s):`);
        for (const course of relevantCourses) {
            console.log(`- [${course.id}] ${course.title} ($${course.price})`);

            const orders = await prisma.order.findMany({
                where: {
                    items: {
                        some: {
                            courseId: course.id
                        }
                    }
                },
                select: {
                    orderNumber: true,
                    status: true,
                    total: true,
                    currency: true,
                    createdAt: true
                }
            });

            console.log(`  Total Orders found for this course: ${orders.length}`);
            orders.forEach(o => {
                console.log(`  - Order ${o.orderNumber}: Status=${o.status}, Total=${o.total} ${o.currency}, Date=${o.createdAt}`);
            });
        }
    }


    // 3. Check for any successful payments of 800 USD or 14400 MXN
    console.log('\n--- Successful Payments Check ---');
    const successfulPayments = await prisma.payment.findMany({
        where: {
            status: 'completed'
        },
        include: {
            order: {
                include: {
                    items: {
                        include: {
                            course: true
                        }
                    }
                }
            }
        }
    });

    const matchingPayments = successfulPayments.filter(p => 
        (p.amount === 800 && p.currency === 'USD') || 
        (p.amount === 14400 && p.currency === 'MXN')
    );

    console.log(`Found ${matchingPayments.length} successful payments matching the target price:`);
    matchingPayments.forEach(p => {
        const courseTitles = p.order?.items.map(i => i.course.title).join(', ') || 'Unknown Course';
        console.log(`- Amount: ${p.amount} ${p.currency}, Order: ${p.order?.orderNumber}, Date: ${p.createdAt}, Courses: ${courseTitles}`);
    });

    // List all unique statuses in Order and Payment to be sure
    const orderStatuses = await prisma.order.groupBy({ by: ['status'], _count: true });
    console.log('\nOrder Statuses Summary:', orderStatuses);
    const paymentStatuses = await prisma.payment.groupBy({ by: ['status'], _count: true });
    console.log('Payment Statuses Summary:', paymentStatuses);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
