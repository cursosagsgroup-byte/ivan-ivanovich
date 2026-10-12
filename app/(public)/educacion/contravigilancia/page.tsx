'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import AddToCartButton from '@/components/cart/AddToCartButton';
import RecognitionsSection from '@/components/public/RecognitionsSection';
import FaqSection from '@/components/public/FaqSection';
import { useTranslation } from '@/hooks/useTranslation';
import ShareLanguageLink from '@/components/ShareLanguageLink';
import { StructuredData } from '@/components/seo/StructuredData';
import { courseSchema } from '@/lib/seo-utils';

// Mismos datos que ya se muestran en la barra de compra (precio, acceso,
// certificado): el schema Course no debe inventar nada que no esté en la
// página.
const COURSE_SCHEMA = {
    es: courseSchema({
        name: 'Contravigilancia Para Protección Ejecutiva',
        description: 'Técnicas profesionales de contravigilancia para detectar vigilancia hostil antes de que se convierta en una amenaza, impartidas por Ivan Ivanovich.',
        image: 'https://ivanivanovich.com/curso-contravigilancia.jpg',
        price: 2500,
        currency: 'MXN',
    }),
    en: courseSchema({
        name: 'Counter Surveillance for Executive Protection',
        description: 'Professional counter-surveillance techniques to detect hostile surveillance before it becomes a threat, taught by Ivan Ivanovich.',
        image: 'https://ivanivanovich.com/curso-contravigilancia.jpg',
        price: 2500,
        currency: 'MXN',
    }),
} as const;

// Preguntas frecuentes: mismos hechos que ya aparecen en la barra de compra
// (online, acceso de por vida, certificado) — nada inventado.
const FAQS = {
    es: [
        {
            question: '¿EL CURSO ES PRESENCIAL O EN LÍNEA?',
            answer: 'Es 100% en línea. Accedes a las clases cuando quieras y desde donde quieras, a tu propio ritmo.',
        },
        {
            question: '¿EL ACCESO AL CURSO TIENE VENCIMIENTO?',
            answer: 'No. Es un pago único con acceso de por vida a todo el contenido del curso.',
        },
        {
            question: '¿CÓMO OBTENGO EL CERTIFICADO DEL CURSO?',
            answer: 'Debes ver cada clase y aprobar el módulo de examen correspondiente. Al completar todos los módulos, tu certificado se habilita para descarga.',
        },
        {
            question: '¿PARA QUIÉN ES ESTE CURSO?',
            answer: 'Está diseñado para profesionales de la protección ejecutiva que quieren aprender a detectar vigilancia hostil antes de que se convierta en una amenaza.',
        },
    ],
    en: [
        {
            question: 'IS THE COURSE IN PERSON OR ONLINE?',
            answer: 'It is 100% online. You access the classes whenever and wherever you want, at your own pace.',
        },
        {
            question: 'DOES COURSE ACCESS EXPIRE?',
            answer: 'No. It is a one-time payment with lifetime access to all the course content.',
        },
        {
            question: 'HOW DO I GET THE COURSE CERTIFICATE?',
            answer: 'You must watch each class and pass the corresponding exam module. Once you complete every module, your certificate is enabled for download.',
        },
        {
            question: 'WHO IS THIS COURSE FOR?',
            answer: 'It is designed for executive protection professionals who want to learn how to detect hostile surveillance before it becomes a threat.',
        },
    ],
} as const;

// Página única del curso de contravigilancia. El vídeo, el curso a la venta y
// las etiquetas fijas cambian según el idioma; los textos largos ya salen de
// las traducciones. La versión en inglés vive en /en/educacion/contravigilancia.
const VIDEO_INTRO = {
    es: '954253693',
    en: '1134754045',
} as const;

const CURSO = {
    es: { id: 'cmio13v7u000164w1bhkqj8ej', title: 'Contravigilancia Para Protección Ejecutiva' },
    en: { id: 'cmiq7oga703zjkvegaq8v1ir4', title: 'COUNTER SURVEILLANCE FOR EXECUTIVE PROTECTION' },
} as const;

export default function ContravigilanciaPage() {
    const { t, language } = useTranslation();
    const en = language === 'en';
    const idioma = en ? 'en' : 'es';

    return (
        <div className="bg-white min-h-screen">
            <StructuredData data={COURSE_SCHEMA[idioma]} />
            {/* Hero a sangre, mismo patrón que el resto de /educacion. */}
            <div className="relative w-full overflow-hidden bg-[#0B121F]">
                <Image
                    src="/ivan-hero-blog.webp"
                    alt=""
                    aria-hidden="true"
                    fill
                    className="object-cover object-[65%_15%]"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="subpage-hero relative z-10 mx-auto max-w-[1440px]">
                    <p className="subpage-hero-eyebrow">
                        {t('counterSurveillance.heroSubtitle')}
                    </p>
                    <h1 className="max-w-4xl text-5xl font-normal uppercase leading-[0.95] text-white lg:text-7xl" style={{ fontFamily: 'var(--font-bebas)' }}>
                        {t('counterSurveillance.heroTitle')}
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-100 sm:text-lg">{t('counterSurveillance.heroDescription')}</p>
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
                                    {t('counterSurveillance.introTitle')}
                                </h2>
                                <div className="max-w-2xl space-y-4 text-base leading-relaxed text-gray-600 lg:text-[17px]">
                                    <p>{t('counterSurveillance.introDescription1')}</p>
                                    <p>{t('counterSurveillance.introDescription2')}</p>
                                    <p>{t('counterSurveillance.introDescription3')}</p>
                                </div>
                            </div>

                            {/* Video */}
                            <div>
                                <div className="relative w-full overflow-hidden bg-gray-100" style={{ paddingTop: '56.25%' }}>
                                    <iframe
                                        key={VIDEO_INTRO[idioma]}
                                        src={`https://player.vimeo.com/video/${VIDEO_INTRO[idioma]}`}
                                        frameBorder="0"
                                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                        title={en ? 'Course Introduction' : 'Introducción al Curso'}
                                    />
                                </div>
                                <div className="mt-4 flex justify-center">
                                    <ShareLanguageLink />
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

                            {/* Lo que aprenderás */}
                            <div>
                                <h2
                                    className="mb-6 text-3xl font-normal uppercase leading-none text-[#16171a] lg:text-4xl"
                                    style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                                >
                                    {t('counterSurveillance.whatYouWillLearnTitle')}
                                </h2>
                                <ul className="space-y-3">
                                    {(t('counterSurveillance.whatYouWillLearnItems') as unknown as string[]).map((item, index) => (
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
                                    {t('counterSurveillance.modulesTitle')}
                                </h2>
                                <div className="border-t border-gray-200">
                                    {(t('counterSurveillance.modules') as unknown as string[]).map((module, index) => (
                                        <ModuleItem key={index} index={index} title={module} />
                                    ))}
                                </div>
                            </div>

                            {/* Preguntas frecuentes */}
                            <FaqSection
                                title={en ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}
                                items={[...FAQS[idioma]]}
                            />
                        </div>

                        {/* Sidebar de compra */}
                        <div className="lg:col-span-1">
                            <div className="border border-gray-200 lg:sticky lg:top-32">
                                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                                    <Image
                                        src="/curso-contravigilancia.jpg"
                                        alt={en ? 'Counter Surveillance Course' : 'Curso de Contravigilancia'}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <p className="mb-1 font-mono text-xs uppercase tracking-[0.1em] text-gray-400 line-through">
                                        {t('counterSurveillance.originalPrice')}
                                    </p>
                                    <p
                                        className="mb-1 text-4xl uppercase leading-none text-[#16171a]"
                                        style={{ fontFamily: 'var(--font-bebas), sans-serif' }}
                                    >
                                        {t('counterSurveillance.currentPrice')}
                                    </p>
                                    <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.12em] text-gray-400">
                                        {t('counterSurveillance.priceLabel')}
                                    </p>

                                    <AddToCartButton
                                        course={{
                                            id: CURSO[idioma].id,
                                            title: CURSO[idioma].title,
                                            price: 2500,
                                            image: '/curso-contravigilancia.jpg'
                                        }}
                                        label={t('counterSurveillance.buyButton')}
                                        className="w-full px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] hover:bg-[#8f011e]"
                                    />

                                    <div className="mt-8 border-t border-gray-200">
                                        <div className="flex items-center justify-between border-b border-gray-200 py-3 font-mono text-[11px] uppercase tracking-[0.12em]">
                                            <span className="text-gray-400">{en ? 'Duration' : 'Duración'}</span>
                                            <span className="text-[#16171a]">Online</span>
                                        </div>
                                        <div className="flex items-center justify-between border-b border-gray-200 py-3 font-mono text-[11px] uppercase tracking-[0.12em]">
                                            <span className="text-gray-400">{en ? 'Access' : 'Acceso'}</span>
                                            <span className="text-[#16171a]">{en ? 'Lifetime' : 'De por vida'}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-3 font-mono text-[11px] uppercase tracking-[0.12em]">
                                            <span className="text-gray-400">{en ? 'Certificate' : 'Certificado'}</span>
                                            <span className="text-[#16171a]">{en ? 'Yes' : 'Sí'}</span>
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
    );
}

function ModuleItem({ index, title }: { index: number; title: string }) {
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
                <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <p className="mt-3 pl-9 font-mono text-xs uppercase tracking-[0.1em] text-gray-400">
                    {en ? 'Module content...' : 'Contenido del módulo...'}
                </p>
            )}
        </div>
    );
}
