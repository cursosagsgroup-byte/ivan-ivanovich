import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Store OTP in database (using VerificationToken model)
        // Check if token exists for this identifier, if so update/delete
        const existingToken = await prisma.verificationToken.findFirst({
            where: { identifier: email }
        });

        if (existingToken) {
            await prisma.verificationToken.update({
                where: {
                    identifier_token: {
                        identifier: email,
                        token: existingToken.token
                    }
                },
                data: {
                    token: otp,
                    expires
                }
            });
        } else {
            await prisma.verificationToken.create({
                data: {
                    identifier: email,
                    token: otp,
                    expires
                }
            });
        }

        // MOCK EMAIL SENDING
        // TODO: INTEGRATE REAL EMAIL PROVIDER (Resend/SendGrid/AWS SES)
        // 1. Install email library (e.g., npm install resend)
        // 2. Add API Key to .env
        // 3. Replace the console.log below with actual email sending call
        console.log(`[MOCK EMAIL] OTP for ${email}: ${otp}`);

        return NextResponse.json({ success: true, message: 'OTP sent' });

    } catch (error) {
        console.error('Error sending OTP:', error);
        return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }
}
