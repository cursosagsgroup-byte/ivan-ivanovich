import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/quizzes/[quizId] - Get quiz with questions
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ quizId: string }> }
) {
    try {
        const { quizId } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                questions: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!quiz) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        // Parse options for each question if they are stored as JSON string
        const formattedQuiz = {
            ...quiz,
            questions: quiz.questions.map(q => ({
                ...q,
                options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
            }))
        };

        return NextResponse.json(formattedQuiz);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ quizId: string }> }
) {
    try {
        const { quizId } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, passingScore, timeLimit, order, questions } = body;

        // Update quiz
        const quiz = await prisma.quiz.update({
            where: { id: quizId },
            data: {
                title,
                description,
                passingScore,
                timeLimit,
                order
            }
        });

        // If questions are provided, delete old ones and create new ones
        if (questions) {
            await prisma.question.deleteMany({
                where: { quizId: quizId }
            });

            for (const question of questions) {
                await prisma.question.create({
                    data: {
                        quizId: quizId,
                        question: question.question,
                        type: question.type,
                        options: JSON.stringify(question.options),
                        correctAnswer: question.correctAnswer,
                        points: question.points || 1,
                        order: question.order || 0
                    }
                });
            }
        }

        // Return updated quiz with questions
        const updatedQuiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                questions: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        return NextResponse.json(updatedQuiz);
    } catch (error) {
        console.error('Error updating quiz:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ quizId: string }> }
) {
    try {
        const { quizId } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.quiz.delete({
            where: { id: quizId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
