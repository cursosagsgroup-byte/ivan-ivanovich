'use client';

import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

const COURSES = ['inPersonCourses.course1', 'inPersonCourses.course2'];

export default function CursosPresencialesPage() {
    const { t } = useTranslation();

    return (
        <div className="bg-white min-h-screen">
            {/* Hero a sangre, mismo patrón que cursos-online: la foto cubre
                todo el fondo y una capa negra la oscurece lo justo. */}
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
                        {t('inPersonCourses.heroTitle')}
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-100 sm:text-lg">{t('inPersonCourses.heroDescription')}</p>
                </div>
            </div>

            {/* Cursos presenciales: mismo patrón editorial que el resto del
                sitio — ancho completo, etiqueta monoespaciada, líneas
                divisorias, teoría/práctica/costos en columnas. El segundo
                curso lleva un fondo gris muy claro para diferenciarlo. */}
            <div>
                {COURSES.map((key, i) => (
                    <div key={key} className={`border-t border-gray-200 ${i === 1 ? 'bg-[#F4F4F3]' : 'bg-white'}`}>
                        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
                            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em]">
                                <span className="flex gap-6">
                                    <span className="text-gray-400">{t('home.courseKicker')}</span>
                                    <span className="text-[#16171a]">{t(`${key}.subtitle`)}</span>
                                </span>
                                <span className="text-gray-400">{String(i + 1).padStart(3, '0')}</span>
                            </div>

                            <h2
                                className="mb-10 max-w-3xl text-4xl font-normal uppercase leading-none text-[#16171a] lg:text-6xl"
                                style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                            >
                                {t(`${key}.title`)}
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="pb-10 lg:pb-0 lg:pr-12">
                                    <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-gray-400">
                                        {t(`${key}.theoryTitle`)}
                                    </p>
                                    <ul className="space-y-3">
                                        {(t(`${key}.theoryItems`) as unknown as string[]).map((item, index) => (
                                            <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-gray-600">
                                                <span className="mt-1 text-[#B70126]">—</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-[#0B121F] p-6 sm:p-8 lg:p-12">
                                    <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
                                        {t(`${key}.practiceTitle`)}
                                    </p>
                                    <ul className="space-y-3">
                                        {(t(`${key}.practiceItems`) as unknown as string[]).map((item, index) => (
                                            <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-white/70">
                                                <span className="mt-1 text-[#B70126]">—</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-10 border-t border-white/15 pt-6">
                                        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
                                            {t(`${key}.costTitle`)}
                                        </p>
                                        <p
                                            className="text-3xl font-normal uppercase leading-none text-white lg:text-4xl"
                                            style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                                        >
                                            {t(`${key}.cost`)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Contacto: mismo patrón que el resto del sitio, fondo negro. */}
            <div className="bg-[#0B121F] py-16 lg:py-20">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
                        {t('nav.contact')}
                    </p>
                    <h2
                        className="mb-4 text-4xl font-normal uppercase leading-none text-white lg:text-6xl"
                        style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.02em' }}
                    >
                        {t('contact.title')}
                    </h2>
                    <p className="mb-8 max-w-xl text-base leading-relaxed text-white/60 lg:text-[17px]">
                        {t('contact.subtitle')}
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
        </div>
    );
}
