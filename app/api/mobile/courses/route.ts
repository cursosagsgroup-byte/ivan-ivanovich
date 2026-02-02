
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'super-secret-fallback-key';

// Helper to verify JWT from header
async function verifyMobileToken(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (e) {
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        const payload = await verifyMobileToken(req);
        if (!payload || !payload.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userEmail = payload.email as string;

        // Fetch user enrollments
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            include: {
                enrollments: {
                    include: {
                        course: {
                            include: {
                                modules: {
                                    include: {
                                        lessons: {
                                            orderBy: { order: 'asc' },
                                            include: {
                                                progress: {
                                                    where: { userId: payload.id as string }
                                                }
                                            }
                                        }
                                    },
                                    orderBy: { order: 'asc' }
                                }
                            }
                        }
                    },
                    orderBy: { enrolledAt: 'desc' }
                },
                certificates: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Transform data for mobile
        const courses = user.enrollments.map(enrollment => {
            const course = enrollment.course;

            // Calculate detailed progress/structure
            const modules = course.modules.map(mod => ({
                id: mod.id,
                title: mod.title,
                order: mod.order,
                lessons: mod.lessons.map(lesson => ({
                    id: lesson.id,
                    title: lesson.title,
                    description: lesson.content,
                    videoUrl: lesson.videoUrl, // Mobile needs vimeo url directly potentially or iframe
                    duration: lesson.duration,
                    isCompleted: lesson.progress.length > 0 && lesson.progress[0].completed,
                    order: lesson.order,
                    type: 'video' // Simplify for now
                }))
            }));

            // Find certificate for this course
            const certificate = user.certificates.find((c: any) => c.courseId === course.id);

            return {
                id: course.id,
                title: course.title,
                description: course.description,
                imageUrl: course.image,
                progress: enrollment.progress,
                isCompleted: enrollment.progress === 100,
                certificateUrl: certificate ? certificate.certificateUrl : null,
                modules: modules
            };
        });

        return NextResponse.json({ courses });

    } catch (error) {
        console.error('Mobile courses error:', error);
        return NextResponse.json({ error: 'server_error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
