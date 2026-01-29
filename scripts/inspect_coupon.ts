
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const code = 'E6O0NS';
    console.log(`Searching for coupon: ${code}`);

    const coupon = await prisma.coupon.findUnique({
        where: { code },
        include: { course: true }
    });

    if (!coupon) {
        console.log('❌ Coupon not found!');
    } else {
        console.log('✅ Coupon found:');
        console.log(coupon);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
