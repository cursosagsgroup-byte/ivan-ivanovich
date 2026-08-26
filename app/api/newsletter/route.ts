import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FUENTE = 'Newsletter Blog';

/** Alta de suscriptor desde el pie de los artículos. Reutiliza el modelo
 *  Lead (igual que la descarga del libro) para verlos en el mismo panel. */
export async function POST(req: NextRequest) {
    let email: string;
    let lang: string;

    try {
        const body = await req.json();
        email = String(body.email || '').trim().toLowerCase();
        lang = body.lang === 'en' ? 'en' : 'es';
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!EMAIL_RE.test(email)) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    try {
        // Un correo ya suscrito no se duplica; para el visitante es lo mismo.
        const existente = await prisma.lead.findFirst({
            where: { email, source: FUENTE },
        });
        if (!existente) {
            await prisma.lead.create({
                data: {
                    name: email.split('@')[0],
                    email,
                    phone: '',
                    message: `Idioma: ${lang}`,
                    source: FUENTE,
                },
            });
        }
    } catch (error) {
        console.error('[newsletter] No se pudo guardar el suscriptor:', { email }, error);
        return NextResponse.json({ error: 'Could not subscribe' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
