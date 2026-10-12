'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

// Resalta en negrita las frases clave de un párrafo sin tocar el resto del texto.
function withBold(text: string, phrases: string[]) {
    if (phrases.length === 0) return text;
    const pattern = new RegExp(`(${phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
    return text.split(pattern).map((part, i) =>
        phrases.includes(part) ? <strong key={i} className="font-semibold text-[#16171a]">{part}</strong> : part
    );
}

const INTRO_BOLD_PHRASES: Record<string, string[]> = {
    es: ['sistema de protección discreto y eficaz', 'desactivación temprana de las amenazas', 'operación mucho más segura'],
    en: ['discreet and effective protection system', 'early threat deactivation', 'much safer operation'],
};

export default function CertificadoDETAPage() {
    const { t, language } = useTranslation();

    const benefits = [
        t('deta.benefit1'), t('deta.benefit2'), t('deta.benefit3'),
        t('deta.benefit4'), t('deta.benefit5'), t('deta.benefit6'),
        t('deta.benefit7'), t('deta.benefit8'), t('deta.benefit9'),
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Hero a sangre, mismo patrón que el resto de /educacion. */}
            <div className="relative w-full overflow-hidden bg-[#0B121F]">
                <Image
                    src="/certificado-deta.jpg"
                    alt=""
                    aria-hidden="true"
                    fill
                    className="object-cover object-[center_20%]"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="subpage-hero relative z-10 mx-auto max-w-[1440px]">
                    <p className="subpage-hero-eyebrow">{t('courses.heroEyebrow')}</p>
                    <h1 className="max-w-4xl text-5xl font-normal uppercase leading-[0.95] text-white lg:text-7xl" style={{ fontFamily: 'var(--font-bebas)' }}>
                        {t('deta.heroTitle')}
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-100 sm:text-lg">{t('deta.heroDescription')}</p>
                </div>
            </div>

            {/* Introducción + qué incluye la licencia: ancho completo,
                etiqueta monoespaciada, líneas divisorias. */}
            <div className="border-t border-gray-200 bg-white">
                <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="pb-10 lg:border-r lg:border-gray-200 lg:pb-0 lg:pr-12">
                            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-gray-400">
                                {t('deta.kicker')}
                            </p>
                            <p className="max-w-lg text-lg leading-relaxed text-gray-600 lg:text-xl">
                                {withBold(t('deta.intro'), INTRO_BOLD_PHRASES[language] || [])}
                            </p>
                        </div>

                        <div className="pt-10 lg:pl-12 lg:pt-0">
                            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-gray-400">
                                {t('deta.licenseTitle')}
                            </p>
                            <ul className="space-y-3">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-gray-600">
                                        <span className="mt-1 text-[#B70126]">—</span>
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contacto: mismo patrón que el resto del sitio, fondo negro, centrado. */}
            <div className="bg-[#0B121F] py-16 lg:py-20">
                <div className="mx-auto max-w-[1440px] px-4 text-center sm:px-6 lg:px-10">
                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
                        {t('nav.contact')}
                    </p>
                    <h2
                        className="mb-4 text-4xl font-normal uppercase leading-none text-white lg:text-6xl"
                        style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.02em' }}
                    >
                        {t('deta.contactTitle')}
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/60 lg:text-[17px]">
                        {t('deta.contactDescription')}
                    </p>
                    <a
                        href="mailto:academia@ivanivanovich.com"
                        className="inline-block text-2xl uppercase leading-tight text-white transition-colors hover:text-[#B70126] sm:text-3xl"
                        style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                    >
                        academia@ivanivanovich.com
                    </a>
                </div>
            </div>

            {/* Mis libros: mismo bloque conector que el resto del sitio, centrado. */}
            <div className="bg-white py-16 lg:py-20">
                <div className="mx-auto max-w-[1440px] px-4 text-center sm:px-6 lg:px-10">
                    <div className="mx-auto max-w-2xl">
                        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-gray-400">
                            {t('home.bookKicker')}
                        </p>
                        <h2
                            className="mb-4 text-3xl font-normal uppercase leading-none text-[#16171a] lg:text-5xl"
                            style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                        >
                            {t('book.timelineTitle')}
                        </h2>
                        <p className="mx-auto mb-6 max-w-lg text-base leading-relaxed text-gray-600 lg:text-[17px]">
                            {t('home.bookStatement')}
                        </p>
                        <Link href="/educacion/libro" className="group mx-auto flex w-fit items-stretch">
                            <span className="bg-[#B70126] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors group-hover:bg-[#8f011e]">
                                {t('home.downloadButton')}
                            </span>
                            <span className="ml-px flex items-center bg-[#B70126] px-4 text-white transition-colors group-hover:bg-[#8f011e]">
                                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
