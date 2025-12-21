import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { initWhatsApp } from '@/lib/whatsapp';
import fs from 'fs';
import path from 'path';

const AUTH_FOLDER = 'whatsapp_auth';

export async function POST(req: NextRequest) {
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'ADMIN') {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    try {
        // 1. Close socket if exists
        if (global.whatsappSocket) {
            global.whatsappSocket.end(undefined);
            global.whatsappSocket = undefined;
        }

        // 2. Delete Auth Folder
        const authPath = path.join(process.cwd(), AUTH_FOLDER);
        if (fs.existsSync(authPath)) {
            fs.rmSync(authPath, { recursive: true, force: true });
        }

        // 3. Restart Init (Clean)
        await initWhatsApp();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
