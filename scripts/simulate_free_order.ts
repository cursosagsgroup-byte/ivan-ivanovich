import { prisma } from './lib/prisma';
import fetch from 'node-fetch'; // Requires node-fetch or using Next.js local fetch

async function main() {
    // We just want to inspect the logic in the DB, let's call the API directly if it's running,
    // or simulate the exact logic from the route.

    // Simulate what the frontend sends for a 0$ order
    const coupon = await prisma.coupon.findFirst({
        where: { discountValue: 100, discountType: 'PERCENTAGE' }
    });

    if (!coupon) {
        console.log("No 100% coupon found");
        return;
    }

    console.log("Found coupon:", coupon.code);

    const body = {
        items: [{ courseId: coupon.courseId || "cmio13v7r000064w1fs838sgw" }], // Use course tied to coupon or arbitrary
        billingDetails: {
            firstName: "Test",
            lastName: "User",
            email: "test.free.order@example.com"
        },
        couponCode: coupon.code, // Frontend sends this
        paymentMethod: "stripe",
        verificationToken: "no-verification-required",
        password: "password123",
        country: "México",
        phone: "5555555555",
        age: 30
    };

    console.log("Simulating Checkout Request with Body:", JSON.stringify(body, null, 2));

    // To test the exact route logic without running the server, let's extract the core evaluation

    let total = 1900; // Simulated course price
    let discount = 0;

    // 1. Check Max Uses Per User logic that the route uses
    let userLimitReached = false;
    if (coupon.maxUsesPerUser) {
        let usageCount = await prisma.order.count({
            where: {
                billingEmail: body.billingDetails.email,
                couponId: coupon.id,
                status: 'completed'
            }
        });
        console.log("Usage count for email:", usageCount, "Max allowed:", coupon.maxUsesPerUser);

        if (usageCount >= coupon.maxUsesPerUser) {
            userLimitReached = true;
            console.log("USER LIMIT REACHED!");
        }
    }

    if (!userLimitReached) {
        if (coupon.discountType === 'PERCENTAGE') {
            discount = (total * coupon.discountValue) / 100;
        } else {
            discount = coupon.discountValue;
        }
    } else {
        console.log("Coupon rejected due to limit. Discount remains 0.");
    }

    if (discount > total) discount = total;
    const finalTotal = total - discount;
    const isFreeOrder = finalTotal <= 0;

    console.log("---- Result ----");
    console.log("Total:", total);
    console.log("Discount:", discount);
    console.log("Final Total:", finalTotal);
    console.log("isFreeOrder (sent back to frontend):", isFreeOrder);

}

main().catch(console.error).finally(() => prisma.$disconnect());
