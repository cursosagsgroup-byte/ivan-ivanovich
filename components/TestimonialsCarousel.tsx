'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

/** Testimonios reales de alumnos, rescatados de las landing de
 *  Contravigilancia (ES/EN) del WordPress anterior. */
const TESTIMONIALS = [
    {
        name: 'Daniel Arregui',
        photo: '/testimonios/daniel-arregui.jpg',
        quote: 'Este curso es de gran utilidad, proporciona herramientas validas para el desarrollo del todos los días, y mas cuando se prepara una operación en PE. Muchas gracias...',
    },
    {
        name: 'Gustavo Giordano',
        photo: '/testimonios/gustavo-giordano.jpg',
        quote: 'The content itself is excellent, very specific, clear and applicable 100%. Thank you so much',
    },
    {
        name: 'Alexander José Cuaulma Guzman',
        photo: '/testimonios/alexander-cuaulma.jpg',
        quote: 'Muy bueno es una grata experiencia se requiere mucha concentración',
    },
    {
        name: 'Jonathan Rizzo',
        photo: '/testimonios/jonathan-rizzo.jpg',
        quote: 'Excelente experiencia para mi vida profesional. Todos los temas fueron enfocados a la realidad que vivimos los escoltas profesionales en protección ejecutiva moderna, descartando los conocimientos empíricos que vivía antes que se enfocaban a lo tradicional.',
    },
    {
        name: 'Julio Fernandez',
        photo: '/testimonios/julio-fernandez.jpg',
        quote: 'Una excelente experiencia, cada detalle brindado en lo que respecta a la Protección ejecutiva moderna, me sirve muchísimo, visto desde otro ángulo profesional, no tengo más que agradecerles por todo lo brindado en este curso de excelentísima calidad.',
    },
    {
        name: 'José López',
        photo: '/testimonios/jose-lopez.jpg',
        quote: 'Me gustó mucho la dinámica del curso, los ejemplos sustentados en hechos reales, muy bien explicado',
    },
];

/** Carrusel de testimonios del inicio: mismo lenguaje visual que el
 *  carrusel de blog — etiqueta monoespaciada, línea divisoria, ancho
 *  completo, tarjetas separadas por líneas verticales. */
export default function TestimonialsCarousel() {
    const { t } = useTranslation();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
        Autoplay({ delay: 4500, stopOnInteraction: false })
    ]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <div className="bg-white py-16 lg:py-20">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
                <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-gray-400">
                            {t('home.testimonialsKicker')}
                        </p>
                        <h2
                            className="text-4xl font-normal uppercase leading-none text-[#16171a] lg:text-6xl"
                            style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.02em' }}
                        >
                            {t('home.testimonialsTitle')}
                        </h2>
                    </div>
                    <div className="flex shrink-0 gap-px">
                        <button
                            onClick={scrollPrev}
                            className="flex h-11 w-11 items-center justify-center bg-[#16171a] text-white transition-colors hover:bg-[#B70126]"
                            aria-label="Anterior"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={scrollNext}
                            className="flex h-11 w-11 items-center justify-center bg-[#16171a] text-white transition-colors hover:bg-[#B70126]"
                            aria-label="Siguiente"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="border-y border-gray-200">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                            {TESTIMONIALS.map((item, i) => (
                                <div
                                    key={item.name}
                                    className="min-w-0 flex-[0_0_86%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                                >
                                    <article className={`flex h-full flex-col pb-8 pt-8 lg:pb-10 lg:pt-10 ${i > 0 ? 'pl-6 lg:pl-12' : 'pr-6 lg:pr-12'}`}>
                                        <div className="mb-5 flex items-center gap-4">
                                            <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-gray-100">
                                                <Image
                                                    src={item.photo}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="56px"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-base font-semibold text-[#16171a]">
                                                    {item.name}
                                                </p>
                                                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gray-400">
                                                    {t('home.testimonialStudentRole')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-4 flex gap-0.5 text-[#B70126]">
                                            {Array.from({ length: 5 }).map((_, star) => (
                                                <Star key={star} className="h-4 w-4 fill-current" />
                                            ))}
                                        </div>

                                        <p className="flex-grow text-base leading-relaxed text-gray-600 line-clamp-6 lg:text-[17px]">
                                            &ldquo;{item.quote}&rdquo;
                                        </p>
                                    </article>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
