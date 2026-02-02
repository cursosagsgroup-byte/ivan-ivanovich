
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { SignJWT } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'super-secret-fallback-key';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        console.log(`[Mobile Login Attempt] Email: ${email}`);

        if (!email || !password) {
            console.log('[Mobile Login] Missing credentials');
            return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toString().toLowerCase() }
        });

        if (!user) {
            console.log(`[Mobile Login] User not found: ${email}`);
            return NextResponse.json({ error: 'Usuario no encontrado o contraseña inválida' }, { status: 401 });
        }

        if (!user.password) {
            console.log(`[Mobile Login] User has no password set (OAuth?): ${email}`);
            return NextResponse.json({ error: 'Usuario no tiene contraseña configurada' }, { status: 401 });
        }

        const isValid = await compare(password, user.password);

        if (!isValid) {
            console.log(`[Mobile Login] Invalid password for: ${email}`);
            return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
        }

        console.log(`[Mobile Login] Success: ${email}`);

        // Create JWT
        const secret = new TextEncoder().encode(JWT_SECRET);
        const token = await new SignJWT({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('30d') // Long expiration for mobile app
            .sign(secret);

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image
            }
        });

    } catch (error) {
        console.error('[Mobile Login] Server Error:', error);
        return NextResponse.json({ error: 'server_error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
