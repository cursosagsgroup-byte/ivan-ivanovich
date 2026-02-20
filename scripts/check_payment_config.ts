
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking Payment Configuration...');

    const configs = await prisma.paymentConfig.findMany();

    if (configs.length === 0) {
        console.log('No payment configurations found.');
    } else {
        configs.forEach(config => {
            console.log(`\nGateway: ${config.gateway}`);
            console.log(`Enabled: ${config.enabled}`);
            console.log(`Test Mode: ${config.testMode}`);
            console.log(`Public Key: ${config.publicKey ? 'SET' : 'MISSING'}`);
            console.log(`Secret Key: ${config.secretKey ? 'SET' : 'MISSING'}`);
            console.log(`Webhook Secret: ${config.webhookSecret ? 'SET' : 'MISSING'}`);
        });
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
