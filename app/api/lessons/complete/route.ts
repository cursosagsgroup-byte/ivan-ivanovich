import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { lessonId } = await request.json();

        if (!lessonId) {
            return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 });
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Mark lesson as completed (upsert to avoid duplicates)
        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: user.id,
                    lessonId: lessonId
                }
            },
            update: {
                completed: true,
                completedAt: new Date()
            },
            create: {
                userId: user.id,
                lessonId: lessonId,
                completed: true,
                completedAt: new Date()
            }
        });

        // Update enrollment progress
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                module: {
                    select: { courseId: true }
                }
            }
        });

        if (lesson) {
            // Get total lessons in course
            const totalLessons = await prisma.lesson.count({
                where: {
                    module: {
                        courseId: lesson.module.courseId
                    }
                }
            });

            // Get completed lessons for this user
            const completedLessons = await prisma.lessonProgress.count({
                where: {
                    userId: user.id,
                    completed: true,
                    lesson: {
                        module: {
                            courseId: lesson.module.courseId
                        }
                    }
                }
            });

            // Calculate progress percentage
            const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

            // Update enrollment
            await prisma.enrollment.update({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: lesson.module.courseId
                    }
                },
                data: {
                    progress: progress,
                    ...(progress === 100 ? { completedAt: new Date() } : {})
                }
            });

            return NextResponse.json({
                success: true,
                progress: progress,
                completedLessons: completedLessons,
                totalLessons: totalLessons
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error marking lesson complete:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
