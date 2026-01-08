import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // Simple authorization check
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' }
        });

        const contacts = await prisma.whatsAppContact.findMany({
            orderBy: { lastMessageAt: 'desc' }
        });

        const students = await prisma.user.findMany({
            where: { role: 'STUDENT' },
            take: 5000,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { enrollments: true }
                }
            }
        });

        console.log(`[API] Database: Found ${students.length} students, ${leads.length} leads, ${contacts.length} contacts`);

        return NextResponse.json({ leads, contacts, students });
    } catch (error) {
        console.error('Error fetching database data:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
