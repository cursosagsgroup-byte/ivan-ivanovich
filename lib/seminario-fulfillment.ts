import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import {
    SEMINARIO_ONLINE_COURSE_ID,
    SEMINARIO_BONUS_COURSE_IDS,
    SEMINARIO_WHATSAPP_GROUP_URL,
} from '@/lib/course-constants';

type OrderItemLike = { courseId: string };
type OrderLike = {
    userId: string;
    billingEmail: string;
    billingName?: string | null;
};

// True si la orden incluye el Seminario Online.
export function orderHasSeminario(items: OrderItemLike[]): boolean {
    return items.some((i) => i.courseId === SEMINARIO_ONLINE_COURSE_ID);
}

// Inscribe al comprador del Seminario en los cursos bono (Team Leader + Contravigilancia
// online, idempotente) y le envía el correo de bienvenida con acceso + grupo de WhatsApp.
// Se llama desde TODOS los caminos de completado: orden gratis (cupón), Stripe y MercadoPago.
export async function fulfillSeminarioBundle(order: OrderLike) {
    try {
        for (const courseId of SEMINARIO_BONUS_COURSE_IDS) {
            const existing = await prisma.enrollment.findUnique({
                where: { userId_courseId: { userId: order.userId, courseId } },
            });

            if (!existing) {
                await prisma.enrollment.create({
                    data: { userId: order.userId, courseId, progress: 0 },
                });
                console.log(`🎁 Seminario bonus: enrolled user ${order.userId} in course ${courseId}`);
            }
        }

        await sendSeminarioWelcomeEmail(order);
    } catch (error) {
        console.error('Error fulfilling seminario bundle:', error);
    }
}

async function sendSeminarioWelcomeEmail(order: OrderLike) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('SMTP credentials not configured. Seminario welcome email not sent.');
        return;
    }

    try {
        const bonusCourses = await prisma.course.findMany({
            where: { id: { in: SEMINARIO_BONUS_COURSE_IDS } },
            select: { title: true },
        });

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        const accountUrl = `${process.env.NEXTAUTH_URL || 'https://ivanivanovich.com'}/mi-cuenta`;
        const coursesList = [
            'Seminario Online en Vivo · Protección Ejecutiva',
            ...bonusCourses.map((c) => c.title),
        ]
            .map((t) => `<li style="margin-bottom:6px;">${t}</li>`)
            .join('');

        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Ivan Ivanovich Academy" <noreply@ivanivanovich.com>',
            to: order.billingEmail,
            subject: '🎟️ Tu acceso al Seminario + cursos de regalo · Ivan Ivanovich',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color:#333;">
                    <h1 style="color:#B70126;">¡Bienvenido al Seminario!</h1>
                    <p>Hola ${order.billingName || ''},</p>
                    <p>Tu compra fue confirmada y <strong>ya tienes acceso</strong> a estos cursos en línea:</p>
                    <ul style="background:#f9f9f9; padding:20px 20px 20px 40px; border-radius:8px;">
                        ${coursesList}
                    </ul>
                    <p>Ingresa con tu correo <strong>${order.billingEmail}</strong> y la contraseña que creaste al momento de la compra.</p>
                    <div style="text-align:center; margin:28px 0;">
                        <a href="${accountUrl}" style="background-color:#B70126; color:#fff; padding:12px 24px; text-decoration:none; border-radius:5px; font-weight:bold;">Ir a Mis Cursos</a>
                    </div>
                    <hr style="border:none; border-top:1px solid #eee; margin:28px 0;">
                    <h3 style="color:#128C7E;">Únete a nuestro grupo de WhatsApp</h3>
                    <p>Ahí recibirás los avisos del seminario en vivo, materiales y soporte directo.</p>
                    <div style="text-align:center; margin:20px 0;">
                        <a href="${SEMINARIO_WHATSAPP_GROUP_URL}" style="background-color:#25D366; color:#fff; padding:12px 24px; text-decoration:none; border-radius:5px; font-weight:bold;">Unirme al grupo de WhatsApp</a>
                    </div>
                    <p style="font-size:14px; color:#666;">Si tienes alguna pregunta, responde a este correo.</p>
                </div>
            `,
        });
        console.log(`✅ Seminario welcome email sent to ${order.billingEmail}`);
    } catch (error) {
        console.error('Error sending seminario welcome email:', error);
    }
}
