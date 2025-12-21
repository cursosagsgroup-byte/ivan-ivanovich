'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

export default function RegisterPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/login');
    }, [router]);

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="text-center">
                <p className="text-gray-500">Redirecting to login...</p>
            </div>
        </div>
    );
}
