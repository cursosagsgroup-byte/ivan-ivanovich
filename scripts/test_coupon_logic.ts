
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const couponCode = 'E6O0NS';
    // Simulate course item price (from what I saw in DB inspections earlier, course.price is usually 1900 or 2500)
    // Actually, I should fetch a real course.

    // Find a course that this coupon applies to, or any course if global
    const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
        include: { course: true }
    });

    if (!coupon) {
        console.error('Coupon not found');
        return;
    }

    console.log('Coupon found:', coupon);

    let price = 2500; // Default test price
    if (coupon.course) {
        price = coupon.course.price;
        console.log(`Coupon is restricted to course: ${coupon.course.title}, Price: ${price}`);
    } else {
        console.log('Coupon is global.');
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
        discount = (price * coupon.discountValue) / 100;
        console.log(`Calculating percentage discount: (${price} * ${coupon.discountValue}) / 100 = ${discount}`);
    } else {
        discount = coupon.discountValue;
        console.log(`Adding flat discount: ${discount}`);
    }

    const total = price;
    let finalDiscount = discount;
    if (finalDiscount > total) finalDiscount = total;

    const finalTotal = total - finalDiscount;
    console.log(`\nFinal Calculation:`);
    console.log(`Original Total: ${total}`);
    console.log(`Discount Applied: -${finalDiscount}`);
    console.log(`Final Total: ${finalTotal}`);
    console.log(`isFreeOrder (<= 0): ${finalTotal <= 0}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
