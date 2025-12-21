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
        const { title, description, passingScore, timeLimit, order } = body;

        const quiz = await prisma.quiz.create({
            data: {
                moduleId,
                title,
                description: description || '',
                passingScore: passingScore || 70,
                timeLimit: timeLimit || 0,
                order: order || 0
            }
        });

        return NextResponse.json(quiz);
    } catch (error) {
        console.error('Error creating quiz:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ moduleId: string }> }
) {
    try {
        const { moduleId } = await params;
        const quizzes = await prisma.quiz.findMany({
            where: { moduleId },
            orderBy: { order: 'asc' },
            include: {
                questions: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        return NextResponse.json(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
