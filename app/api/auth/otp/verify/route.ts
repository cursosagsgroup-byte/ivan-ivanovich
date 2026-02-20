import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
        }

        // Verify OTP
        const record = await prisma.verificationToken.findFirst({
            where: {
                identifier: email,
                token: code
            }
        });

        if (!record) {
            return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
        }

        if (new Date() > record.expires) {
            // Clean up expired token
            await prisma.verificationToken.delete({
                where: {
                    identifier_token: {
                        identifier: email,
                        token: code
                    }
                }
            });
            return NextResponse.json({ error: 'Code expired' }, { status: 400 });
        }

        // OTP Valid!
        // Delete used token
        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: email,
                    token: code
                }
            }
        });

        // Generate Signed Verification Token (JWT) to pass to Order API
        // This ensures the Order API knows the email was truly verified by us
        const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret-do-not-use-in-prod';

        const verificationToken = jwt.sign(
            { email, verified: true, type: 'checkout_verification' },
            secret,
            { expiresIn: '1h' }
        );

        return NextResponse.json({
            success: true,
            verificationToken
        });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
    }
}
