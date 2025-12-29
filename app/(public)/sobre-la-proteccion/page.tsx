'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function SobreLaProteccionPage() {
    const { t } = useTranslation();

    return (
        <div className="bg-white min-h-screen pt-24">
            {/* Hero Section */}
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
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-white uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {t('aboutProtection.heroTitle')}
                                </h1>
                            </div>

                            {/* Right Column: Image */}
                            <div className="flex justify-center lg:justify-end w-full mt-2 lg:mt-0">
                                <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border-4 border-white shadow-2xl lg:h-[28vh] lg:w-auto">
                                    <Image
                                        src="/about-protection-hero.png"
                                        alt="Sobre la protección"
                                        fill
                                        className="object-cover object-top"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container - 80% width */}
            <div className="mx-auto" style={{ width: '80%' }}>
                {/* Main Content Section */}
                <section className="py-16">
                    <div className="mx-auto max-w-5xl">

                        {/* Traditional Protection Column */}
                        <div className="mb-16">
                            <h2 className="text-2xl font-bold text-black mb-8">
                                {t('aboutProtection.introTitle')}
                            </h2>
                            <ul className="space-y-4 text-gray-700 mb-12">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#B70126] font-bold text-xl mt-1">•</span>
                                    <span className="text-lg leading-relaxed">{t('aboutProtection.introItem1')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#B70126] font-bold text-xl mt-1">•</span>
                                    <span className="text-lg leading-relaxed">{t('aboutProtection.introItem2')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#B70126] font-bold text-xl mt-1">•</span>
                                    <span className="text-lg leading-relaxed">{t('aboutProtection.introItem3')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#B70126] font-bold text-xl mt-1">•</span>
                                    <span className="text-lg leading-relaxed">{t('aboutProtection.introItem4')}</span>
                                </li>
                            </ul>

                            <h3 className="text-xl font-bold text-black mb-8">
                                {t('aboutProtection.problemsTitle')}
                            </h3>
                            <ul className="space-y-4 text-gray-700">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#B70126] font-bold text-xl mt-1">•</span>
                                    <span className="text-lg leading-relaxed">{t('aboutProtection.problem1')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#B70126] font-bold text-xl mt-1">•</span>
                                    <span className="text-lg leading-relaxed">{t('aboutProtection.problem2')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#B70126] font-bold text-xl mt-1">•</span>
                                    <span className="text-lg leading-relaxed">{t('aboutProtection.problem3')}</span>
                                </li>
                            </ul>
                        </div>

                        {/* Modern Solution */}
                        <div className="mb-16">
                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                {t('aboutProtection.solutionText1')}
                            </p>
                            <ul className="space-y-4 text-gray-700">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#B70126] font-bold text-xl mt-1">•</span>
                                    <span className="text-lg leading-relaxed">{t('aboutProtection.solutionText2')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#B70126] font-bold text-xl mt-1">•</span>
                                    <span className="text-lg leading-relaxed">{t('aboutProtection.solutionText3')}</span>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Section */}
                        <div className="bg-gray-50 rounded-2xl p-8 text-center">
                            <h3 className="text-3xl font-bold text-black uppercase mb-4" style={{ fontFamily: 'var(--font-bebas)' }}>
                                {t('aboutProtection.contactTitle')}
                            </h3>
                            <p className="text-lg text-gray-700 mb-6">
                                {t('aboutProtection.contactDescription')}
                            </p>
                            <a
                                href="mailto:contacto@ivanivanovich.com"
                                className="inline-block text-2xl font-bold text-[#B70126] hover:text-[#D9012D] transition-colors"
                            >
                                contacto@ivanivanovich.com
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
