import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Assuming authOptions is exported from here
import { randomBytes } from 'crypto';
import { hash } from 'bcryptjs';
import nodemailer from 'nodemailer';

async function sendOrderConfirmation(order: any, items: any[]) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('SMTP credentials not configured. Order confirmation email not sent.');
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const itemsHtml = items.map(item => `
            <div style="padding: 10px; border-bottom: 1px solid #eee;">
                <p><strong>Curso:</strong> ${item.course.title}</p>
                <p><strong>Precio:</strong> $${item.price.toFixed(2)}</p>
            </div>
        `).join('');

        const mailOptions = {
            from: process.env.SMTP_FROM || '"Ivan Ivanovich Academy" <noreply@ivanivanovich.com>',
            to: order.billingEmail,
            subject: `Confirmación de Orden #${order.orderNumber} - Ivan Ivanovich Academy`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #333;">¡Gracias por tu compra!</h1>
                    <p>Hola ${order.billingName},</p>
                    <p>Tu orden ha sido confirmada exitosamente.</p>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Detalles de la Orden</h3>
                        <p><strong>Número de Orden:</strong> ${order.orderNumber}</p>
                        <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
                        <p><strong>Total Pagado:</strong> $${order.total.toFixed(2)}</p>
                    </div>

                    <h3>Productos:</h3>
                    ${itemsHtml}

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.NEXTAUTH_URL}/student" style="background-color: #B70126; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ir a Mis Cursos</a>
                    </div>

                    <p style="font-size: 14px; color: #666;">Si tienes alguna pregunta, por favor contáctanos respondiendo a este correo.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Order confirmation email sent to ${order.billingEmail}`);

    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { items, billingDetails, couponCode } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in order' }, { status: 400 });
        }

        let userId = session?.user?.id;
        const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret-do-not-use-in-prod';
        const { verificationToken, password } = body;

        // If no user logged in, create one or find existing
        if (!userId) {
            const { email, firstName, lastName } = billingDetails;
            const { country, phone, age } = body;
            const name = `${firstName} ${lastName}`.trim();

            // Check if user exists
            let user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                // VERIFY TOKEN BEFORE CREATING USER (skip for mock token)
                if (!verificationToken) {
                    return NextResponse.json({ error: 'Email verification required' }, { status: 400 });
                }

                // Skip validation for mock token (simplified checkout)
                if (verificationToken !== 'no-verification-required') {
                    try {
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        const jwt = require('jsonwebtoken');
                        const decoded = jwt.verify(verificationToken, secret) as any;

                        if (decoded.email !== email || !decoded.verified) {
                            return NextResponse.json({ error: 'Invalid verification token' }, { status: 400 });
                        }
                    } catch (err) {
                        return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 400 });
                    }
                }

                // Create new user with PROVIDED password
                if (!password) {
                    return NextResponse.json({ error: 'Password is required' }, { status: 400 });
                }

                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const { hash } = require('bcryptjs');
                const hashedPassword = await hash(password, 10);

                user = await prisma.user.create({
                    data: {
                        email,
                        name,
                        password: hashedPassword,
                        role: 'STUDENT',
                        emailVerified: new Date(), // Mark as verified since they used OTP
                        country,
                        phone,
                        age
                    },
                });
            }

            userId = user.id;
        }

        // Calculate total and validate items
        let total = 0;
        const orderItemsData = [];
        const emailItems: any[] = [];

        for (const item of items) {
            const course = await prisma.course.findUnique({
                where: { id: item.courseId },
            });

            if (!course) {
                return NextResponse.json({ error: `Course not found: ${item.courseId}` }, { status: 400 });
            }

            total += course.price;
            orderItemsData.push({
                courseId: course.id,
                price: course.price,
            });
            emailItems.push({ course, price: course.price });
        }

        // Validate and apply coupon if provided
        let discount = 0;
        let couponId: string | null = null;

        if (couponCode) {
            const coupon = await prisma.coupon.findUnique({
                where: { code: couponCode },
                include: { course: true }
            });

            if (coupon && coupon.isActive &&
                (!coupon.expiresAt || new Date() < coupon.expiresAt) &&
                (!coupon.maxUses || coupon.usedCount < coupon.maxUses)) {

                // 1. Check Max Uses Per User
                let userLimitReached = false;
                if (coupon.maxUsesPerUser) {
                    let usageCount = 0;
                    if (userId) {
                        usageCount = await prisma.order.count({
                            where: {
                                userId,
                                couponId: coupon.id,
                                status: 'completed'
                            }
                        });
                    } else {
                        usageCount = await prisma.order.count({
                            where: {
                                billingEmail: billingDetails.email,
                                couponId: coupon.id,
                                status: 'completed'
                            }
                        });
                    }

                    if (usageCount >= coupon.maxUsesPerUser) {
                        userLimitReached = true;
                    }
                }

                if (!userLimitReached) {
                    // 2. Calculate Discount
                    if (coupon.courseId) {
                        // Course-specific coupon
                        const courseInOrder = orderItemsData.find(item => item.courseId === coupon.courseId);
                        if (courseInOrder) {
                            couponId = coupon.id;
                            if (coupon.discountType === 'PERCENTAGE') {
                                discount = (courseInOrder.price * coupon.discountValue) / 100;
                            } else {
                                discount = coupon.discountValue;
                                if (discount > courseInOrder.price) discount = courseInOrder.price;
                            }
                        }
                    } else {
                        // Global coupon
                        couponId = coupon.id;
                        if (coupon.discountType === 'PERCENTAGE') {
                            discount = (total * coupon.discountValue) / 100;
                        } else {
                            discount = coupon.discountValue;
                        }
                    }
                }
            }
        }

        if (discount > total) discount = total;

        const finalTotal = total - discount;

        // Create Order
        const isFreeOrder = finalTotal <= 0;
        const orderNumber = `ORD-${Date.now()}-${randomBytes(4).toString('hex').toUpperCase()}`;

        const order = await prisma.order.create({
            data: {
                userId,
                orderNumber,
                total: finalTotal,
                status: isFreeOrder ? 'completed' : 'pending',
                paymentMethod: isFreeOrder ? 'free' : 'stripe',
                billingName: `${billingDetails.firstName} ${billingDetails.lastName}`,
                billingEmail: billingDetails.email,
                couponId,
                discountTotal: discount,
                items: {
                    create: orderItemsData,
                },
            },
            include: { items: true } // Include items for enrollment logic
        });

        // If order is free, enroll user immediately
        if (isFreeOrder) {
            for (const item of order.items) {
                const existingEnrollment = await prisma.enrollment.findUnique({
                    where: {
                        userId_courseId: {
                            userId: order.userId,
                            courseId: item.courseId,
                        },
                    },
                });

                if (!existingEnrollment) {
                    await prisma.enrollment.create({
                        data: {
                            userId: order.userId,
                            courseId: item.courseId,
                            progress: 0,
                        },
                    });
                }
            }

            // Send confirmation email for free orders
            await sendOrderConfirmation(order, emailItems);
        }

        return NextResponse.json({
            orderId: order.id,
            orderNumber: order.orderNumber,
            freeOrder: isFreeOrder
        });

    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
