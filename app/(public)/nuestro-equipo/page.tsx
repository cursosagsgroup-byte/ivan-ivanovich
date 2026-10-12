'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function NuestroEquipoPage() {
    const { t } = useTranslation();

    return (
        <div className="bg-white min-h-screen">
            {/* Hero: mismo patrón que el blog — la foto de Iván cubre todo
                el fondo y un degradado oscuro por la izquierda asienta el
                título. Otra foto distinta a la del blog. */}
            <div className="relative w-full overflow-hidden bg-[#0B121F]">
                <Image
                    src="/hero-ivan-instructor.webp"
                    alt="Ivan Ivanovich impartiendo clase"
                    fill
                    className="object-cover object-[65%_15%]"
                    priority
                    quality={90}
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B121F] from-5% via-[#0B121F]/70 via-35% to-transparent" />
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0B121F]/80 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

                <div className="subpage-hero relative z-10 mx-auto max-w-[1440px]">
                    <div>
                        <p className="subpage-hero-eyebrow">{t('courses.heroEyebrow')}</p>
                        <h1 className="text-6xl lg:text-8xl font-normal text-white uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
                            {t('team.title')}
                        </h1>
                        <p className="mt-4 max-w-md text-base leading-relaxed text-white/70 lg:text-lg">
                            {t('team.heroSubtitle')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Ivan Ivanovich: mismo patrón editorial que el inicio —
                etiqueta monoespaciada, líneas divisorias, ancho completo,
                foto cuadrada a un lado y el texto al otro. */}
            <div className="bg-white py-16 lg:py-20">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
                    <div className="grid grid-cols-1 border-t border-gray-200 lg:grid-cols-2">
                        <div className="flex flex-col px-0 pb-10 pt-5 lg:border-r lg:border-gray-200 lg:pb-12 lg:pr-12 lg:pt-6">
                            <div className="mb-5 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.14em]">
                                <span className="flex gap-6">
                                    <span className="text-gray-400">{t('home.aboutKicker')}</span>
                                    <span className="text-[#16171a]">{t('team.ivanName')}</span>
                                </span>
                            </div>

                            <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                                <Image
                                    src="/ivan-photo.jpg"
                                    alt={t('team.ivanName')}
                                    fill
                                    className="object-cover object-top"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col px-0 pb-10 pt-5 lg:pb-12 lg:pl-12 lg:pt-6">
                            <p className="mb-5 text-lg font-semibold text-[#16171a] lg:text-xl">
                                {t('team.ivanRole')}
                            </p>
                            <div className="max-w-lg space-y-6 text-base leading-relaxed text-gray-600 lg:text-[17px]">
                                <p className="font-semibold text-[#16171a]">{t('team.ivanRecognition')}</p>

                                <div>
                                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-gray-400">
                                        {t('team.achievementsTitle')}
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed">
                                        <li>{t('team.achievement1')}</li>
                                        <li>{t('team.achievement2')}</li>
                                        <li>{t('team.achievement3')}</li>
                                        <li>{t('team.achievement4')}</li>
                                        <li>{t('team.achievement5')}</li>
                                        <li>{t('team.achievement6')}</li>
                                        <li>{t('team.achievement7')}</li>
                                    </ul>
                                </div>

                                <div>
                                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-gray-400">
                                        {t('team.careerTitle')}
                                    </p>
                                    <p className="text-sm leading-relaxed mb-3">{t('team.careerDescription1')}</p>
                                    <p className="text-sm leading-relaxed">{t('team.careerDescription2')}</p>
                                </div>

                                <div>
                                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-gray-400">
                                        {t('team.contributionsTitle')}
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed">
                                        <li>{t('team.contribution1')}</li>
                                        <li><strong>{t('team.contribution2')}</strong></li>
                                    </ul>
                                </div>

                                <div>
                                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-gray-400">
                                        {t('team.recognitionsTitle')}
                                    </p>
                                    <p className="text-sm leading-relaxed">{t('team.recognitionDescription')}</p>
                                </div>

                                <div>
                                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-gray-400">
                                        {t('team.philosophyTitle')}
                                    </p>
                                    <p className="text-sm leading-relaxed">{t('team.philosophyDescription')}</p>
                                </div>
                            </div>

                            <Link
                                href="https://www.amazon.com.mx/Protecci%C3%B3n-ejecutiva-siglo-XXI-doctrina-ebook/dp/B09MZ8BC9Q"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group mt-8 flex w-fit items-stretch"
                            >
                                <span className="bg-[#B70126] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors group-hover:bg-[#8f011e]">
                                    {t('team.getMyBook')}
                                </span>
                                <span className="ml-px flex items-center bg-[#B70126] px-4 text-white transition-colors group-hover:bg-[#8f011e]">
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Braulio Barrera: mismo patrón, franja siguiente. */}
            <div className="bg-white pb-16 lg:pb-20">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
                    <div className="grid grid-cols-1 border-t border-gray-200 lg:grid-cols-2">
                        <div className="flex flex-col px-0 pb-10 pt-5 lg:border-r lg:border-gray-200 lg:pb-12 lg:pr-12 lg:pt-6">
                            <div className="mb-5 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.14em]">
                                <span className="flex gap-6">
                                    <span className="text-gray-400">{t('team.braulioRole')}</span>
                                    <span className="text-[#16171a]">{t('team.braulioName')}</span>
                                </span>
                            </div>

                            <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                                <Image
                                    src="/braulio-barrera.png"
                                    alt={t('team.braulioName')}
                                    fill
                                    className="object-cover object-top"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col px-0 pb-10 pt-5 lg:pb-12 lg:pl-12 lg:pt-6">
                            <div className="max-w-lg space-y-4 text-base leading-relaxed text-gray-600 lg:text-[17px]">
                                <p>{t('team.braulioDescription1')}</p>
                                <p>{t('team.braulioDescription2')}</p>
                                <p>{t('team.braulioDescription3')}</p>
                                <p>{t('team.braulioDescription4')}</p>
                                <p>{t('team.braulioDescription5')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
