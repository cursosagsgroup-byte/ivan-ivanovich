import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, phone, message, subject } = body;

        if (!name || !email) {
            return NextResponse.json(
                { error: 'Name and email are required' },
                { status: 400 }
            );
        }

        // 1. Save to Database
        const lead = await prisma.lead.create({
            data: {
                name,
                email,
                phone: phone || '',
                message: message || '',
                source: 'Website Contact Form'
            }
        });

        // 2. Configure Nodemailer
        // Assuming env vars are present: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            // 3. Send Email to Admin
            const adminMailOptions = {
                from: process.env.SMTP_FROM || '"Ivan Ivanovich Academy" <noreply@ivanivanovich.com>',
                to: 'contacto@ivanivanovich.com',
                subject: `Nuevo Contacto Web: ${subject || 'Sin asunto'}`,
                html: `
                    <h1>Nuevo mensaje de contacto</h1>
                    <p><strong>Nombre:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
                    <p><strong>Asunto:</strong> ${subject || 'Sin asunto'}</p>
                    <p><strong>Mensaje:</strong></p>
                    <p>${message}</p>
                    <hr>
                    <p>Este mensaje fue enviado desde el formulario de contacto de ivanivanovich.com</p>
                `,
            };

            // 4. Send Confirmation Email to User
            const userMailOptions = {
                from: process.env.SMTP_FROM || '"Ivan Ivanovich Academy" <noreply@ivanivanovich.com>',
                to: email,
                subject: 'Gracias por contactarnos - Ivan Ivanovich Academy',
                html: `
                    <h1>Hola ${name},</h1>
                    <p>Hemos recibido tu mensaje correctamente.</p>
                    <p>Nuestro equipo revisará tu consulta y nos pondremos en contacto contigo lo antes posible.</p>
                    <br>
                    <p><strong>Tu mensaje original:</strong></p>
                    <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">
                        ${message}
                    </blockquote>
                    <br>
                    <p>Saludos cordiales,</p>
                    <p><strong>El equipo de Ivan Ivanovich Academy</strong></p>
                `,
            };

            await Promise.all([
                transporter.sendMail(adminMailOptions),
                transporter.sendMail(userMailOptions)
            ]);
        } else {
            console.warn('SMTP credentials not configured. Emails were not sent.');
        }

        return NextResponse.json({ success: true, lead });
    } catch (error) {
        console.error('Error processing contact form:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
