import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

/** Ruta pública del PDF del libro "Protección Ejecutiva Sistema Timeline". */
export const BOOK_DOWNLOAD_PATH = '/materials/proteccion-ejecutiva-sistema-timeline.pdf';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
    let name: string;
    let email: string;
    let country: string;
    let lang: string;

    try {
        const body = await req.json();
        name = String(body.name || '').trim();
        email = String(body.email || '').trim().toLowerCase();
        country = String(body.country || '').trim();
        lang = body.lang === 'en' ? 'en' : 'es';
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!name || !email || !country) {
        return NextResponse.json(
            { error: 'Name, email and country are required' },
            { status: 400 }
        );
    }

    if (!EMAIL_RE.test(email)) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // El lead y el correo son secundarios frente a la promesa hecha al visitante:
    // si cualquiera de los dos falla, la descarga se entrega igual y el fallo queda en logs.
    try {
        await prisma.lead.create({
            data: {
                name,
                email,
                phone: '',
                message: `País: ${country}`,
                source: 'Libro Sistema Timeline',
            },
        });
    } catch (error) {
        console.error('[book-download] No se pudo guardar el lead:', { email, country }, error);
    }

    try {
        await sendBookEmails({ name, email, country, lang });
    } catch (error) {
        console.error('[book-download] No se pudo enviar el correo:', { email }, error);
    }

    return NextResponse.json({ success: true, downloadUrl: BOOK_DOWNLOAD_PATH });
}

async function sendBookEmails({
    name,
    email,
    country,
    lang,
}: {
    name: string;
    email: string;
    country: string;
    lang: string;
}) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('[book-download] SMTP sin configurar. No se enviaron correos.');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const baseUrl = process.env.NEXTAUTH_URL || 'https://ivanivanovich.com';
    const downloadUrl = `${baseUrl}${BOOK_DOWNLOAD_PATH}`;
    const from = process.env.SMTP_FROM || '"Ivan Ivanovich Academy" <noreply@ivanivanovich.com>';

    const headFont = "'Saira Condensed','Arial Narrow',Arial,sans-serif";
    const bodyFont = "'Barlow',Arial,Helvetica,sans-serif";
    const brandRed = '#B70126';
    const brandDark = '#0B121F';

    const copy = lang === 'en'
        ? {
            subject: 'Your free book: Executive Protection Timeline System',
            greeting: `Hello ${name},`,
            intro: 'Thank you for your interest. Here is your copy of <strong>Executive Protection Timeline System</strong>, yours to keep.',
            button: 'Download the book (PDF)',
            fallback: 'If the button does not work, copy this link into your browser:',
            note: 'This book is distributed free of charge for personal use.',
            signoff: 'Best regards,',
            team: 'Ivan Ivanovich Executive Protection Academy',
        }
        : {
            subject: 'Tu libro gratis: Protección Ejecutiva Sistema Timeline',
            greeting: `Hola ${name},`,
            intro: 'Gracias por tu interés. Aquí tienes tu copia de <strong>Protección Ejecutiva Sistema Timeline</strong>, para que la conserves.',
            button: 'Descargar el libro (PDF)',
            fallback: 'Si el botón no funciona, copia este enlace en tu navegador:',
            note: 'Este libro se distribuye de forma gratuita para uso personal.',
            signoff: 'Saludos cordiales,',
            team: 'Ivan Ivanovich Executive Protection Academy',
        };

    const userMail = {
        from,
        to: email,
        subject: copy.subject,
        html: `
<div style="margin:0;padding:0;background:#f4f5f7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:14px;overflow:hidden;">
        <tr><td align="center" style="background:${brandDark};padding:28px 24px;">
          <img src="${baseUrl}/logo.png" alt="Ivan Ivanovich Executive Protection Academy" width="220" style="display:block;width:220px;max-width:70%;height:auto;">
        </td></tr>
        <tr><td style="padding:32px 32px 8px;">
          <h1 style="margin:0 0 18px;font-family:${headFont};font-size:30px;line-height:1.1;text-transform:uppercase;color:${brandDark};">
            Protección Ejecutiva<br><span style="color:${brandRed};">Sistema Timeline</span>
          </h1>
          <p style="margin:0 0 14px;font-family:${bodyFont};font-size:16px;line-height:1.6;color:#333;">${copy.greeting}</p>
          <p style="margin:0 0 26px;font-family:${bodyFont};font-size:16px;line-height:1.6;color:#333;">${copy.intro}</p>
        </td></tr>
        <tr><td align="center" style="padding:0 32px 28px;">
          <a href="${downloadUrl}" style="display:inline-block;background:${brandRed};color:#ffffff;font-family:${bodyFont};font-size:16px;font-weight:bold;text-transform:uppercase;text-decoration:none;padding:16px 34px;border-radius:999px;">${copy.button}</a>
        </td></tr>
        <tr><td style="padding:0 32px 30px;">
          <p style="margin:0 0 6px;font-family:${bodyFont};font-size:13px;line-height:1.6;color:#666;">${copy.fallback}</p>
          <p style="margin:0 0 20px;font-family:${bodyFont};font-size:13px;line-height:1.6;word-break:break-all;"><a href="${downloadUrl}" style="color:${brandRed};">${downloadUrl}</a></p>
          <p style="margin:0 0 22px;font-family:${bodyFont};font-size:13px;line-height:1.6;color:#666;">${copy.note}</p>
          <p style="margin:0;font-family:${bodyFont};font-size:15px;line-height:1.6;color:#333;">${copy.signoff}<br><strong>${copy.team}</strong></p>
        </td></tr>
        <tr><td align="center" style="background:#f4f5f7;padding:18px 24px;">
          <a href="${baseUrl}" style="font-family:${bodyFont};font-size:12px;color:#888;text-decoration:none;">www.ivanivanovich.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</div>`,
    };

    const adminMail = {
        from,
        to: 'academia@ivanivanovich.com',
        subject: `Nueva descarga del libro Timeline: ${name}`,
        html: `
            <h1>Nueva descarga del libro Sistema Timeline</h1>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>País:</strong> ${country}</p>
            <hr>
            <p>Lead capturado desde el formulario de /educacion/libro</p>
        `,
    };

    await Promise.all([
        transporter.sendMail(userMail),
        transporter.sendMail(adminMail),
    ]);
}
