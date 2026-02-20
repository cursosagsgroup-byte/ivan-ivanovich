import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ quizId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { quizId } = await params;

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get the most recent attempt for this quiz
        const attempt = await prisma.quizAttempt.findFirst({
            where: {
                userId: user.id,
                quizId: quizId
            },
            orderBy: {
                attemptedAt: 'desc'
            }
        });

        if (!attempt) {
            return NextResponse.json({ attempt: null });
        }

        return NextResponse.json({
            attempt: {
                id: attempt.id,
                score: attempt.score,
                passed: attempt.passed,
                answers: attempt.answers ? JSON.parse(attempt.answers) : {},
                attemptedAt: attempt.attemptedAt
            }
        });

    } catch (error) {
        console.error('Error fetching quiz attempt:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
