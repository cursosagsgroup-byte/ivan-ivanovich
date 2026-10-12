'use client';

import { useEffect, useRef, useState } from 'react';

// [palabra, en cursiva, importante] — la doctrina de Iván tal cual está
// escrita en el sitio, palabra por palabra para revelarla con el scroll.
// Lo importante termina en negro y negrita; el resto se queda en gris.
const TOKENS: [string, boolean, boolean][] = [
    ['La', false, false], ['Protección', true, false], ['Ejecutiva', true, false], ['moderna', true, false],
    ['y', false, false], ['la', false, false], ['Nueva', true, false], ['Doctrina,', true, false],
    ['usa', false, true], ['la', false, true], ['protección', true, true], ['anticipada', true, true],
    ['que', false, true], ['desactive', false, true], ['los', false, true], ['ataques', false, true],
    ['lejos', false, true], ['del', false, true], ['ejecutivo', false, true], ['en', false, true],
    ['el', false, true], ['tiempo', false, true], ['y', false, true], ['en', false, true], ['el', false, true],
    ['espacio', false, true], ['y', false, false], ['no', false, false], ['lo', false, false], ['expone', false, false],
    ['a', false, false], ['los', false, false], ['riesgos', false, false], ['que', false, false],
    ['representa', false, false], ['la', false, false], ['reacción.', false, false],
];

/** Manifiesto de la doctrina: el texto empieza casi blanco y se revela
 *  palabra a palabra con el scroll. Lo importante se queda en negro y
 *  negrita; el contexto se asienta en gris claro. */
export default function ManifestoSection() {
    const ref = useRef<HTMLParagraphElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const el = ref.current;
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const vh = window.innerHeight;
                // Progresa de 0 a 1 mientras el bloque cruza del 85% al 35% de la ventana.
                const p = (vh * 0.85 - rect.top) / (vh * 0.5);
                setProgress(Math.min(1, Math.max(0, p)));
            });
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    const total = TOKENS.length;

    return (
        <div className="flex min-h-[90vh] items-center bg-[#F4F4F3] py-24">
            <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10">
                <div className="mb-12 flex items-center gap-4 lg:mb-16">
                    <span className="h-px w-10 bg-gray-400" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-500">
                        Ivan Ivanovich
                    </span>
                </div>

                <p
                    ref={ref}
                    className="text-2xl leading-[1.2] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl xl:leading-[1.15]"
                >
                    {TOKENS.map(([word, italic, important], i) => {
                        const active = progress > i / total;
                        // Sin revelar: casi blanco. Revelado: negro si es importante, gris claro si es contexto.
                        const color = !active ? '#d6d6d3' : important ? '#16171a' : '#a3a3a0';
                        return (
                            <span
                                key={i}
                                data-important={important}
                                className={`manifesto-word transition-colors duration-500 ease-out ${italic ? 'italic' : ''} ${important ? 'font-semibold' : 'font-normal'}`}
                                style={{ color }}
                            >
                                {word}{' '}
                            </span>
                        );
                    })}
                </p>
            </div>
        </div>
    );
}
