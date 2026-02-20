'use server';

import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function setLanguage(lang: string) {
    const cookieStore = await cookies();
    cookieStore.set('NEXT_LOCALE', lang, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    // If user is logged in, update their language preference in the database
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
        await prisma.user.update({
            where: { email: session.user.email },
            data: { language: lang },
        });
    }
}
