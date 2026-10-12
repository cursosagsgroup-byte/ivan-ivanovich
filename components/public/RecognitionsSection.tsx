'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

/** Los cuatro reconocimientos, en el orden en que ya vivían en la página. */
const ITEMS = [
    {
        titleKey: 'home.armadaTitle',
        descriptionKey: 'home.armadaDescription',
        photo: '/photo-armada-square.jpg',
        shields: ['/escudo-armada-1.png', '/escudo-armada-2.png'],
    },
    {
        titleKey: 'home.costaRicaTitle',
        descriptionKey: 'home.costaRicaDescription',
        photo: '/photo-costarica-square.jpg',
        shields: ['/escudo-costarica.png'],
    },
    {
        titleKey: 'home.top9Title',
        descriptionKey: 'home.top9Description',
        photo: '/photo-top9-square.png',
        shields: [] as string[],
    },
    {
        titleKey: 'home.isjTitle',
        descriptionKey: 'home.isjDescription',
        photo: '/images/isj-ivan.png',
        shields: [] as string[],
    },
];

/** Franja de reconocimientos como acordeón minimalista sobre fondo blanco:
 *  número, título Bebas y sellos junto al título, descripción en
 *  monoespaciada. En escritorio, al pasar el mouse la foto se abre grande y
 *  completa a la derecha, sin mover el texto. La descripción siempre está
 *  debajo del título; en móvil la foto también queda visible debajo. */
// `contained`: en el inicio va a ancho completo; en las subpáginas se ciñe
// al contenedor de 1440px como el resto del contenido.
export default function RecognitionsSection({ contained = false }: { contained?: boolean }) {
    const { t } = useTranslation();
    const [active, setActive] = useState<number | null>(null);
    const [canHover, setCanHover] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    // En touch, el navegador sintetiza mouseenter/mouseleave justo después
    // del tap: sin distinguir esto, el acordeón se abre y se cierra solo.
    // Con mouse real, el hover abre cada fila; en touch queda solo el tap.
    useEffect(() => {
        const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
        const desktop = window.matchMedia('(min-width: 1024px)');
        const update = () => {
            setCanHover(hover.matches && desktop.matches);
            setIsDesktop(desktop.matches);
            if (!desktop.matches) setActive(null);
        };
        update();
        hover.addEventListener('change', update);
        desktop.addEventListener('change', update);
        return () => {
            hover.removeEventListener('change', update);
            desktop.removeEventListener('change', update);
        };
    }, []);

    const toggle = (i: number) => setActive((prev) => (prev === i ? null : i));

    return (
        <div className="bg-[#F4F4F3] py-16 lg:py-24">
            <div className={`px-4 sm:px-6 lg:px-10 ${contained ? 'mx-auto max-w-[1440px]' : 'w-full'}`}>
                <div className="mb-10 lg:mb-14">
                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-gray-400">
                        {t('home.recognitionsKicker')}
                    </p>
                    <h2
                        className="text-4xl font-normal uppercase leading-none text-[#16171a] lg:text-6xl"
                        style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.02em' }}
                    >
                        {t('home.recognitionsTitle')}
                    </h2>
                </div>

                <div className="border-t border-gray-300">
                    {ITEMS.map((item, i) => {
                        const isOpen = active === i;
                        return (
                            <div
                                key={item.titleKey}
                                className="group relative border-b border-gray-300 py-7 lg:cursor-pointer lg:py-9"
                                onMouseEnter={canHover ? () => setActive(i) : undefined}
                                onMouseLeave={canHover ? () => setActive((prev) => (prev === i ? null : prev)) : undefined}
                                onClick={isDesktop ? () => toggle(i) : undefined}
                                role={isDesktop ? 'button' : undefined}
                                tabIndex={isDesktop ? 0 : undefined}
                                aria-expanded={isDesktop ? isOpen : undefined}
                                onKeyDown={isDesktop ? (e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        toggle(i);
                                    }
                                } : undefined}
                            >
                                <div className="flex items-start justify-between gap-4 sm:gap-8">
                                    <span className="w-8 shrink-0 pt-2 font-mono text-xs text-gray-400 sm:w-10">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>

                                    <div className="min-w-0 flex-1 lg:pr-[38%]">
                                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                                            <h3
                                                className={`text-3xl font-normal uppercase leading-none transition-colors sm:text-4xl lg:text-5xl ${isOpen ? 'text-[#B70126]' : 'text-[#16171a]'}`}
                                                style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                                            >
                                                {t(item.titleKey)}
                                            </h3>
                                            {item.shields.length > 0 && (
                                                <div className="flex items-center gap-3">
                                                    {item.shields.map((src) => (
                                                        <div key={src} className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16">
                                                            <Image src={src} alt="" fill className="object-contain" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <p className="mt-3 max-w-xl font-mono text-xs leading-relaxed text-gray-500 sm:text-sm">
                                            {t(item.descriptionKey)}
                                        </p>
                                    </div>

                                    <ArrowRight
                                        className={`mt-2 hidden h-5 w-5 shrink-0 transition-transform duration-300 lg:block ${isOpen ? 'translate-x-1 rotate-45 text-[#16171a]' : 'text-gray-300'}`}
                                    />
                                </div>

                                {/* Escritorio: la foto se abre grande y completa a
                                    la derecha, flotando sobre la fila sin
                                    empujar el texto. */}
                                <div
                                    className={`pointer-events-none absolute right-0 top-1/2 hidden aspect-square w-[34%] max-w-md -translate-y-1/2 overflow-hidden bg-white shadow-xl transition-all duration-500 ease-out lg:block ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}
                                >
                                    <Image
                                        src={item.photo}
                                        alt={t(item.titleKey)}
                                        fill
                                        className="object-cover"
                                        sizes="34vw"
                                    />
                                </div>

                                {/* Móvil/tablet: texto y foto visibles sin tocar la fila. */}
                                <div className="lg:hidden">
                                    <div className="mt-8 sm:ml-[3.5rem]">
                                        <div className="relative aspect-square w-full max-w-sm overflow-hidden bg-white">
                                            <Image
                                                src={item.photo}
                                                alt={t(item.titleKey)}
                                                fill
                                                className="object-cover"
                                                sizes="384px"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
