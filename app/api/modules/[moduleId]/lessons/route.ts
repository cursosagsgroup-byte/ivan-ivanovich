import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ moduleId: string }> }
) {
    try {
        const { moduleId } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, content, videoUrl, order, duration } = body;

        const lesson = await prisma.lesson.create({
            data: {
                moduleId,
                title,
                content: content || '',
                videoUrl: videoUrl || null,
                order: order || 0,
                duration: duration || 0
            }
        });

        return NextResponse.json(lesson);
    } catch (error) {
        console.error('Error creating lesson:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ moduleId: string }> }
) {
    try {
        const { moduleId } = await params;
        const lessons = await prisma.lesson.findMany({
            where: { moduleId },
            orderBy: { order: 'asc' }
        });

        return NextResponse.json(lessons);
    } catch (error) {
        console.error('Error fetching lessons:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
