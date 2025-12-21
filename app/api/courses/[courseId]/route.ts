import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                modules: {
                    orderBy: { order: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' }
                        },
                        quizzes: {
                            orderBy: { order: 'asc' },
                            include: {
                                questions: {
                                    orderBy: { order: 'asc' }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, price, image, published } = body;

        const course = await prisma.course.update({
            where: { id: courseId },
            data: {
                title,
                description,
                price: parseFloat(price),
                image,
                published
            }
        });

        return NextResponse.json(course);
    } catch (error) {
        console.error('Error updating course:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.course.delete({
            where: { id: courseId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting course:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
