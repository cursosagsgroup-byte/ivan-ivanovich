import { prisma } from '@/lib/prisma';


async function main() {
    const email = 'script_test@otp.com';
    const baseUrl = 'http://localhost:3000';

    console.log('1. Cleaning up...');
    await prisma.user.deleteMany({ where: { email } });
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    console.log('2. Sending OTP...');
    const sendRes = await fetch(`${baseUrl}/api/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    console.log('Send OTP Status:', sendRes.status);

    // Get Token from DB
    const tokenRecord = await prisma.verificationToken.findFirst({ where: { identifier: email } });
    if (!tokenRecord) {
        console.error('ERROR: No token found in DB');
        process.exit(1);
    }
    console.log('Token found:', tokenRecord.token);

    console.log('3. Verifying OTP...');
    const verifyRes = await fetch(`${baseUrl}/api/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: tokenRecord.token })
    });
    const verifyData = await verifyRes.json();
    console.log('Verify Status:', verifyRes.status);
    if (!verifyData.verificationToken) {
        console.error('ERROR: No verification token returned');
        console.log(verifyData);
        process.exit(1);
    }
    console.log('JWT Received');

    console.log('4. Creating Order (and User)...');
    const orderRes = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            items: [{ courseId: 'cmio13v7r000064w1fs838sgw' }], // Using a known course ID (Team Leader)
            billingDetails: {
                firstName: 'Test',
                lastName: 'Script',
                email
            },
            verificationToken: verifyData.verificationToken,
            password: 'securepassword123'
        })
    });
    const orderData = await orderRes.json();
    console.log('Order Status:', orderRes.status);
    console.log('Order Data:', orderData);

    if (orderRes.status !== 200) {
        console.error('ERROR: Order creation failed');
        process.exit(1);
    }

    console.log('5. Verifying User Creation...');
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.error('ERROR: User was not created');
        process.exit(1);
    }
    console.log('User created:', user.id);
    console.log('SUCCESS: Full flow verified');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
