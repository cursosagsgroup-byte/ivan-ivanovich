'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function NuestroEquipoPage() {
    const { t } = useTranslation();

    return (
        <div className="bg-white min-h-screen pt-24">
            {/* Hero Section - Exactly like Team Leader */}
            <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-[95%]">
                <div className="relative rounded-[30px] overflow-hidden bg-[#0B121F] isolate shadow-2xl min-h-[500px] lg:h-[38vh] lg:min-h-[350px] flex items-center py-8 lg:py-0">
                    <div className="absolute inset-0 -z-10 opacity-40">
                        <Image
                            src="/course-hero-bg.png"
                            alt="Background"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="w-full px-6 lg:px-12 relative z-10">
                        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 items-center">
                            {/* Left Column: Title */}
                            <div className="text-center lg:text-left">
                                <h1 className="text-6xl lg:text-8xl font-normal text-white uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {t('team.title')}
                                </h1>
                            </div>

                            {/* Right Column: Image */}
                            <div className="flex justify-center lg:justify-end w-full mt-2 lg:mt-0">
                                <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border-4 border-white shadow-2xl lg:h-[28vh] lg:w-auto">
                                    <Image
                                        src="/course-hero-image.jpg"
                                        alt="Ivan Ivanovich Teaching"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container - 80% width */}
            <div className="mx-auto" style={{ width: '80%' }}>
                {/* Ivan Ivanovich Section - FIRST */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                            {/* Left: Photo */}
                            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl">
                                <img src="/ivan-photo.jpg" alt="Ivan Ivanovich" className="w-full h-full object-cover" />
                            </div>

                            {/* Right: Content */}
                            <div>
                                <h2 className="text-4xl font-bold text-black uppercase mb-4" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {t('team.ivanName')}
                                </h2>
                                <h3 className="text-base font-bold text-black mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                    {t('team.ivanRole')}
                                </h3>

                                <div className="space-y-6 text-gray-700">
                                    {/* Principales Logros */}
                                    <div>
                                        <h4 className="text-base font-bold text-black mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                            {t('team.achievementsTitle')}
                                        </h4>
                                        <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed">
                                            <li>{t('team.achievement1')}</li>
                                            <li>{t('team.achievement2')}</li>
                                            <li>{t('team.achievement3')}</li>
                                            <li>{t('team.achievement4')}</li>
                                            <li>{t('team.achievement5')}</li>
                                            <li>{t('team.achievement6')}</li>
                                            <li>{t('team.achievement7')}</li>
                                        </ul>
                                    </div>

                                    {/* Trayectoria Profesional */}
                                    <div>
                                        <h4 className="text-base font-bold text-black mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                            {t('team.careerTitle')}
                                        </h4>
                                        <p className="text-sm leading-relaxed mb-3">
                                            {t('team.careerDescription1')}
                                        </p>
                                        <p className="text-sm leading-relaxed">
                                            {t('team.careerDescription2')}
                                        </p>
                                    </div>

                                    {/* Contribuciones Académicas */}
                                    <div>
                                        <h4 className="text-base font-bold text-black mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                            {t('team.contributionsTitle')}
                                        </h4>
                                        <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed">
                                            <li>{t('team.contribution1')}</li>
                                            <li><strong>{t('team.contribution2')}</strong></li>
                                        </ul>
                                    </div>

                                    {/* Reconocimientos */}
                                    <div>
                                        <h4 className="text-base font-bold text-black mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                            {t('team.recognitionsTitle')}
                                        </h4>
                                        <p className="text-sm leading-relaxed">
                                            {t('team.recognitionDescription')}
                                        </p>
                                    </div>

                                    {/* Filosofía */}
                                    <div>
                                        <h4 className="text-base font-bold text-black mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                            {t('team.philosophyTitle')}
                                        </h4>
                                        <p className="text-sm leading-relaxed">
                                            {t('team.philosophyDescription')}
                                        </p>
                                    </div>

                                    {/* CTA Button */}
                                    <div className="pt-4">
                                        <Link
                                            href="https://www.amazon.com.mx/Protecci%C3%B3n-ejecutiva-siglo-XXI-doctrina-ebook/dp/B09MZ8BC9Q"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block rounded-full bg-[#B70126] px-8 py-3 text-sm font-bold uppercase text-white hover:bg-[#D9012D] transition-colors"
                                        >
                                            {t('team.getMyBook')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Braulio Barrera Section - SECOND */}
                <section className="py-16 border-t border-gray-200">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                            {/* Left: Photo */}
                            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl">
                                <img src="/braulio-barrera.png" alt="Braulio Barrera" className="w-full h-full object-cover" />
                            </div>

                            {/* Right: Content */}
                            <div>
                                <h2 className="text-4xl font-bold text-black uppercase mb-4" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {t('team.braulioName')}
                                </h2>
                                <h3 className="text-base font-bold text-black mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                    {t('team.braulioRole')}
                                </h3>

                                <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                                    <p>{t('team.braulioDescription1')}</p>
                                    <p>{t('team.braulioDescription2')}</p>
                                    <p>{t('team.braulioDescription3')}</p>
                                    <p>{t('team.braulioDescription4')}</p>
                                    <p>{t('team.braulioDescription5')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
