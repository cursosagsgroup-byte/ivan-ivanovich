import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- Checking Payment Config ---');
    const stripeConfig = await prisma.paymentConfig.findUnique({
        where: { gateway: 'stripe' },
    });

    if (!stripeConfig) {
        console.log('Stripe config NOT found in database.');
    } else {
        console.log('Stripe Config found:');
        console.log(`  Enabled: ${stripeConfig.enabled}`);
        console.log(`  Test Mode: ${stripeConfig.testMode}`);
        console.log(`  Public Key: ${stripeConfig.publicKey ? 'Set' : 'Missing'}`);
        console.log(`  Secret Key: ${stripeConfig.secretKey ? 'Set' : 'Missing'}`);
        console.log(`  Webhook Secret: ${stripeConfig.webhookSecret ? 'Set' : 'Missing'}`);
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
