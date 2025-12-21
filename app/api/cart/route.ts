import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch user's cart
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                cart: {
                    include: {
                        items: {
                            include: {
                                course: {
                                    select: {
                                        id: true,
                                        title: true,
                                        price: true,
                                        image: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const items = user.cart?.items.map(item => ({
            id: item.id,
            courseId: item.courseId,
            title: item.course.title,
            price: item.course.price,
            image: item.course.image,
        })) || [];

        return NextResponse.json({ items });
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Add item to cart
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { courseId } = await req.json();

        if (!courseId) {
            return NextResponse.json({ error: 'Course ID required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if already enrolled
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId,
                }
            }
        });

        if (enrollment) {
            return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 });
        }

        // Get or create cart
        let cart = await prisma.cart.findUnique({
            where: { userId: user.id }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: user.id }
            });
        }

        // Check if already in cart
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_courseId: {
                    cartId: cart.id,
                    courseId: courseId,
                }
            }
        });

        if (existingItem) {
            return NextResponse.json({ error: 'Course already in cart' }, { status: 400 });
        }

        // Add to cart
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                courseId: courseId,
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Clear cart
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await prisma.cartItem.deleteMany({
            where: {
                cart: {
                    userId: user.id
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error clearing cart:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
