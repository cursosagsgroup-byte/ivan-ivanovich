import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, phone, message } = body;

        if (!name || !email) {
            return NextResponse.json(
                { error: 'Name and email are required' },
                { status: 400 }
            );
        }

        const lead = await prisma.lead.create({
            data: {
                name,
                email,
                phone: phone || '',
                message: message || '',
                source: 'Website Contact Form'
            }
        });

        return NextResponse.json({ success: true, lead });
    } catch (error) {
        console.error('Error creating lead:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
