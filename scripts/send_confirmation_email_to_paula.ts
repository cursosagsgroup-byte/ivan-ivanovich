
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Manually load .env
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value && !process.env[key.trim()]) {
            process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, ''); // Remove quotes
        }
    });
}

const prisma = new PrismaClient();

async function main() {
    const email = 'paauu.3@gmail.com';
    console.log(`Preparing to send email to: ${email}`);

    // 1. Get the order
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            orders: {
                where: { status: 'completed' }, // We just marked it completed
                orderBy: { createdAt: 'desc' },
                take: 1,
                include: { items: { include: { course: true } } }
            }
        }
    });

    if (!user || user.orders.length === 0) {
        console.log('No completed order found for user.');
        return;
    }

    const order = user.orders[0];
    const items = order.items;

    // 2. Configure Transporter
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('SMTP credentials missing in .env');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // 3. Build Email Content
    const itemsHtml = items.map(item => `
        <div style="padding: 10px; border-bottom: 1px solid #eee;">
            <p><strong>Curso:</strong> ${item.course.title}</p>
        </div>
    `).join('');

    const mailOptions = {
        from: process.env.SMTP_FROM || '"Ivan Ivanovich Academy" <noreply@ivanivanovich.com>',
        to: email,
        subject: `¡Tu curso ha sido activado! - Ivan Ivanovich Academy`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #B70126;">¡Tu acceso ya está listo!</h1>
                <p>Hola ${order.billingName},</p>
                <p>Te confirmamos que tu pago ha sido verificado manualmente y tu curso ya está activo en tu cuenta.</p>
                
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Detalles de la Orden</h3>
                    <p><strong>Número de Orden:</strong> ${order.orderNumber}</p>
                    <p><strong>Estado:</strong> Completado / Pagado</p>
                    <div style="margin-top: 10px;">
                        ${itemsHtml}
                    </div>
                </div>

                <p>Ya puedes acceder a tu panel de estudiante y comenzar tu curso inmediatamente.</p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXTAUTH_URL}/mi-cuenta" style="background-color: #B70126; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ir a Mis Cursos</a>
                </div>

                <p style="font-size: 14px; color: #666;">Disculpa la demora. Si tienes alguna duda adicional, estamos para ayudarte.</p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="font-size: 12px; color: #999;">Ivan Ivanovich Academy</p>
            </div>
        `,
    };

    // 4. Send Email
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${email}`);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
