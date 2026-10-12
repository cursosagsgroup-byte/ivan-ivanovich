'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Loader2, ArrowUpRight } from 'lucide-react';
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

    const inputClass = 'w-full border-b border-gray-300 bg-transparent px-0 py-3 text-[#16171a] placeholder:text-gray-400 focus:border-[#B70126] focus:outline-none disabled:opacity-50';
    const kickerClass = 'mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gray-400';

    return (
        <div className="bg-white min-h-screen">
            {/* Hero a sangre, mismo patrón que el resto de /educacion. */}
            <div className="relative w-full overflow-hidden bg-[#0B121F]">
                <Image
                    src="/course-hero-image.jpg"
                    alt=""
                    aria-hidden="true"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="subpage-hero relative z-10 mx-auto max-w-[1440px]">
                    <p className="subpage-hero-eyebrow">{t('courses.heroEyebrow')}</p>
                    <h1 className="text-6xl font-normal uppercase leading-none text-white lg:text-8xl" style={{ fontFamily: 'var(--font-bebas)' }}>
                        {t('book.heroTitle')}
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-100 sm:text-lg">{t('book.heroDescription')}</p>
                </div>
            </div>

            {/* La Nueva Doctrina: fondo blanco, portada + texto + CTA a Amazon. */}
            <div className="border-t border-gray-200 bg-white">
                <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
                    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em]">
                        <span className="flex gap-6">
                            <span className="text-gray-400">{t('home.bookBestsellerKicker')}</span>
                            <span className="text-[#16171a]">{t('home.book2Short')}</span>
                        </span>
                        <span className="text-gray-400">001</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="pb-10 lg:border-r lg:border-gray-200 lg:pb-0 lg:pr-12">
                            <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden bg-gray-100 lg:ml-auto">
                                <Image
                                    src="/libro-portada.jpg"
                                    alt={t('book.doctrinaTitle')}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 80vw, 30vw"
                                />
                            </div>
                        </div>

                        <div className="pt-10 lg:pl-12 lg:pt-0">
                            <h2
                                className="mb-6 max-w-xl text-3xl font-normal uppercase leading-none text-[#16171a] lg:text-5xl"
                                style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                            >
                                {t('book.doctrinaTitle')}
                            </h2>

                            <div className="max-w-lg space-y-4 text-base leading-relaxed text-gray-600 lg:text-[17px]">
                                <p>{t('book.doctrinaDescription1')}</p>
                                <p>{t('book.doctrinaDescription2')}</p>
                            </div>

                            <Link
                                href="https://www.amazon.com.mx/Protecci%C3%B3n-ejecutiva-siglo-XXI-doctrina-ebook/dp/B09MZ8BC9Q"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group mt-8 flex w-fit items-stretch"
                            >
                                <span className="bg-[#B70126] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors group-hover:bg-[#8f011e]">
                                    {t('book.getBook')}
                                </span>
                                <span className="ml-px flex items-center bg-[#B70126] px-4 text-white transition-colors group-hover:bg-[#8f011e]">
                                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sistema Timeline: fondo gris muy claro, portada + texto + formulario. */}
            <div className="border-t border-gray-200 bg-[#F4F4F3]">
                <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
                    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em]">
                        <span className="flex gap-6">
                            <span className="text-gray-400">{t('home.bookKicker')}</span>
                            <span className="text-[#16171a]">{t('home.course3Subtitle')}</span>
                        </span>
                        <span className="text-gray-400">002</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="pb-10 lg:border-r lg:border-gray-300 lg:pb-0 lg:pr-12">
                            <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden bg-white lg:ml-auto">
                                <Image
                                    src="/libro-timeline.png"
                                    alt={t('book.timelineTitle')}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 1024px) 80vw, 30vw"
                                />
                            </div>
                        </div>

                        <div className="pt-10 lg:pl-12 lg:pt-0">
                            <h2
                                className="mb-6 max-w-xl text-3xl font-normal uppercase leading-none text-[#16171a] lg:text-5xl"
                                style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                            >
                                {t('book.timelineTitle')}
                            </h2>

                            <div className="mb-8 max-w-lg space-y-4 text-base leading-relaxed text-gray-600 lg:text-[17px]">
                                <p>{t('book.timelineDescription1')}</p>
                                <p>{t('book.timelineDescription2')}</p>
                                <p>{t('book.timelineDescription3')}</p>
                            </div>

                            {/* Lead Capture Form */}
                            <div className="max-w-md">
                                {status === 'success' ? (
                                    <div className="border-t border-gray-300 pt-6">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#16171a]" />
                                            <div>
                                                <p className="text-base font-semibold text-[#16171a]">
                                                    {t('book.formSuccessTitle')}
                                                </p>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    {t('book.formSuccessBody')}
                                                </p>
                                                <a
                                                    href="/materials/proteccion-ejecutiva-sistema-timeline.pdf"
                                                    download="Proteccion-Ejecutiva-Sistema-Timeline.pdf"
                                                    className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.12em] text-[#B70126] hover:text-[#8f011e]"
                                                >
                                                    {t('book.formSuccessRetry')}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate={false}>
                                        <div>
                                            <label htmlFor="timeline-name" className={kickerClass}>
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
                                                className={inputClass}
                                                placeholder={t('book.formNamePlaceholder')}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="timeline-email" className={kickerClass}>
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
                                                className={inputClass}
                                                placeholder={t('book.formEmailPlaceholder')}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="timeline-country" className={kickerClass}>
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
                                                className={inputClass}
                                                placeholder={t('book.formCountryPlaceholder')}
                                            />
                                        </div>

                                        {error && (
                                            <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#B70126]">{error}</p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="group mt-2 flex w-fit items-stretch disabled:opacity-60"
                                        >
                                            <span className="flex items-center gap-2 bg-[#B70126] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors group-hover:bg-[#8f011e]">
                                                {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
                                                {status === 'loading' ? t('book.formSending') : t('book.downloadFree')}
                                            </span>
                                            <span className="ml-px flex items-center bg-[#B70126] px-4 text-white transition-colors group-hover:bg-[#8f011e]">
                                                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                            </span>
                                        </button>

                                        <p className="font-mono text-[11px] leading-relaxed text-gray-400">
                                            {t('book.formPrivacy')}
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
