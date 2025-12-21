import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getQR, initWhatsApp, isConnected } from '@/lib/whatsapp';

export async function GET(req: NextRequest) {
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'ADMIN') {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Attempt to initialize if not running
    if (!isConnected()) {
        try {
            await initWhatsApp();
        } catch (e) {
            console.error('Failed to init WA', e);
        }
    }

    return NextResponse.json({
        qr: getQR(),
        connected: isConnected()
    });
}
