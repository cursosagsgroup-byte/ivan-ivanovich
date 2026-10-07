'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { StructuredData } from '@/components/seo/StructuredData';
import { faqSchema } from '@/lib/seo-utils';

export interface FaqItem {
    question: string;
    answer: string;
}

/** Preguntas frecuentes de una página de curso: mismo acordeón que los
 *  módulos, y alimenta el schema FAQPage con el mismo texto que se ve en
 *  pantalla (Google ignora el rich result si no coinciden). */
export default function FaqSection({ title, items }: { title: string; items: FaqItem[] }) {
    const [abierta, setAbierta] = useState<number | null>(null);

    if (items.length === 0) return null;

    return (
        <div>
            <StructuredData data={faqSchema(items)} />
            <h2
                className="mb-2 text-3xl font-normal uppercase leading-none text-[#16171a] lg:text-4xl"
                style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
            >
                {title}
            </h2>
            <div className="border-t border-gray-200">
                {items.map((item, index) => {
                    const isOpen = abierta === index;
                    return (
                        <div key={index} className="border-b border-gray-200 py-5">
                            <button
                                onClick={() => setAbierta(isOpen ? null : index)}
                                className="flex w-full items-start justify-between gap-4 text-left"
                                aria-expanded={isOpen}
                            >
                                <span className="text-base font-medium text-[#16171a] sm:text-lg">{item.question}</span>
                                <ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isOpen && (
                                <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600 lg:text-[17px]">
                                    {item.answer}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
