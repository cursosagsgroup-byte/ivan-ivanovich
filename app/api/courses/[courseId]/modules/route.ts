import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
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
        const { title, description, order } = body;

        const module = await prisma.module.create({
            data: {
                courseId,
                title,
                description: description || '',
                order: order || 0
            }
        });

        return NextResponse.json(module);
    } catch (error) {
        console.error('Error creating module:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await params;
        const modules = await prisma.module.findMany({
            where: { courseId },
            orderBy: { order: 'asc' },
            include: {
                lessons: {
                    orderBy: { order: 'asc' }
                },
                quizzes: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        return NextResponse.json(modules);
    } catch (error) {
        console.error('Error fetching modules:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
