import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId') || 'cmio13v7r000064w1fs838sgw';

    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            modules: {
                orderBy: { order: 'asc' },
                include: {
                    lessons: {
                        orderBy: { order: 'asc' }
                    }
                }
            }
        }
    });

    if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({
        courseId: course.id,
        title: course.title,
        moduleCount: course.modules.length,
        modules: course.modules.map(m => ({
            id: m.id,
            title: m.title,
            lessons: m.lessons.map(l => ({
                id: l.id,
                title: l.title,
                videoUrl: l.videoUrl,
                hasVideo: !!l.videoUrl
            }))
        }))
    });
}
