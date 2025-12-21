import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const admin = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (admin?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const { target, courseId, subject, message } = body;

        if (!subject || !message) {
            return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
        }

        // 1. Fetch Recipients
        let recipients: string[] = [];

        if (target === 'all') {
            const users = await prisma.user.findMany({
                where: { role: 'STUDENT' }, // Don't spam other admins? Or maybe send to everyone? Let's stick to students.
                select: { email: true }
            });
            recipients = users.map(u => u.email).filter(Boolean) as string[];
        } else if (target === 'course' && courseId) {
            const enrollments = await prisma.enrollment.findMany({
                where: { courseId },
                include: { user: true }
            });
            recipients = enrollments.map(e => e.user.email).filter(Boolean) as string[];
        } else if (target === 'leads') {
            const leads = await prisma.lead.findMany({
                select: { email: true }
            });
            recipients = leads.map(l => l.email).filter(Boolean) as string[];
        }

        if (recipients.length === 0) {
            return NextResponse.json({ error: 'No recipients found for selection' }, { status: 404 });
        }

        // 2. Configure Transporter (Reuse existing env vars)
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'mail.privateemail.com',
            port: parseInt(process.env.SMTP_PORT || '465'),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // 3. Send Emails (Batching desirable but simple loop for now provided N < 100)
        // For production with many users, this should be offloaded to a queue.
        // We will send individually to hide other recipients (BCC style or individual send).
        // Individual send is safer for deliverability but slower.

        let successCount = 0;
        let failCount = 0;

        // Using Promise.all mostly for speed, but be careful with rate limits. 
        // Banahosting limits might apply. Let's do chunks of 5.
        const chunkSize = 5;
        for (let i = 0; i < recipients.length; i += chunkSize) {
            const chunk = recipients.slice(i, i + chunkSize);
            await Promise.all(chunk.map(async (email) => {
                try {
                    await transporter.sendMail({
                        from: process.env.SMTP_FROM || '"Ivan Codigo" <noreply@ivancodigo.com>',
                        to: email,
                        subject: subject,
                        html: `
<div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background-color: #0F172A; padding: 24px; text-align: center;">
             <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Keting Media</h1>
        </div>

        <!-- Body -->
        <div style="padding: 32px; color: #334155; line-height: 1.6;">
            ${message}
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f5f9; padding: 24px; text-align: center; color: #64748B; font-size: 12px;">
            <p style="margin: 0 0 8px 0;">© ${new Date().getFullYear()} Keting Media. Todos los derechos reservados.</p>
            <p style="margin: 0;">Este correo fue enviado automáticamente por la plataforma educativa.</p>
        </div>
    </div>
</div>
                            `,
                    });
                    successCount++;
                } catch (error) {
                    console.error(`Failed to send to ${email}`, error);
                    failCount++;
                }
            }));
        }

        return NextResponse.json({
            success: true,
            total: recipients.length,
            sent: successCount,
            failed: failCount
        });

    } catch (error) {
        console.error('Error sending mass email:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
