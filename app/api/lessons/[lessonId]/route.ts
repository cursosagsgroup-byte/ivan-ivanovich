import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const { lessonId } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, content, videoUrl, order, duration } = body;

        const lesson = await prisma.lesson.update({
            where: { id: lessonId },
            data: {
                title,
                content,
                videoUrl,
                order,
                duration
            }
        });

        return NextResponse.json(lesson);
    } catch (error) {
        console.error('Error updating lesson:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const { lessonId } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.lesson.delete({
            where: { id: lessonId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting lesson:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
