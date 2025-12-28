
import { prisma } from '../lib/prisma';

async function createTestOrder() {
    console.log('Creating test order...');

    // Find a course to add to the order
    const course = await prisma.course.findFirst({
        where: { published: true }
    });

    if (!course) {
        console.error('No published courses found to create test order.');
        return;
    }

    const orderNumber = `TEST-${Date.now()}`;
    const order = await prisma.order.create({
        data: {
            userId: 'test-user-id', // Assuming optional or we might need a real user if foreign key constraint exists. 
            // Checking schema users might need to exist.
            // Wait, schema says: userId String. user User @relation...
            // So we need a valid userId.

            // Let's find a user first or create one?
            // Usually test scripts should be robust.
            // Let's try to find the first user.
            user: {
                connect: {
                    email: 'test@example.com' // We'll try to find this or create if not exists
                }
            },

            orderNumber: orderNumber,
            total: course.price,
            status: 'completed',
            billingName: 'Test User',
            billingEmail: 'test@example.com',
            items: {
                create: [
                    {
                        courseId: course.id,
                        price: course.price
                    }
                ]
            }
        }
    }).catch(async (e) => {
        // If user doesn't exist, create one?
        // Actually, let's just find first user.
        const user = await prisma.user.findFirst();
        if (!user) {
            throw new Error("No users found in DB. Cannot create order without user.");
        }

        return await prisma.order.create({
            data: {
                userId: user.id,
                orderNumber: orderNumber,
                total: course.price,
                status: 'completed',
                billingName: 'Carlos Test',
                billingEmail: user.email,
                items: {
                    create: [
                        {
                            courseId: course.id,
                            price: course.price
                        }
                    ]
                }
            }
        });
    });

    console.log(`Test Order Created!`);
    console.log(`Order ID: ${order.id}`);
    console.log(`Order Number: ${order.orderNumber}`);
    console.log(`URL: http://localhost:3000/checkout/success?orderId=${order.id}&orderNumber=${order.orderNumber}`);
}

createTestOrder()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
