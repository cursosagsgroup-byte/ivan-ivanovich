import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { quizId, score, passed, answers } = await request.json();

        if (!quizId || score === undefined || passed === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Save quiz attempt
        await prisma.quizAttempt.create({
            data: {
                userId: user.id,
                quizId: quizId,
                score: score,
                passed: passed,
                answers: JSON.stringify(answers || {})
            }
        });

        console.log(`✅ Quiz attempt saved: ${quizId}, Score: ${score}%, Passed: ${passed}`);

        return NextResponse.json({
            success: true,
            score: score,
            passed: passed
        });

    } catch (error) {
        console.error('Error saving quiz attempt:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
