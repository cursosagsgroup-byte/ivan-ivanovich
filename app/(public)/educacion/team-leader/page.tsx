'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import AddToCartButton from '@/components/cart/AddToCartButton';
import RecognitionsSection from '@/components/public/RecognitionsSection';
import { StructuredData } from '@/components/seo/StructuredData';
import { faqSchema } from '@/lib/seo-utils';
import { teamLeaderSchema } from './metadata';

import { useTranslation } from '@/hooks/useTranslation';
import ShareLanguageLink from '@/components/ShareLanguageLink';

// Presentación del curso, una por idioma. Los títulos en Vimeo están ambos en
// español, pero 950896444 está locutado en inglés.
const VIDEO_INTRO = {
    es: '786635929',
    en: '950896444',
} as const;

export default function TeamLeaderCoursePage() {
    const { t, language } = useTranslation();
    const en = language === 'en';
    const videoId = VIDEO_INTRO[en ? 'en' : 'es'];

    return (
        <>
            <StructuredData data={teamLeaderSchema} />
            {/* El FAQPage usa el mismo texto que ya se ve en la sección de
                preguntas frecuentes más abajo — Google lo descarta si no
                coincide con contenido visible. */}
            <StructuredData data={faqSchema(t('teamLeader.faqs') as unknown as { question: string; answer: string }[])} />
            <div className="bg-white min-h-screen">
                {/* Hero a sangre, mismo patrón que el resto de /educacion. */}
                <div className="relative w-full overflow-hidden bg-[#0B121F]">
                    <Image
                        src="/hero-ivan-instructor.webp"
                        alt=""
                        aria-hidden="true"
                        fill
                        className="object-cover object-[65%_15%]"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="subpage-hero relative z-10 mx-auto max-w-[1440px]">
                        <p className="subpage-hero-eyebrow">
                            {t('teamLeader.heroSubtitle')}
                        </p>
                        <h1 className="text-5xl font-normal uppercase leading-[0.95] text-white lg:text-7xl xl:text-8xl" style={{ fontFamily: 'var(--font-bebas)' }}>
                            {(t('teamLeader.heroTitle') as unknown as string).split('\n').map((line: string, i: number) => (
                                <span key={i} className="block">{line}</span>
                            ))}
                        </h1>
                        <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-100 sm:text-lg">{t('teamLeader.heroDescription')}</p>
                    </div>
                </div>

                {/* Contenido + sidebar de compra: ancho completo, líneas divisorias. */}
                <div className="border-t border-gray-200">
                    <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
                            <div className="flex flex-col gap-14 lg:col-span-2">

                                {/* Intro */}
                                <div>
                                    <h2
                                        className="mb-5 max-w-2xl text-3xl font-normal uppercase leading-none text-[#16171a] lg:text-5xl"
                                        style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                                    >
                                        {t('teamLeader.introTitle')}
                                    </h2>
                                    <div className="max-w-2xl space-y-4 text-base leading-relaxed text-gray-600 lg:text-[17px]">
                                        <p>{t('teamLeader.introDescription1')}</p>
                                        <p>{t('teamLeader.introDescription2')}</p>
                                    </div>
                                </div>

                                {/* Video */}
                                <div>
                                    <div className="relative w-full overflow-hidden bg-gray-100" style={{ paddingTop: '56.25%' }}>
                                        <iframe
                                            key={videoId}
                                            src={`https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                                            frameBorder="0"
                                            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                            title="Introducción al Curso"
                                        />
                                    </div>
                                    <div className="mt-4 flex justify-center">
                                        <ShareLanguageLink />
                                    </div>
                                </div>

                                {/* Franja de marcas */}
                                <div className="relative overflow-hidden border-y border-gray-200 py-8">
                                    <div className="flex animate-scroll-right whitespace-nowrap">
                                        <Image src="/brands-strip.png" alt="Brands" width={1200} height={80} className="h-16 w-auto inline-block" />
                                        <Image src="/brands-strip.png" alt="Brands" width={1200} height={80} className="h-16 w-auto inline-block" />
                                        <Image src="/brands-strip.png" alt="Brands" width={1200} height={80} className="h-16 w-auto inline-block" />
                                    </div>
                                </div>

                                {/* Instructor */}
                                <div>
                                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-gray-400">
                                        {t('home.aboutKicker')}
                                    </p>
                                    <h3
                                        className="mb-5 text-3xl font-normal uppercase leading-none text-[#16171a] lg:text-4xl"
                                        style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                                    >
                                        {t('home.ivanTitle')}
                                    </h3>
                                    <div className="max-w-2xl space-y-4 text-base leading-relaxed text-gray-600 lg:text-[17px]">
                                        <p className="font-semibold text-[#16171a]">{t('home.ivanSubtitle')}</p>
                                        <p>{t('home.ivanDescription1')}</p>
                                        <p>{t('home.ivanDescription2')} {t('home.ivanDescription3')}</p>
                                        <p>{t('home.ivanDescription4')}</p>
                                        <p>{t('home.ivanDescription5')}</p>
                                    </div>
                                    <Link href="/nuestro-equipo" className="group mt-6 flex w-fit items-stretch">
                                        <span className="bg-[#B70126] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors group-hover:bg-[#8f011e]">
                                            {t('home.readMore')}
                                        </span>
                                        <span className="ml-px flex items-center bg-[#B70126] px-4 text-white transition-colors group-hover:bg-[#8f011e]">
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                        </span>
                                    </Link>
                                </div>

                                {/* Lo que obtendrás */}
                                <div>
                                    <h2
                                        className="mb-2 max-w-2xl text-3xl font-normal uppercase leading-none text-[#16171a] lg:text-5xl"
                                        style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                                    >
                                        {t('teamLeader.whatYouWillGetTitle')}
                                    </h2>
                                    <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.12em] text-gray-400">
                                        {t('teamLeader.whatYouWillGetSubtitle')}
                                    </p>

                                    <div className="grid grid-cols-1 lg:grid-cols-2">
                                        <div className="pb-8 lg:border-r lg:border-gray-200 lg:pb-0 lg:pr-10">
                                            <ul className="space-y-4">
                                                {(t('teamLeader.benefits') as unknown as string[]).map((item, index) => (
                                                    <li key={index} className="flex items-start gap-3 text-base leading-relaxed text-[#16171a] lg:text-[17px]">
                                                        <span className="mt-1 text-[#B70126]">—</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="flex flex-col items-center justify-center bg-[#0B121F] p-8 text-center lg:pl-10">
                                            <div className="relative aspect-[4/3] w-full max-w-xs">
                                                <Image
                                                    src="/curso-team-leader-mockup.png"
                                                    alt="Curso Team Leader"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-white/50">
                                                {t('teamLeader.priceLabel')}
                                            </p>
                                            <p className="mt-2 font-mono text-sm text-white/40 line-through">
                                                {t('teamLeader.originalPrice')}
                                            </p>
                                            <p
                                                className="text-4xl uppercase leading-none text-white lg:text-5xl"
                                                style={{ fontFamily: 'var(--font-bebas), sans-serif' }}
                                            >
                                                {t('teamLeader.currentPrice')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Lo que aprenderás */}
                                <div>
                                    <h2
                                        className="mb-6 text-3xl font-normal uppercase leading-none text-[#16171a] lg:text-4xl"
                                        style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                                    >
                                        {t('teamLeader.whatYouWillLearnTitle')}
                                    </h2>
                                    <ul className="space-y-3">
                                        {(t('teamLeader.whatYouWillLearnItems') as unknown as string[]).map((item, index) => (
                                            <li key={index} className="flex items-start gap-3 text-base leading-relaxed text-gray-600 lg:text-[17px]">
                                                <span className="mt-1 text-[#B70126]">—</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Módulos */}
                                <div>
                                    <h2
                                        className="mb-2 text-3xl font-normal uppercase leading-none text-[#16171a] lg:text-4xl"
                                        style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                                    >
                                        {t('teamLeader.modulesTitle')}
                                    </h2>
                                    <div className="border-t border-gray-200">
                                        {(t('teamLeader.modules') as unknown as { title: string; duration: string }[]).map((mod, index) => (
                                            <ModuleItem key={index} index={index} title={mod.title} duration={mod.duration} />
                                        ))}
                                    </div>
                                </div>

                                {/* Preguntas frecuentes */}
                                <div>
                                    <h2
                                        className="mb-2 text-3xl font-normal uppercase leading-none text-[#16171a] lg:text-4xl"
                                        style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                                    >
                                        {t('teamLeader.faqTitle')}
                                    </h2>
                                    <div className="border-t border-gray-200">
                                        {(t('teamLeader.faqs') as unknown as { question: string; answer: string }[]).map((faq, index) => (
                                            <FAQItem key={index} question={faq.question} answer={faq.answer} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar de compra */}
                            <div className="lg:col-span-1">
                                <div className="border border-gray-200 lg:sticky lg:top-32">
                                    <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                                        <Image
                                            src="/curso-team-leader.png"
                                            alt="Curso Team Leader"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <p className="mb-1 font-mono text-xs uppercase tracking-[0.1em] text-gray-400 line-through">
                                            {t('teamLeader.originalPrice')}
                                        </p>
                                        <p
                                            className="mb-1 text-4xl uppercase leading-none text-[#16171a]"
                                            style={{ fontFamily: 'var(--font-bebas), sans-serif' }}
                                        >
                                            {t('teamLeader.currentPrice')}
                                        </p>
                                        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.12em] text-gray-400">
                                            {t('teamLeader.priceLabel')}
                                        </p>

                                        <AddToCartButton
                                            course={{
                                                id: t('teamLeader.buyButton') === 'Buy' ? 'cmiq7oga203zikveg3jbf8p8u' : 'cmio13v7r000064w1fs838sgw',
                                                title: t('teamLeader.buyButton') === 'Buy' ? 'Team Leader in Executive Protection' : 'Team Leader en Protección Ejecutiva',
                                                price: 1900,
                                                image: '/curso-team-leader.png'
                                            }}
                                            label={t('teamLeader.buyButton')}
                                            className="w-full px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] hover:bg-[#8f011e]"
                                        />

                                        <div className="mt-8 border-t border-gray-200">
                                            <div className="flex items-center justify-between border-b border-gray-200 py-3 font-mono text-[11px] uppercase tracking-[0.12em]">
                                                <span className="text-gray-400">{t('teamLeader.durationLabel')}</span>
                                                <span className="text-[#16171a]">{t('teamLeader.duration')}</span>
                                            </div>
                                            <div className="flex items-center justify-between border-b border-gray-200 py-3 font-mono text-[11px] uppercase tracking-[0.12em]">
                                                <span className="text-gray-400">{t('teamLeader.accessLabel')}</span>
                                                <span className="text-[#16171a]">{t('teamLeader.access')}</span>
                                            </div>
                                            <div className="flex items-center justify-between py-3 font-mono text-[11px] uppercase tracking-[0.12em]">
                                                <span className="text-gray-400">{t('teamLeader.certificateLabel')}</span>
                                                <span className="text-[#16171a]">{t('teamLeader.certificate')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reconocimientos: mismo bloque editorial que el resto del sitio. */}
                <RecognitionsSection contained />
            </div>
        </>
    );
}

function ModuleItem({ index, title, duration }: { index: number; title: string; duration: string }) {
    const { language } = useTranslation();
    const en = language === 'en';
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 py-5">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between gap-4 text-left"
                aria-expanded={isOpen}
            >
                <span className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-gray-400">{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-base font-medium text-[#16171a] sm:text-lg">{title}</span>
                </span>
                <span className="flex shrink-0 items-center gap-3">
                    {duration !== '00:00' && duration && (
                        <span className="font-mono text-[11px] text-gray-400">{duration}</span>
                    )}
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </span>
            </button>
            {isOpen && (
                <p className="mt-3 pl-9 font-mono text-xs uppercase tracking-[0.1em] text-gray-400">
                    {en ? 'Module content...' : 'Contenido del módulo...'}
                </p>
            )}
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-b border-gray-200 py-5">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between gap-4 text-left"
                aria-expanded={isOpen}
            >
                <span
                    className="text-xl uppercase leading-tight text-[#16171a] lg:text-2xl"
                    style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                >
                    {question}
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">
                    {answer}
                </p>
            )}
        </div>
    );
}
