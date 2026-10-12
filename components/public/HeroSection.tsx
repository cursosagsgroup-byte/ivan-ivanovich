'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

/** Los dos cursos que encabezan el inicio. */
const CURSOS = [
    {
        n: '001',
        imagen: '/curso-team-leader.png',
        cortoKey: 'home.course1Short',
        fraseKey: 'home.course1Statement',
        href: '/educacion/team-leader',
    },
    {
        n: '002',
        imagen: '/curso-contravigilancia.jpg',
        cortoKey: 'home.course2Short',
        fraseKey: 'home.course2Statement',
        href: '/educacion/contravigilancia',
    },
];

export default function HeroSection() {
    const { t } = useTranslation();

    return (
        <>
            {/* Hero editorial: la foto llena todo el hero y una cortina
                blanca sube sobre ella con el texto dentro. Secuencia en
                globals.css (hero-editorial-*). */}
            <div className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-[#0B121F]">
                <div className="hero-editorial-foto absolute inset-0">
                    <Image
                        src="/hero-home-septiembre-2026.jpeg"
                        alt="Iván Ivanovich impartiendo clase"
                        fill
                        className="object-cover object-center -translate-y-[15%] sm:-translate-y-[10%] lg:translate-y-0"
                        priority
                        quality={90}
                        sizes="100vw"
                    />
                </div>

                {/* Cortina blanca: nace fuera de cuadro y sube tapando la
                    parte baja de la foto */}
                <div className="hero-editorial-panel absolute inset-x-0 bottom-0 bg-white">
                    <div className="grid w-full grid-cols-1 gap-5 px-4 pb-28 pt-8 sm:px-6 lg:grid-cols-[2.2fr_1fr] lg:items-end lg:gap-10 lg:px-10 lg:pb-12 lg:pt-12">
                        <h1
                            className="hero-editorial-titulo text-5xl font-normal uppercase leading-[0.92] text-[#16171a] sm:text-7xl xl:text-[6.8rem]"
                            style={{
                                fontFamily: 'var(--font-bebas), sans-serif',
                                letterSpacing: '0.01em',
                            }}
                        >
                            {/* "ACADEMIA DE" en su línea y el nombre sobre el
                                rojo de marca, como bloque destacado. */}
                            <span className="block">{t('home.heroAcademiaDe')}</span>
                            <span className="mt-1 inline-block bg-[#B70126] px-4 pb-1 pt-2 text-white">
                                {t('home.heroProteccionEjecutiva')}
                            </span>
                        </h1>
                        <p className="hero-editorial-texto max-w-xs text-base leading-snug text-gray-900 lg:justify-self-end lg:pr-24 lg:text-right lg:text-lg">
                            {t('home.heroSubtitle')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Dos cursos en columnas, con etiqueta monoespaciada arriba,
                foto, frase y botón rojo con la flecha en su propio cuadro. */}
            <div className="bg-white py-16 lg:py-20">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
                    <div className="grid grid-cols-1 border-t border-gray-200 lg:grid-cols-2">
                        {CURSOS.map((curso, i) => (
                            <div
                                key={curso.href}
                                className={`flex flex-col px-0 pb-10 pt-5 lg:pb-12 lg:pt-6 ${i === 0 ? 'lg:border-r lg:border-gray-200 lg:pr-12' : 'lg:pl-12'}`}
                            >
                                <div className="mb-5 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.14em]">
                                    <span className="flex gap-6">
                                        <span className="text-gray-400">{t('home.courseKicker')}</span>
                                        <span className="text-[#16171a]">{t(curso.cortoKey)}</span>
                                    </span>
                                    <span className="text-gray-400">{curso.n}</span>
                                </div>

                                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                                    <Image
                                        src={curso.imagen}
                                        alt={t(curso.cortoKey)}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                </div>

                                <p className="mb-8 mt-7 max-w-md text-base leading-relaxed text-gray-600 lg:text-[17px]">
                                    {t(curso.fraseKey)}
                                </p>

                                <Link href={curso.href} className="group mt-auto flex w-fit items-stretch">
                                    <span className="bg-[#B70126] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors group-hover:bg-[#8f011e]">
                                        {t('home.exploreCourse')}
                                    </span>
                                    <span className="ml-px flex items-center bg-[#B70126] px-4 text-white transition-colors group-hover:bg-[#8f011e]">
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quién es Iván: mismo patrón que los dos cursos (etiqueta
                monoespaciada, líneas divisorias, ancho completo) pero en una
                sola fila sobre fondo negro: foto cuadrada a un lado y el
                texto al otro. */}
            <div className="bg-[#0B121F] py-16 lg:py-20">
                <div className="w-full px-4 sm:px-6 lg:px-10">
                    <div className="grid grid-cols-1 border-t border-white/15 lg:grid-cols-2">
                        <div className="flex flex-col px-0 pb-10 pt-5 lg:border-r lg:border-white/15 lg:pb-12 lg:pr-12 lg:pt-6">
                            <div className="mb-5 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.14em]">
                                <span className="flex gap-6">
                                    <span className="text-white/40">{t('home.aboutKicker')}</span>
                                    <span className="text-white">{t('home.ivanTitle')}</span>
                                </span>
                            </div>

                            <div className="relative aspect-square w-full overflow-hidden bg-gray-900">
                                <Image
                                    src="/hero-ivan-instructor.webp"
                                    alt={t('home.ivanTitle')}
                                    fill
                                    className="object-cover object-[68%_18%]"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col px-0 pb-10 pt-5 lg:pb-12 lg:pl-12 lg:pt-6">
                            <p className="mb-5 text-lg font-semibold text-white lg:text-xl">
                                {t('home.ivanSubtitle')}
                            </p>
                            <div className="max-w-lg space-y-4 text-base leading-relaxed text-white/60 lg:text-[17px]">
                                <p className="font-semibold text-white/90">{t('home.ivanRecognition')}</p>
                                <p>{t('home.ivanDescription1')}</p>
                                <p>{t('home.ivanDescription2')}</p>
                                <p>{t('home.ivanDescription3')}</p>
                                <p>{t('home.ivanDescription4')}</p>
                                <p>{t('home.ivanDescription5')}</p>
                                <p>{t('home.ivanDescription6')}</p>
                            </div>

                            <Link href="/nuestro-equipo" className="group mt-8 flex w-fit items-stretch">
                                <span className="bg-[#B70126] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors group-hover:bg-[#8f011e]">
                                    {t('home.readMore')}
                                </span>
                                <span className="ml-px flex items-center bg-[#B70126] px-4 text-white transition-colors group-hover:bg-[#8f011e]">
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </span>
                            </Link>

                            {/* Mis libros: dentro de la biografía, debajo del
                                botón "Leer más" — mismo bloque, misma columna. */}
                            <div className="mt-10 border-t border-white/15 pt-8">
                                <p
                                    className="mb-3 text-2xl font-normal uppercase leading-none text-white lg:text-3xl"
                                    style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                                >
                                    {t('home.myBooksTitle')}
                                </p>
                                <p className="mb-6 max-w-lg text-base leading-relaxed text-white/60 lg:text-[17px]">
                                    {t('home.booksConnector')}
                                </p>
                                <Link href="/educacion/libro" className="group flex w-fit items-stretch">
                                    <span className="bg-[#B70126] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors group-hover:bg-[#8f011e]">
                                        {t('home.viewBooksButton')}
                                    </span>
                                    <span className="ml-px flex items-center bg-[#B70126] px-4 text-white transition-colors group-hover:bg-[#8f011e]">
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
