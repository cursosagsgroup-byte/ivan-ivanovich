'use client';

import Image from 'next/image';
import { Check, ChevronDown, Play, Clock, List, CheckCircle, UploadCloud, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import PublicNavbar from '@/components/public/PublicNavbar';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { useTranslation } from '@/hooks/useTranslation';

export default function ContravigilanciaPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-white pt-24">

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
                                <div className="inline-block bg-[#B70126] rounded-full px-6 py-2 mb-4">
                                    <span className="text-white font-bold text-sm lg:text-base uppercase tracking-wide" style={{ fontFamily: 'var(--font-montserrat)' }}>
                                        {t('counterSurveillance.heroSubtitle')}
                                    </span>
                                </div>
                                <h1 className="text-4xl lg:text-6xl xl:text-7xl font-normal text-white uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {t('counterSurveillance.heroTitle')}
                                </h1>
                            </div>

                            {/* Right Column: Image */}
                            <div className="flex justify-center lg:justify-end w-full mt-2 lg:mt-0">
                                <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border-4 border-white shadow-2xl lg:h-[28vh] lg:w-auto">
                                    <Image
                                        src="/curso-contravigilancia.jpg"
                                        alt="Ivan Ivanovich"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="mx-auto max-w-[95%] lg:max-w-[90%] px-4 lg:px-8 py-8 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Content */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Intro Text */}
                        <div className="space-y-4">
                            <h2 className="text-[35px] font-bold text-black uppercase leading-tight" style={{ fontFamily: 'var(--font-bebas)' }}>
                                {t('counterSurveillance.introTitle')}
                            </h2>
                            <p className="text-lg text-gray-700">
                                {t('counterSurveillance.introDescription1')}
                            </p>
                            <p className="text-lg text-gray-700">
                                {t('counterSurveillance.introDescription2')}
                            </p>
                            <p className="text-lg text-gray-700">
                                {t('counterSurveillance.introDescription3')}
                            </p>
                        </div>

                        {/* Video Section */}
                        <div className="relative w-full rounded-2xl overflow-hidden shadow-lg" style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                            <iframe
                                src="https://player.vimeo.com/video/954253693"
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                title="Introducción al Curso"
                            />
                        </div>

                        {/* Instructor Bio */}
                        <div className="prose max-w-none text-gray-700">
                            <h3 className="text-[35px] font-bold text-black uppercase mb-4" style={{ fontFamily: 'var(--font-bebas)' }}>
                                IVAN IVANOVICH
                            </h3>
                            <p>
                                Presidente del Board of Directors de WSO-Worldwide Security Options. Experto global en seguridad con más de 30 años de experiencia en escenarios de alto riesgo en Europa, América y Africa.
                            </p>
                            <p>
                                El primer civil en capacitar en protección ejecutiva a la Infantería de Marina Española y a la Unidad de Protección Presidencial de Costa Rica. Fundador de la Academia Ivan Ivanovich, reconocida entre las 9 mejores escuelas de protección ejecutiva del mundo por EP Wired (EE. UU.).
                            </p>
                            <p>
                                Autor del bestseller <em>Protección Ejecutiva en el Siglo XXI</em>, #1 en Amazon México. Promotor de un enfoque preventivo, ético e innovador, ha transformado los estándares de la protección ejecutiva moderna a nivel global. Miembro del consejo directivo de la International Protective Security Board (IPSB), organización líder en protección ejecutiva globalmente.
                            </p>
                        </div>

                        {/* Armada Española Section */}
                        <section className="bg-gray-100 py-16 rounded-[30px] mb-8">
                            <div className="mx-auto max-w-7xl px-4 lg:px-12">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                                    <div>
                                        <p className="text-[#B70126] font-bold text-sm uppercase mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                                            {t('home.armadaLabel')}
                                        </p>
                                        <h2 className="text-5xl font-bold text-black uppercase mb-6" style={{ fontFamily: 'var(--font-bebas)' }}>
                                            {t('home.armadaTitle')}
                                        </h2>
                                        <p className="text-gray-600 text-lg mb-6">
                                            {t('home.armadaDescription')}
                                        </p>
                                        <div className="flex gap-6">
                                            <img src="/escudo-armada-1.png" alt="Escudo Armada 1" className="h-24 w-auto" />
                                            <img src="/escudo-armada-2.png" alt="Escudo Armada 2" className="h-24 w-auto" />
                                        </div>
                                    </div>
                                    <div className="relative aspect-square w-[80%] mx-auto overflow-hidden rounded-2xl">
                                        <img src="/photo-armada-square.jpg" alt="Armada Española Training" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Unidad de Protección Presidencial - Costa Rica */}
                        <section className="bg-gray-100 py-16 rounded-[30px] mb-8">
                            <div className="mx-auto max-w-7xl px-4 lg:px-12">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                                    <div>
                                        <p className="text-[#B70126] font-bold text-sm uppercase mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                                            {t('home.costaRicaLabel')}
                                        </p>
                                        <h2 className="text-3xl lg:text-4xl font-bold text-black uppercase mb-6 leading-tight" style={{ fontFamily: 'var(--font-bebas)' }}>
                                            {t('home.costaRicaTitle')}
                                        </h2>

                                        <p className="text-gray-600 text-base">
                                            {t('home.costaRicaDescription')}
                                        </p>
                                    </div>
                                    <div className="relative aspect-square w-[80%] mx-auto overflow-hidden rounded-2xl">
                                        <img src="/photo-costarica-square.jpg" alt="Costa Rica Training" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* TOP 9 MUNDIAL */}
                        <section className="bg-gray-100 py-16 rounded-[30px] mb-16">
                            <div className="mx-auto max-w-7xl px-4 lg:px-12">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                                    <div>
                                        <p className="text-[#B70126] font-bold text-sm uppercase mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                                            {t('home.top9Label')}
                                        </p>
                                        <h2 className="text-6xl font-bold text-black uppercase mb-6" style={{ fontFamily: 'var(--font-bebas)' }}>
                                            {t('home.top9Title')}
                                        </h2>
                                        <p className="text-gray-600 text-lg">
                                            {t('home.top9Description')}
                                        </p>
                                    </div>
                                    <div className="relative aspect-square w-[80%] mx-auto overflow-hidden rounded-2xl">
                                        <img src="/photo-top9-square.png" alt="TOP 9 Mundial" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                        </section>




                        {/* ISJ Influencer 2025 Section */}
                        <section className="bg-gray-100 py-16 rounded-[30px] mb-16">
                            <div className="mx-auto max-w-7xl px-4 lg:px-12">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                                    {/* Left: Content */}
                                    <div>
                                        <p className="text-[#B70126] font-bold text-sm uppercase mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                                            {t('home.isjLabel')}
                                        </p>
                                        <h2 className="text-5xl font-bold text-black uppercase mb-6" style={{ fontFamily: 'var(--font-bebas)' }}>
                                            {t('home.isjTitle')}
                                        </h2>
                                        <p className="text-gray-600 text-lg">
                                            {t('home.isjDescription')}
                                        </p>
                                    </div>
                                    {/* Right: Image */}
                                    <div className="relative aspect-square w-[80%] mx-auto overflow-hidden rounded-2xl">
                                        <img src="/images/isj-ivan.png" alt="ISJ Influencer 2025" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* What you will learn */}
                        <section>
                            <h2 className="text-[35px] font-bold text-black mb-8 uppercase" style={{ fontFamily: 'var(--font-bebas)' }}>
                                {t('counterSurveillance.whatYouWillLearnTitle')}
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {(t('counterSurveillance.whatYouWillLearnItems') as unknown as string[]).map((item, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-[#B70126] mt-1 flex-shrink-0" />
                                        <p className="text-gray-700">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Course Content / Modules */}
                        <section>
                            <h2 className="text-[35px] font-bold text-black mb-8 uppercase" style={{ fontFamily: 'var(--font-bebas)' }}>
                                {t('counterSurveillance.modulesTitle')}
                            </h2>
                            <div className="space-y-4">
                                {(t('counterSurveillance.modules') as unknown as string[]).map((module, index) => (
                                    <ModuleItem key={index} title={module} duration="" />
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                            <div className="relative w-full aspect-video mb-6 rounded-lg overflow-hidden">
                                <Image
                                    src="/curso-contravigilancia.jpg"
                                    alt="Curso Contravigilancia"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="text-3xl font-bold text-[#B70126] mb-2 text-center">
                                {t('counterSurveillance.currentPrice')}
                            </div>
                            <div className="text-gray-500 line-through text-center mb-6">
                                {t('counterSurveillance.originalPrice')}
                            </div>

                            <AddToCartButton
                                course={{
                                    id: 'contravigilancia-course', // TODO: Verify real ID if needed
                                    title: 'CURSO DE CONTRAVIGILANCIA EN PROTECCIÓN EJECUTIVA',
                                    price: 2500,
                                    image: '/curso-contravigilancia.jpg'
                                }}
                                label={t('counterSurveillance.buyButton')}
                                className="w-full py-4 rounded-lg text-base shadow-lg"
                            />

                            <div className="space-y-4 text-sm text-gray-600 mt-6">
                                <div className="flex justify-between border-b pb-2">
                                    <span>Duración:</span>
                                    <span className="font-bold">Online</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span>Acceso:</span>
                                    <span className="font-bold">De por vida</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span>Certificado:</span>
                                    <span className="font-bold">Sí</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* End of content */}
        </div>
    );
}

function ModuleItem({ title, duration }: { title: string, duration?: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
                <div className="flex items-center gap-3">
                    <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    <span className="font-medium text-gray-900">{title}</span>
                </div>
                {duration && <span className="text-sm text-gray-500">{duration}</span>}
            </button>
            {isOpen && (
                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Play className="w-4 h-4" />
                        <span>Contenido del módulo...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
