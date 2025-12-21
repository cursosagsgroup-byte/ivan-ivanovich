
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Token and Password are required' }, { status: 400 });
        }

        // Verify token
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
        }

        if (verificationToken.expires < new Date()) {
            return NextResponse.json({ error: 'Token expired' }, { status: 400 });
        }

        const email = verificationToken.identifier;

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update User
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        // Delete Token to prevent reuse
        await prisma.verificationToken.delete({
            where: { token },
        });

        return NextResponse.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
