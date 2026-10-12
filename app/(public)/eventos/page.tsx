'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function EventsPage() {
    const { language } = useTranslation();
    const en = language === 'en';

    // Al anunciar una nueva edición presencial, se añade aquí. La página ya
    // muestra un aviso propio cuando la lista está vacía.
    const events: {
        id: string;
        title: string;
        date: string;
        location: string;
        image: string;
        price: string;
        link: string;
        status: string;
    }[] = [];

    return (
        <div className="bg-white min-h-screen">
            {/* Hero a sangre, mismo patrón que el resto de /educacion. */}
            <div className="relative w-full overflow-hidden bg-[#0B121F]">
                <Image
                    src="/course-hero-image.jpg"
                    alt=""
                    aria-hidden="true"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="subpage-hero relative z-10 mx-auto max-w-[1440px]">
                    <p className="subpage-hero-eyebrow">{en ? 'Executive Protection Academy' : 'Academia de Protección Ejecutiva'}</p>
                    <h1 className="text-6xl font-normal uppercase leading-none text-white lg:text-8xl" style={{ fontFamily: 'var(--font-bebas)' }}>
                        {en ? 'Upcoming Events' : 'Próximos Eventos'}
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-100 sm:text-lg">
                        {en
                            ? 'High-level in-person training, certifications and exclusive seminars for security professionals.'
                            : 'Capacitaciones presenciales de alto nivel, certificaciones y seminarios exclusivos para profesionales de la seguridad.'}
                    </p>
                </div>
            </div>

            {events.length === 0 ? (
                /* Estado vacío: mismo patrón editorial, ancho completo, centrado. */
                <div className="border-t border-gray-200 bg-white py-20 lg:py-28">
                    <div className="mx-auto max-w-xl px-4 text-center sm:px-6 lg:px-10">
                        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-gray-400">
                            {en ? 'EVENTS' : 'EVENTOS'}
                        </p>
                        <h2
                            className="mb-4 text-3xl font-normal uppercase leading-none text-[#16171a] lg:text-4xl"
                            style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                        >
                            {en ? 'No in-person dates open right now' : 'No hay fechas presenciales abiertas'}
                        </h2>
                        <p className="mb-10 text-base leading-relaxed text-gray-600 lg:text-[17px]">
                            {en
                                ? 'We are preparing the next editions. In the meantime, you can train from wherever you are.'
                                : 'Estamos preparando las próximas convocatorias. Mientras tanto, puedes formarte desde donde estés.'}
                        </p>
                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            <Link href="/educacion/cursos-online" className="group flex w-fit items-stretch">
                                <span className="bg-[#B70126] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors group-hover:bg-[#8f011e]">
                                    {en ? 'View online courses' : 'Ver cursos online'}
                                </span>
                                <span className="ml-px flex items-center bg-[#B70126] px-4 text-white transition-colors group-hover:bg-[#8f011e]">
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </span>
                            </Link>
                            <Link
                                href="/contacto"
                                className="border border-gray-300 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[#16171a] transition-colors hover:border-[#16171a]"
                            >
                                {en ? 'Notify me of the next date' : 'Avísenme de la próxima fecha'}
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                /* Eventos: mismo patrón que las tarjetas de cursos — kicker,
                   línea divisoria, foto, precio/acción al pie. */
                <div className="border-t border-gray-200 bg-white">
                    <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
                        <div className="grid grid-cols-1 border-t border-gray-200 md:grid-cols-2 lg:grid-cols-3">
                            {events.map((event, index) => {
                                const col = index % 3;
                                const isFirstRow = index < 3;
                                return (
                                    <Link
                                        key={event.id}
                                        href={event.link}
                                        className={[
                                            'group flex flex-col pb-10 lg:pb-12',
                                            isFirstRow ? 'pt-5 lg:pt-6' : 'border-t border-gray-200 pt-8 lg:pt-10',
                                            col > 0 ? 'lg:border-l lg:border-gray-200 lg:pl-12' : '',
                                            col > 0 ? 'lg:pr-0' : 'lg:pr-12',
                                        ].filter(Boolean).join(' ')}
                                    >
                                        <div className="mb-5 flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em]">
                                            <span className="text-gray-400">{event.status}</span>
                                            <span className="text-gray-400">{String(index + 1).padStart(3, '0')}</span>
                                        </div>

                                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                                            <Image
                                                src={event.image}
                                                alt={event.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>

                                        <h3
                                            className="mb-2 mt-7 text-2xl font-normal uppercase leading-none text-[#16171a] lg:text-3xl"
                                            style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.01em' }}
                                        >
                                            {event.title}
                                        </h3>
                                        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.12em] text-gray-400">
                                            {event.date} · {event.location}
                                        </p>

                                        <div className="mt-auto flex items-end justify-between gap-4">
                                            <span className="text-2xl font-bold text-[#16171a]">{event.price}</span>
                                            <span className="flex h-10 w-10 items-center justify-center bg-[#B70126] text-white transition-colors group-hover:bg-[#8f011e]">
                                                <ArrowRight className="h-4 w-4" />
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
