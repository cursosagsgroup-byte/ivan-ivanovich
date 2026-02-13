"use client";

import React from 'react';
import Image from 'next/image';

export default function PersuasionTechniquesSection() {
    return (
        <section data-theme="light" className="py-12 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Images Column */}
                    <div className="order-2 lg:order-1 flex flex-col gap-6">
                        <div className="relative h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="/images/landing-pe/persuasion-1.jpg"
                                alt="Técnicas de Persuasión 1"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="relative h-[250px] md:h-[350px] w-full rounded-2xl overflow-hidden shadow-xl transform translate-x-4 md:translate-x-8 -mt-12 border-4 border-white">
                            <Image
                                src="/images/landing-pe/persuasion-2.jpg"
                                alt="Técnicas de Persuasión 2"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="order-1 lg:order-2">
                        <h2 className="text-3xl md:text-5xl font-black text-black uppercase leading-none mb-6 md:mb-8 text-center lg:text-left" style={{ fontFamily: 'var(--font-bebas)' }}>
                            Más de 30 años de <span className="text-[#B70126]">experiencia operativa</span>
                        </h2>
                        <p className="text-xl md:text-2xl font-medium text-gray-800 mb-6 md:mb-8 text-center lg:text-left">
                            Actuando en escenarios de seguridad global, incluyendo conflictos bélicos y situaciones de alto riesgo en Europa y América.
                        </p>

                        <div className="space-y-6 text-base md:text-lg text-gray-700 leading-relaxed text-center lg:text-left">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black text-black uppercase mb-2" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    Aprende técnicas avanzadas de <span className="text-[#B70126]">persuasión</span>
                                </h3>
                            </div>

                            <p>
                                Aprenderás a convencer a ejecutivos de alto nivel de cumplir el plan de protección, comunicar riesgos con firmeza estratégica y lograr cooperación sin confrontación.
                            </p>

                            <div className="bg-gray-50 border-l-4 border-[#B70126] p-6 shadow-sm">
                                <p className="font-bold text-black">
                                    Además, desarrollarás la capacidad de vender servicios de protección ejecutiva a CEOs y directores, posicionándote como un profesional con criterio, liderazgo y alto valor en el mercado.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
