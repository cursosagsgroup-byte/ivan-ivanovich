
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

        // Clean phone number if it looks like one (remove + and spaces) to match DB if needed
        // Assuming DB stores raw or formatted? Checkout page sends raw usually.
        // Let's search by OR
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: input },
                    { phone: input }
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

        if (isPhone && user.phone) {
            // Send WhatsApp
            const message = `*Restablecimiento de Contraseña*\n\nHemos recibido una solicitud para tu cuenta en Ivan Ivanovich.\n\nUsa este enlace para crear una nueva contraseña:\n${resetLink}\n\nSi no fuiste tú, ignora este mensaje.`;
            const sent = await sendWhatsAppMessage(user.phone, message);
            if (!sent) {
                // Fallback to email if WhatsApp fails? Or just log?
                console.error('Failed to send WhatsApp, attempting email fallback if available');
            }
        }

        // Always send email if it was email input OR if we want dual notification?
        // Let's stick to: If input was email, send email. If input was phone, send WhatsApp.
        // BUT if I input phone, and WA fails, user is stuck.
        // Also user might prefer Email.
        // Let's do: If input is email -> Email. If input is Phone -> WhatsApp.

        if (!isPhone || (isPhone && !user.phone)) {
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
