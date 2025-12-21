import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requestPairingCode } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'ADMIN') {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    try {
        const { phoneNumber } = await req.json();

        if (!phoneNumber) {
            return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
        }

        console.log('PAIRING: Requesting code for', phoneNumber);
        const code = await requestPairingCode(phoneNumber);

        return NextResponse.json({ success: true, code });
    } catch (error: any) {
        console.error('Pairing error:', error);
        return NextResponse.json({ error: error.message || 'Failed to get code' }, { status: 500 });
    }
}
