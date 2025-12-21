import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const courses = await prisma.course.findMany({
            select: {
                id: true,
                title: true
            },
            orderBy: {
                title: 'asc'
            }
        });

        return NextResponse.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
