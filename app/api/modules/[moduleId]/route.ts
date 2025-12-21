import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
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
        const { title, description, order } = body;

        const module = await prisma.module.update({
            where: { id: moduleId },
            data: {
                title,
                description,
                order
            }
        });

        return NextResponse.json(module);
    } catch (error) {
        console.error('Error updating module:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ moduleId: string }> }
) {
    try {
        const { moduleId } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.module.delete({
            where: { id: moduleId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting module:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
