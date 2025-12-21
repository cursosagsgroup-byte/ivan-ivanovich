'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('orderNumber');
    const { t } = useTranslation();

    return (
        <div className="bg-white min-h-screen pt-32 pb-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>

                <h1 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-bebas)' }}>
                    {t('checkout.successTitle')}
                </h1>

                <p className="text-xl text-slate-600 mb-8">
                    {t('checkout.successMessage')}
                </p>

                <div className="bg-slate-50 rounded-2xl p-8 mb-12 border border-slate-200">
                    <p className="text-sm text-slate-500 mb-2">{t('checkout.orderNumber')}</p>
                    <p className="text-2xl font-mono font-bold text-slate-900">{orderNumber}</p>
                    <p className="text-sm text-slate-500 mt-4">
                        {t('checkout.emailConfirmation')}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/mi-cuenta"
                        className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-[#D9012D] transition-colors"
                    >
                        {t('checkout.goToCourses')}
                        <ArrowRight className="w-5 h-5" />
                    </Link>

                    <Link
                        href="/educacion/cursos-online"
                        className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-300 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                    >
                        {t('checkout.keepShopping')}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
