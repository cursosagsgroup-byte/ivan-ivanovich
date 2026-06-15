import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import {
    SEMINARIO_ONLINE_COURSE_ID,
    SEMINARIO_BONUS_COURSE_IDS,
    SEMINARIO_WHATSAPP_GROUP_URL,
} from '@/lib/course-constants';

type OrderItemLike = { courseId: string };
type OrderLike = {
    id: string;
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

        const baseUrl = process.env.NEXTAUTH_URL || 'https://ivanivanovich.com';
        const accountUrl = `${baseUrl}/mi-cuenta`;

        // Paleta y tipografías tomadas de la landing del seminario.
        const headFont = "'Saira Condensed','Arial Narrow',Arial,sans-serif";
        const bodyFont = "'Barlow',Arial,Helvetica,sans-serif";

        // --- Recibo de compra (datos reales de la orden) ---
        const fullOrder = await prisma.order.findUnique({
            where: { id: order.id },
            include: {
                items: { include: { course: { select: { title: true } } } },
                coupon: { select: { code: true } },
            },
        });

        let receiptSection = '';
        if (fullOrder) {
            const money = (n: number) =>
                '$' + Number(n || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const cur = fullOrder.currency || 'MXN';
            const base = fullOrder.items.reduce((s, it) => s + it.price, 0);
            const discount = fullOrder.discountTotal || 0;
            const total = fullOrder.total || 0;
            const taxes = Math.max(0, Math.round((total - (base - discount)) * 100) / 100);
            const orderDate = new Date(fullOrder.createdAt).toLocaleDateString('es-MX', {
                day: 'numeric', month: 'long', year: 'numeric',
            });
            const pmLabels: Record<string, string> = {
                free: 'Cupón promocional', stripe: 'Tarjeta (Stripe)', mercadopago: 'MercadoPago',
            };
            const pmLabel = pmLabels[fullOrder.paymentMethod || ''] || fullOrder.paymentMethod || '—';

            const rowStyle = `font-family:${bodyFont};font-size:14px;color:#5A4F4D;padding:7px 0;`;
            const itemRows = fullOrder.items
                .map(
                    (it) => `<tr>
                        <td style="${rowStyle}border-bottom:1px solid #ECE6E2;">${it.course.title}</td>
                        <td align="right" style="${rowStyle}border-bottom:1px solid #ECE6E2;white-space:nowrap;">${money(it.price)}</td>
                    </tr>`
                )
                .join('');
            const discountRow = discount > 0
                ? `<tr><td style="${rowStyle}color:#C2101A;">Descuento${fullOrder.coupon ? ` · ${fullOrder.coupon.code}` : ''}</td><td align="right" style="${rowStyle}color:#C2101A;white-space:nowrap;">-${money(discount)}</td></tr>`
                : '';
            const taxRow = taxes > 0.01
                ? `<tr><td style="${rowStyle}">IVA (16%)</td><td align="right" style="${rowStyle}white-space:nowrap;">${money(taxes)}</td></tr>`
                : '';

            receiptSection = `
        <tr><td style="padding:18px 30px 4px;">
          <p style="margin:0 0 10px;font-family:${headFont};font-style:italic;font-weight:800;text-transform:uppercase;color:#5C0A10;font-size:18px;letter-spacing:.5px;">Recibo de compra</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #ECE6E2;border-radius:10px;">
            <tr><td style="font-family:${bodyFont};font-size:12px;color:#8C8480;padding:14px 18px 10px;border-bottom:1px solid #ECE6E2;text-transform:uppercase;letter-spacing:1px;">Orden ${fullOrder.orderNumber} · ${orderDate}</td></tr>
            <tr><td style="padding:6px 18px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${itemRows}
                ${discountRow}
                ${taxRow}
                <tr>
                  <td style="font-family:${headFont};font-style:italic;font-weight:800;text-transform:uppercase;color:#17100F;font-size:17px;padding:11px 0 4px;">Total pagado</td>
                  <td align="right" style="font-family:${headFont};font-style:italic;font-weight:800;color:#C2101A;font-size:19px;padding:11px 0 4px;white-space:nowrap;">${money(total)} ${cur}</td>
                </tr>
            </table></td></tr>
            <tr><td style="font-family:${bodyFont};font-size:12px;color:#8C8480;padding:6px 18px 14px;">Método: ${pmLabel}${cur === 'MXN' ? ' · IVA incluido' : ''}</td></tr>
          </table>
        </td></tr>`;
        }

        const coursesList = [
            'Seminario Online en Vivo · Protección Ejecutiva',
            ...bonusCourses.map((c) => c.title),
        ]
            .map(
                (t, i, arr) => `
                <div style="font-family:${bodyFont};font-size:16px;font-weight:600;color:#17100F;padding:9px 0;${i < arr.length - 1 ? 'border-bottom:1px solid #ECE6E2;' : ''}">
                    <span style="display:inline-block;width:8px;height:8px;background:#E3A53A;border-radius:50%;margin-right:11px;vertical-align:middle;"></span>${t}
                </div>`
            )
            .join('');

        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Ivan Ivanovich Academy" <noreply@ivanivanovich.com>',
            to: order.billingEmail,
            subject: '🎟️ Tu acceso al Seminario · Ivan Ivanovich + Danny Leikin',
            html: `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:ital,wght@0,700;1,800&family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#faf9f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f5;">
    <tr><td align="center" style="padding:26px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 18px 50px -22px rgba(92,10,16,.4);">

        <tr><td align="center" style="padding:26px 24px 16px;background:#ffffff;">
          <img src="${baseUrl}/logo.png" alt="Ivan Ivanovich Executive Protection Academy" width="240" style="display:block;width:240px;max-width:72%;height:auto;">
        </td></tr>

        <tr><td style="font-size:0;line-height:0;">
          <img src="${baseUrl}/email/seminario-banner.jpg" alt="Seminario de Protección Ejecutiva" width="600" style="display:block;width:100%;height:auto;">
        </td></tr>

        <tr><td style="background:#5C0A10;padding:22px 30px;">
          <p style="margin:0;font-family:${bodyFont};color:#E3A53A;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Seminario Online en Vivo · 2026</p>
          <h1 style="margin:7px 0 0;font-family:${headFont};font-style:italic;font-weight:800;text-transform:uppercase;color:#ffffff;font-size:31px;line-height:1.04;">¡Bienvenido al Seminario!</h1>
        </td></tr>

        <tr><td style="padding:28px 30px 6px;font-family:${bodyFont};">
          <p style="margin:0 0 14px;font-size:16px;color:#5A4F4D;">Hola <strong style="color:#17100F;">${order.billingName || ''}</strong>,</p>
          <p style="margin:0;font-size:16px;color:#5A4F4D;">Tu compra fue confirmada. Estás a punto de vivir <strong style="color:#17100F;">la nueva doctrina de protección ejecutiva moderna</strong> junto a Ivan Ivanovich y Danny Leikin. <strong style="color:#17100F;">Ya tienes acceso</strong> a estos cursos en línea:</p>
        </td></tr>

        <tr><td style="padding:14px 30px 6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f5;border:1px solid #ECE6E2;border-left:5px solid #C2101A;border-radius:10px;">
            <tr><td style="padding:14px 22px;">${coursesList}</td></tr>
          </table>
        </td></tr>
${receiptSection}
        <tr><td style="padding:16px 30px 4px;font-family:${bodyFont};">
          <p style="margin:0;font-size:15px;color:#5A4F4D;">Ingresa con tu correo <strong style="color:#17100F;">${order.billingEmail}</strong> y la contraseña que creaste al momento de la compra.</p>
        </td></tr>

        <tr><td align="center" style="padding:22px 30px 26px;">
          <a href="${accountUrl}" style="display:inline-block;background:#C2101A;color:#ffffff;font-family:${headFont};font-style:italic;font-weight:800;text-transform:uppercase;letter-spacing:.5px;font-size:20px;text-decoration:none;padding:16px 40px;border-radius:7px;">Ir a Mis Cursos →</a>
        </td></tr>

        <tr><td style="padding:0 30px;"><div style="border-top:1px solid #ECE6E2;"></div></td></tr>

        <tr><td align="center" style="padding:26px 30px 4px;font-family:${bodyFont};">
          <h2 style="margin:0 0 6px;font-family:${headFont};font-style:italic;font-weight:800;text-transform:uppercase;color:#5C0A10;font-size:23px;">Únete al grupo de WhatsApp</h2>
          <p style="margin:0;font-size:15px;color:#5A4F4D;">Ahí recibirás los avisos del seminario en vivo, materiales y soporte directo.</p>
        </td></tr>

        <tr><td align="center" style="padding:16px 30px 30px;">
          <a href="${SEMINARIO_WHATSAPP_GROUP_URL}" style="display:inline-block;background:#25D366;color:#ffffff;font-family:${headFont};font-style:italic;font-weight:800;text-transform:uppercase;letter-spacing:.5px;font-size:18px;text-decoration:none;padding:15px 34px;border-radius:7px;">Unirme al grupo de WhatsApp</a>
        </td></tr>

        <tr><td style="background:#5C0A10;padding:22px 30px;text-align:center;font-family:${bodyFont};">
          <p style="margin:0 0 4px;color:#E3A53A;font-size:13px;letter-spacing:1px;text-transform:uppercase;font-weight:700;">Ivan Ivanovich · Executive Protection Academy</p>
          <p style="margin:0;color:#C9BFB9;font-size:12px;">Si tienes alguna pregunta, responde a este correo.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
            `,
        });
        console.log(`✅ Seminario welcome email sent to ${order.billingEmail}`);
    } catch (error) {
        console.error('Error sending seminario welcome email:', error);
    }
}
