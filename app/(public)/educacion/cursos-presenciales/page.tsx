'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function CursosPresencialesPage() {
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
                                <h1 className="text-4xl sm:text-5xl lg:text-8xl font-normal text-white uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {t('inPersonCourses.heroTitle')}
                                </h1>
                            </div>

                            {/* Right Column: Image */}
                            <div className="flex justify-center lg:justify-end w-full mt-2 lg:mt-0">
                                <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border-4 border-white shadow-2xl lg:h-[28vh] lg:w-auto">
                                    <Image
                                        src="/course-hero-image.jpg"
                                        alt="Cursos Presenciales"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="mx-auto max-w-[95%] lg:max-w-7xl px-4 lg:px-8 py-16">

                {/* Course 1 */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-black uppercase mb-4" style={{ fontFamily: 'var(--font-bebas)' }}>
                            {t('inPersonCourses.course1.title')}
                        </h2>
                        <p className="text-xl text-[#B70126] font-semibold">
                            {t('inPersonCourses.course1.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Theory */}
                        <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
                            <h3 className="text-xl font-bold text-black mb-6 uppercase tracking-wide">
                                {t('inPersonCourses.course1.theoryTitle')}
                            </h3>
                            <ul className="space-y-3">
                                {(t('inPersonCourses.course1.theoryItems') as unknown as string[]).map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-[#B70126] font-bold">•</span>
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Practice & Cost */}
                        <div className="space-y-8">
                            <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
                                <h3 className="text-xl font-bold text-black mb-6 uppercase tracking-wide">
                                    {t('inPersonCourses.course1.practiceTitle')}
                                </h3>
                                <ul className="space-y-3">
                                    {(t('inPersonCourses.course1.practiceItems') as unknown as string[]).map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="text-[#B70126] font-bold">•</span>
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-[#0B121F] rounded-2xl p-8 shadow-md text-white text-center">
                                <h3 className="text-xl font-bold mb-4 uppercase tracking-wide text-[#B70126]">
                                    {t('inPersonCourses.course1.costTitle')}
                                </h3>
                                <p className="text-2xl font-bold">
                                    {t('inPersonCourses.course1.cost')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-200 my-16" />

                {/* Course 2 */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-black uppercase mb-4" style={{ fontFamily: 'var(--font-bebas)' }}>
                            {t('inPersonCourses.course2.title')}
                        </h2>
                        <p className="text-xl text-[#B70126] font-semibold">
                            {t('inPersonCourses.course2.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Theory */}
                        <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
                            <h3 className="text-xl font-bold text-black mb-6 uppercase tracking-wide">
                                {t('inPersonCourses.course2.theoryTitle')}
                            </h3>
                            <ul className="space-y-3">
                                {(t('inPersonCourses.course2.theoryItems') as unknown as string[]).map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-[#B70126] font-bold">•</span>
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Practice & Cost */}
                        <div className="space-y-8">
                            <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
                                <h3 className="text-xl font-bold text-black mb-6 uppercase tracking-wide">
                                    {t('inPersonCourses.course2.practiceTitle')}
                                </h3>
                                <ul className="space-y-3">
                                    {(t('inPersonCourses.course2.practiceItems') as unknown as string[]).map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="text-[#B70126] font-bold">•</span>
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-[#0B121F] rounded-2xl p-8 shadow-md text-white text-center">
                                <h3 className="text-xl font-bold mb-4 uppercase tracking-wide text-[#B70126]">
                                    {t('inPersonCourses.course2.costTitle')}
                                </h3>
                                <p className="text-2xl font-bold">
                                    {t('inPersonCourses.course2.cost')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-gray-50 rounded-2xl p-8 text-center mt-12">
                    <h3 className="text-3xl font-bold text-black uppercase mb-4" style={{ fontFamily: 'var(--font-bebas)' }}>
                        {t('contact.title')}
                    </h3>
                    <p className="text-lg text-gray-700 mb-6">
                        {t('contact.subtitle')}
                    </p>
                    <a
                        href="mailto:contacto@ivanivanovich.com"
                        className="inline-block text-2xl font-bold text-[#B70126] hover:text-[#D9012D] transition-colors"
                    >
                        contacto@ivanivanovich.com
                    </a>
                </div>

            </div>
        </div>
    );
}
