
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const couponCode = 'E6O0NS';
    console.log(`Checking usage for coupon: ${couponCode}`);

    const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
        include: { course: true }
    });

    if (!coupon) {
        console.log('Coupon not found');
        return;
    }

    console.log(`Max Uses Per User: ${coupon.maxUsesPerUser}`);

    // Find all orders that used this coupon
    const orders = await prisma.order.findMany({
        where: { couponId: coupon.id },
        include: { user: true }
    });

    console.log(`\nFound ${orders.length} orders using this coupon:`);
    orders.forEach(o => {
        console.log(`- Order ${o.orderNumber}: Status=${o.status}, User=${o.billingEmail}, Date=${o.createdAt.toISOString()}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
