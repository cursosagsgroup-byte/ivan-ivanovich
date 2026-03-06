const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const coupon = await prisma.coupon.findFirst({
        where: { code: "E6O0NS" } // The one we found earlier that failed
    });

    if (!coupon) {
        console.log("Coupon not found");
        return;
    }

    // Find an email that ALREADY used this coupon
    const pastOrder = await prisma.order.findFirst({
        where: { couponId: coupon.id, status: 'completed' }
    });

    if (!pastOrder) return console.log("No past order for this coupon");

    console.log("Simulating Checkout for an EMAIL THAT ALREADY USED IT:", pastOrder.billingEmail);

    const body = {
        billingDetails: {
            email: pastOrder.billingEmail
        },
    };

    let total = 1900; // Simulated course price
    let discount = 0;

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
        discount = total;
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
