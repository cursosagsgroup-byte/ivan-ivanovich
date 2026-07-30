'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function LibroPage() {
    const { t, language } = useTranslation();
    const [form, setForm] = useState({ name: '', email: '', country: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (status === 'loading') return;

        setStatus('loading');
        setError('');

        try {
            const res = await fetch('/api/book-download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, lang: language }),
            });

            const data = await res.json();
            if (!res.ok || !data.downloadUrl) {
                throw new Error(data.error || 'Request failed');
            }

            // Descarga inmediata: el navegador guarda el PDF sin abandonar la página.
            const link = document.createElement('a');
            link.href = data.downloadUrl;
            link.download = 'Proteccion-Ejecutiva-Sistema-Timeline.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setStatus('success');
        } catch {
            setStatus('idle');
            setError(t('book.formError'));
        }
    };

    return (
        <div className="bg-white min-h-screen pt-24">
            {/* Hero Section */}
            <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-[95%]">
                <div className="relative rounded-[30px] overflow-hidden bg-[#0B121F] isolate shadow-2xl min-h-[500px] lg:h-[38vh] lg:min-h-[350px] flex items-center py-8 lg:py-0">
                    <div className="absolute inset-0 -z-10 opacity-40">
                        <Image
                            src="/course-hero-bg.png"
                            alt="Background"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="w-full px-6 lg:px-12 relative z-10">
                        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 items-center">
                            {/* Left Column: Title */}
                            <div className="text-center lg:text-left">
                                <h1 className="text-6xl lg:text-8xl font-normal text-white uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {t('book.heroTitle')}
                                </h1>
                            </div>

                            {/* Right Column: Both Books Side by Side */}
                            <div className="flex justify-center items-center gap-4 lg:gap-6 mt-6 lg:mt-0 w-full">
                                {/* Libro Doctrina */}
                                <div className="relative w-[45%] lg:w-auto lg:h-[28vh] aspect-[3/4] rounded-lg overflow-hidden shadow-2xl">
                                    <img
                                        src="/libro-doctrina-hero.jpg"
                                        alt="Protección Ejecutiva en el Siglo XXI"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Libro Timeline */}
                                <div className="relative w-[45%] lg:w-auto lg:h-[28vh] aspect-[3/4] rounded-lg overflow-hidden shadow-2xl">
                                    <img
                                        src="/libro-timeline-hero.png"
                                        alt="Sistema Timeline"
                                        className="w-full h-full object-cover bg-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container - 80% width */}
            <div className="mx-auto w-[95%] lg:w-[80%]">
                {/* Main Content Section */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            {/* Left: Book Cover */}
                            <div className="relative w-full max-w-md mx-auto">
                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-2xl">
                                    <img
                                        src="/libro-portada.jpg"
                                        alt="Protección Ejecutiva en el Siglo XXI: La Nueva Doctrina"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Right: Content */}
                            <div className="space-y-8">
                                <div>
                                    <h1 className="text-5xl font-bold text-black uppercase mb-6 leading-tight" style={{ fontFamily: 'var(--font-bebas)' }}>
                                        {t('book.doctrinaTitle')}
                                    </h1>

                                    <div className="space-y-4 text-gray-700 text-base leading-relaxed">
                                        <p>
                                            {t('book.doctrinaDescription1')}
                                        </p>
                                        <p>
                                            {t('book.doctrinaDescription2')}
                                        </p>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <div>
                                    <Link
                                        href="https://www.amazon.com.mx/Protecci%C3%B3n-ejecutiva-siglo-XXI-doctrina-ebook/dp/B09MZ8BC9Q"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block rounded-full bg-[#B70126] px-10 py-4 text-base font-bold uppercase text-white hover:bg-[#D9012D] transition-colors shadow-lg"
                                    >
                                        {t('book.getBook')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sistema Timeline Book Section */}
                <section className="py-16 border-t border-gray-200">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            {/* Left: Book Cover */}
                            <div className="relative w-full max-w-md mx-auto">
                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-2xl">
                                    <img
                                        src="/libro-timeline.png"
                                        alt="Protección Ejecutiva Sistema Timeline"
                                        className="w-full h-full object-contain bg-white"
                                    />
                                </div>
                            </div>

                            {/* Right: Content */}
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-5xl font-bold text-black uppercase mb-6 leading-tight" style={{ fontFamily: 'var(--font-bebas)' }}>
                                        {t('book.timelineTitle')}
                                    </h2>

                                    <div className="space-y-4 text-gray-700 text-base leading-relaxed">
                                        <p>
                                            {t('book.timelineDescription1')}
                                        </p>
                                        <p>
                                            {t('book.timelineDescription2')}
                                        </p>
                                        <p>
                                            {t('book.timelineDescription3')}
                                        </p>
                                    </div>
                                </div>

                                {/* Lead Capture Form */}
                                <div>
                                    {status === 'success' ? (
                                        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
                                            <CheckCircle className="mx-auto mb-3 h-10 w-10 text-green-600" />
                                            <p className="text-lg font-bold text-green-900">
                                                {t('book.formSuccessTitle')}
                                            </p>
                                            <p className="mt-1 text-sm text-green-800">
                                                {t('book.formSuccessBody')}
                                            </p>
                                            <a
                                                href="/materials/proteccion-ejecutiva-sistema-timeline.pdf"
                                                download="Proteccion-Ejecutiva-Sistema-Timeline.pdf"
                                                className="mt-4 inline-block text-sm font-bold uppercase text-[#B70126] underline hover:text-[#D9012D]"
                                            >
                                                {t('book.formSuccessRetry')}
                                            </a>
                                        </div>
                                    ) : (
                                        <form className="space-y-4" onSubmit={handleSubmit} noValidate={false}>
                                            <div>
                                                <label htmlFor="timeline-name" className="block text-sm font-medium text-gray-700 mb-2">
                                                    {t('book.formName')} {t('book.required')}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="timeline-name"
                                                    name="name"
                                                    required
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    disabled={status === 'loading'}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B70126] focus:border-transparent disabled:bg-gray-100"
                                                    placeholder={t('book.formNamePlaceholder')}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="timeline-email" className="block text-sm font-medium text-gray-700 mb-2">
                                                    {t('book.formEmail')} {t('book.required')}
                                                </label>
                                                <input
                                                    type="email"
                                                    id="timeline-email"
                                                    name="email"
                                                    required
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    disabled={status === 'loading'}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B70126] focus:border-transparent disabled:bg-gray-100"
                                                    placeholder={t('book.formEmailPlaceholder')}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="timeline-country" className="block text-sm font-medium text-gray-700 mb-2">
                                                    {t('book.formCountry')} {t('book.required')}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="timeline-country"
                                                    name="country"
                                                    required
                                                    value={form.country}
                                                    onChange={handleChange}
                                                    disabled={status === 'loading'}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B70126] focus:border-transparent disabled:bg-gray-100"
                                                    placeholder={t('book.formCountryPlaceholder')}
                                                />
                                            </div>

                                            {error && (
                                                <p className="text-sm font-medium text-[#B70126]">{error}</p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={status === 'loading'}
                                                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#B70126] px-10 py-4 text-base font-bold uppercase text-white hover:bg-[#D9012D] transition-colors shadow-lg disabled:opacity-70"
                                            >
                                                {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
                                                {status === 'loading' ? t('book.formSending') : t('book.downloadFree')}
                                            </button>

                                            <p className="text-xs text-gray-500 text-center">
                                                {t('book.formPrivacy')}
                                            </p>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
