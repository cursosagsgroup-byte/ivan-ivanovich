
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EMAIL = 'notificacionesluis@outlook.com';

async function main() {
    console.log(`🔍 Inspecting ${EMAIL}...`);

    const user = await prisma.user.findUnique({
        where: { email: EMAIL },
        include: {
            enrollments: {
                include: {
                    course: true
                }
            },
            orders: {
                include: {
                    items: {
                        include: {
                            course: true
                        }
                    }
                }
            },
            certificates: {
                include: {
                    user: true
                }
            }
        }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    const allCourses = await prisma.course.findMany({
        select: { id: true, title: true }
    });

    console.log(`\n👤 User: ${user.name || 'N/A'} (${user.email})`);
    console.log(`🆔 User ID: ${user.id}`);

    console.log(`\n📚 ENROLLMENTS:`);
    if (user.enrollments.length === 0) {
        console.log('No enrollments found.');
    } else {
        for (const enrollment of user.enrollments) {
            console.log(`- ${enrollment.course.title} (ID: ${enrollment.course.id})`);
            console.log(`  📊 Progress: ${enrollment.progress}%`);
        }
    }

    console.log(`\n🛒 ORDERS:`);
    if (user.orders.length === 0) {
        console.log('No orders found.');
    } else {
        for (const order of user.orders) {
            console.log(`- Order: ${order.orderNumber} | Status: ${order.status} | Total: ${order.total}`);
            for (const item of order.items) {
                console.log(`  • ${item.course.title} (ID: ${item.courseId})`);
            }
        }
    }

    console.log(`\n🏫 ALL AVAILABLE COURSES:`);
    allCourses.forEach(c => console.log(`- ${c.title} (ID: ${c.id})`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
