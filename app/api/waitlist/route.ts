import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Interesados en la próxima edición de un curso presencial ya celebrado. */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const name = String(body.name || '').trim();
        const email = String(body.email || '').trim().toLowerCase();
        const courseTitle = String(body.courseTitle || '').trim();

        if (!name || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }
        if (!EMAIL_RE.test(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        await prisma.lead.create({
            data: {
                name,
                email,
                phone: '',
                message: `Quiere aviso de la próxima edición de: ${courseTitle}`,
                source: 'Lista de espera',
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[waitlist] error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
