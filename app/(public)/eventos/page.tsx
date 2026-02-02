'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function EventsPage() {
    const { t } = useTranslation();

    const events = [
        {
            id: 'proteccion-ejecutiva',
            title: 'Protección Ejecutiva, Operatividad General y Logística Protectiva',
            date: '24 y 25 de Febrero, 2026',
            location: 'Ciudad de México, CDMX',
            image: '/images/landing-pe/feature-section.jpg',
            price: '$14,600 MXN + IVA',
            link: '/proteccion-ejecutiva-operatividad-general',
            status: 'Cupo Limitado'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">


            <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase" style={{ fontFamily: 'var(--font-bebas)' }}>
                        Próximos <span className="text-[#B70126]">Eventos</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Capacitaciones presenciales de alto nivel, certificaciones y seminarios exclusivos para profesionales de la seguridad.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <Link
                            key={event.id}
                            href={event.link}
                            className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <div className="absolute top-4 right-4 z-10 bg-[#B70126] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {event.status}
                                </div>
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-white font-bold text-lg mb-1">{event.date}</p>
                                    <p className="text-gray-300 text-sm flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {event.location}
                                    </p>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight uppercase" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {event.title}
                                </h3>

                                <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Inversión</p>
                                        <p className="text-[#B70126] font-bold text-lg">{event.price}</p>
                                    </div>
                                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-[#B70126] group-hover:bg-[#B70126] group-hover:text-white transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
