'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

export default function HeroSection() {
    const { t } = useTranslation();

    return (
        <>
            {/* Hero Section with Background Image */}
            <div className="relative isolate overflow-hidden rounded-[30px] min-h-[600px] h-[85vh] md:h-[120vh]">
                {/* Background Image */}
                <div className="absolute inset-0 -z-10">
                    <Image
                        src="/hero-bg-v3.png"
                        alt="Ivan Ivanovich"
                        fill
                        className="object-cover object-center"
                        priority
                        quality={100}
                        sizes="100vw"
                    />
                </div>

                {/* Text positioned at top to avoid covering face */}
                <div className="relative z-20 flex h-full items-start justify-center pt-[30px]">
                    <div className="mx-auto max-w-4xl px-4 lg:px-8 w-full text-center">
                        {/* Text Container with Semi-transparent Background */}
                        <div className="inline-block bg-black/80 backdrop-blur-sm rounded-[30px] md:rounded-[40px] p-2 pb-4 md:pb-6 w-full md:w-auto">
                            {/* Red Badge - Full width inside container */}
                            <div
                                className="rounded-[25px] md:rounded-[35px] px-4 md:px-24 py-3 md:py-4 text-white font-bold text-lg md:text-3xl uppercase mb-2"
                                style={{
                                    backgroundColor: '#B70126',
                                    fontFamily: 'var(--font-montserrat), sans-serif',
                                    letterSpacing: '0.1em'
                                }}
                            >
                                {t('home.heroAcademiaDe')}
                            </div>

                            {/* Main Heading - Bebas Neue */}
                            <h1
                                className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal text-white uppercase px-2 md:px-8 leading-none"
                                style={{
                                    fontFamily: 'var(--font-bebas), sans-serif',
                                    letterSpacing: '0.02em',
                                }}
                            >
                                {t('home.heroProteccionEjecutiva')}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Boxes - Overlapping the hero */}
            <div className="relative -mt-48 z-30 pb-16">
                <div className="mx-auto max-w-[95%] md:max-w-[85%] px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                        {/* Course 1 */}
                        <div className="group relative overflow-hidden rounded-xl md:rounded-[20px] bg-white p-4 md:p-6 shadow-lg md:shadow-2xl flex flex-col items-center text-center">
                            <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden">
                                <Image
                                    src="/curso-team-leader.png"
                                    alt="Curso Team Leader"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h4 className="text-2xl font-normal text-black mb-6 leading-tight uppercase flex-grow" style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.05em' }}>
                                {t('home.course1Title')}
                            </h4>
                            <Link
                                href="/educacion/team-leader"
                                className="inline-block rounded-[5px] bg-[#B70126] px-10 py-3 text-white font-bold uppercase hover:bg-[#D9012D] transition-colors"
                                style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                            >
                                {t('home.enrollButton')}
                            </Link>
                        </div>

                        {/* Course 2 */}
                        <div className="group relative overflow-hidden rounded-xl md:rounded-[20px] bg-white p-4 md:p-6 shadow-lg md:shadow-2xl flex flex-col items-center text-center">
                            <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden">
                                <Image
                                    src="/curso-contravigilancia.jpg"
                                    alt="Curso Contravigilancia"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h4 className="text-2xl font-normal text-black mb-6 leading-tight uppercase flex-grow" style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.05em' }}>
                                {t('home.course2Title')}
                            </h4>
                            <Link
                                href="/educacion/contravigilancia"
                                className="inline-block rounded-[5px] bg-[#B70126] px-10 py-3 text-white font-bold uppercase hover:bg-[#D9012D] transition-colors"
                                style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                            >
                                {t('home.enrollButton')}
                            </Link>
                        </div>

                        {/* Free Book */}
                        <div className="group relative overflow-hidden rounded-xl md:rounded-[20px] bg-white p-4 md:p-6 shadow-lg md:shadow-2xl flex flex-col items-center text-center">
                            <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden">
                                <Image
                                    src="/libro-timeline.png"
                                    alt="Libro Timeline"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h4 className="text-2xl font-normal text-black mb-2 leading-tight uppercase" style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.05em' }}>
                                {t('home.course3Title')}
                            </h4>
                            <h4 className="text-2xl font-bold text-[#B70126] mb-6 leading-tight uppercase flex-grow" style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.05em' }}>
                                {t('home.course3Subtitle')}
                            </h4>
                            <Link
                                href="/educacion/libro"
                                className="inline-block rounded-[5px] bg-[#B70126] px-10 py-3 text-white font-bold uppercase hover:bg-[#D9012D] transition-colors"
                                style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                            >
                                {t('home.downloadButton')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
