
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function POST(req: Request) {
    try {
        const { email, identifier } = await req.json();
        const input = identifier || email;

        if (!input) {
            return NextResponse.json({ error: 'Email or Phone is required' }, { status: 400 });
        }

        // Clean input: strip non-digits for phone comparison
        const cleanInput = input.replace(/\D/g, '');
        // Strip common country prefixes (52=MX, 1=US, 54=AR, 57=CO, etc.) to get local number
        const withoutPrefix = cleanInput.replace(/^(52|1|54|57|56|51|593|598|595|591|502|503|504|505|506|507|53|34|58)/, '');

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: input },
                    { phone: cleanInput },          // full number with prefix e.g. 525543830150
                    { phone: withoutPrefix },        // without prefix e.g. 5543830150 (legacy accounts)
                    { phone: input },               // original input as fallback
                ]
            },
        });

        if (!user) {
            // Return success even if user doesn't exist
            return NextResponse.json({ message: 'If account exists, message sent' });
        }

        // Generate token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

        // Save token - Use user.email as identifier to keep it consistent for verification
        // or usage in the reset flow.
        await prisma.verificationToken.create({
            data: {
                identifier: user.email, // Bind to the email for consistency
                token,
                expires,
            },
        });

        const resetLink = `${process.env.NEXTAUTH_URL || 'https://ivanivanovich.com'}/reset-password?token=${token}`;
        const isPhone = /^[0-9+ ]+$/.test(input) && !input.includes('@');

        let whatsappSent = false;
        if (isPhone && user.phone) {
            // Send WhatsApp
            const message = `*Restablecimiento de Contraseña*\n\nHemos recibido una solicitud para tu cuenta en Ivan Ivanovich.\n\nUsa este enlace para crear una nueva contraseña:\n${resetLink}\n\nSi no fuiste tú, ignora este mensaje.`;
            whatsappSent = await sendWhatsAppMessage(user.phone, message);
            if (!whatsappSent) {
                console.error('Failed to send WhatsApp — will fallback to email');
            }
        }

        // Send email if:
        // a) Input was an email, OR
        // b) Input was phone but WhatsApp failed (fallback), OR
        // c) Input was phone but user has no phone in DB
        const shouldSendEmail = !isPhone || !whatsappSent;

        if (shouldSendEmail && user.email) {
            // Send Email logic
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.example.com',
                port: parseInt(process.env.SMTP_PORT || '587'),
                auth: {
                    user: process.env.SMTP_USER || 'user',
                    pass: process.env.SMTP_PASS || 'pass',
                },
            });

            if (!process.env.SMTP_HOST) {
                console.log('--- PASSWORD RESET LINK (DEV) ---');
                console.log(resetLink);
                console.log('-------------------------------');
            } else {
                await transporter.sendMail({
                    from: process.env.SMTP_FROM || '"Ivan Ivanovich" <no-reply@ivanivanovich.com>',
                    to: user.email,
                    subject: 'Restablece tu contraseña - Ivan Ivanovich',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #333;">Restablecimiento de Contraseña</h2>
                            <p>Hemos recibido una solicitud para restablecer tu contraseña para tu cuenta en Ivan Ivanovich.</p>
                            <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${resetLink}" style="background-color: #B70126; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer Contraseña</a>
                            </div>
                            <p style="font-size: 14px; color: #666;">Si no solicitaste este cambio, puedes ignorar este correo. El enlace expirará en 1 hora.</p>
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                            <p style="font-size: 12px; color: #999;">Ivan Ivanovich - Protección Ejecutiva</p>
                        </div>
                    `,
                });
            }
        }

        return NextResponse.json({ message: 'Sent successfully' });
    } catch (error) {
        console.error('Password Reset Error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
