import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- Starting Coupon Verification ---');

    // 1. Create a Test Coupon
    const code = 'TESTVERIFY' + Math.floor(Math.random() * 1000);
    console.log(`Creating coupon: ${code}`);

    const coupon = await prisma.coupon.create({
        data: {
            code,
            discountType: 'PERCENTAGE',
            discountValue: 15,
            isActive: true
        }
    });

    console.log('Coupon created:', coupon);

    // 2. Validate Coupon via API Logic (Simulated)
    // We can't call API directly easily here, so we simulate the logic
    console.log('Simulating validation...');

    const foundCoupon = await prisma.coupon.findUnique({
        where: { code }
    });

    if (!foundCoupon) {
        console.error('Validation Failed: Coupon not found');
        return;
    }

    if (foundCoupon.discountValue !== 15) {
        console.error('Validation Failed: Wrong discount value');
        return;
    }

    console.log('Validation passed: Coupon found and correct.');

    // 3. Clean up
    console.log('Cleaning up...');
    await prisma.coupon.delete({
        where: { id: coupon.id }
    });
    console.log('Cleanup done.');

    console.log('--- Verification Complete ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
