"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Award, CheckCircle2 } from 'lucide-react';

const IMAGES = [
    '/images/nueva-seccion/main.jpg',
    '/images/nueva-seccion/gallery-1.jpg',
    '/images/nueva-seccion/gallery-2.jpg',
    '/images/nueva-seccion/gallery-3.jpg'
];

export default function ExecutiveTrainingSection() {
    const [selectedImage, setSelectedImage] = useState(IMAGES[0]);

    return (
        <section data-theme="light" className="py-12 md:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                    {/* Image Gallery Column */}
                    <div className="order-2 lg:order-1 flex flex-col gap-4">
                        {/* Main Image */}
                        <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src={selectedImage}
                                alt="Ivan Ivanovich Training"
                                fill
                                className="object-cover transition-opacity duration-300"
                            />
                        </div>

                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-2 md:gap-4">
                            {IMAGES.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative h-20 md:h-24 w-full rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img
                                        ? 'border-[#B70126] ring-2 ring-[#B70126]/30'
                                        : 'border-transparent hover:border-gray-300'
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        <p className="text-gray-600 italic text-sm md:text-base mt-4">
                            "A lo largo de más de 30 años, Ivan Ivanovich ha capacitado a miles de protectores en América y Europa, formando escoltas y directores de seguridad que hoy operan con criterio estratégico, mentalidad preventiva y estándares internacionales."
                        </p>
                    </div>

                    {/* Content Column */}
                    <div className="order-1 lg:order-2">
                        <h3 className="text-[#B70126] font-bold text-base md:text-lg uppercase tracking-wide mb-2">
                            Entrena con uno de los referentes mundiales en Protección Ejecutiva
                        </h3>
                        <h2 className="text-3xl md:text-5xl font-black text-black uppercase leading-none mb-6 md:mb-8" style={{ fontFamily: 'var(--font-bebas)' }}>
                            CAPACÍTATE CON <span className="text-[#B70126]">IVAN IVANOVICH</span>
                        </h2>

                        <div className="space-y-4 md:space-y-6 text-base md:text-lg text-gray-700 leading-relaxed">
                            <p className="font-medium text-black">
                                Reconocido por la prestigiosa revista británica <span className="italic">International Security Journal</span> como uno de los <span className="text-[#B70126] font-bold">30 profesionales más influyentes del mundo</span> en seguridad ejecutiva.
                            </p>

                            <div className="bg-white border-l-4 border-[#B70126] p-4 md:p-6 shadow-sm">
                                <p className="font-bold text-black mb-3">Único en capacitar a unidades de élite en el mundo como:</p>
                                <ul className="space-y-2">
                                    <li className="flex gap-2 items-start">
                                        <CheckCircle2 className="w-5 h-5 text-[#B70126] shrink-0 mt-1" />
                                        <span>La Unidad de Protección Presidencial de Costa Rica.</span>
                                    </li>
                                    <li className="flex gap-2 items-start">
                                        <CheckCircle2 className="w-5 h-5 text-[#B70126] shrink-0 mt-1" />
                                        <span>La Fuerza de Protección de la Infantería de Marina Española.</span>
                                    </li>
                                    <li className="flex gap-2 items-start">
                                        <CheckCircle2 className="w-5 h-5 text-[#B70126] shrink-0 mt-1" />
                                        <span>Unidades militares y cuerpos policiales de España.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <Award className="w-6 h-6 text-[#B70126] shrink-0" />
                                    <p>
                                        <span className="font-bold text-black">Más de 30 años de experiencia operativa:</span> Actuando en escenarios de seguridad global, incluyendo conflictos bélicos y situaciones de alto riesgo en Europa y América.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Award className="w-6 h-6 text-[#B70126] shrink-0" />
                                    <p>
                                        Destacado entre los <span className="font-bold text-black">100 profesionales más influyentes</span> de la seguridad privada en México.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Award className="w-6 h-6 text-[#B70126] shrink-0" />
                                    <p>
                                        Autor del bestseller: Libro <span className="font-bold text-black text-lg">“Protección Ejecutiva en el siglo XXI, La Nueva Doctrina”</span>.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Award className="w-6 h-6 text-[#B70126] shrink-0" />
                                    <p>
                                        Presidente del Board of Directors de <span className="font-bold text-black">WSO-Worldwide Security Options</span>.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
