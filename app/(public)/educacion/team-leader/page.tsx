'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Check, ChevronDown, Play, Clock, List, CheckCircle, UploadCloud, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import PublicNavbar from '@/components/public/PublicNavbar';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { StructuredData } from '@/components/seo/StructuredData';
import { teamLeaderSchema } from './metadata';

import { useTranslation } from '@/hooks/useTranslation';

export default function TeamLeaderCoursePage() {
    const { t } = useTranslation();
    return (
        <>
            <StructuredData data={teamLeaderSchema} />
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
                                            {t('teamLeader.heroSubtitle')}
                                        </span>
                                    </div>
                                    <h1 className="text-5xl lg:text-7xl xl:text-8xl font-normal text-white uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
                                        {t('teamLeader.heroTitle').split('\n').map((line: string, i: number) => (
                                            <span key={i} className="block">{line}</span>
                                        ))}
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

                {/* Main Content Grid */}
                <div className="mx-auto max-w-[95%] lg:max-w-[90%] px-4 lg:px-8 py-8 lg:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Left Column: Content */}
                        <div className="lg:col-span-2 space-y-12">

                            {/* Intro Text */}
                            <div className="space-y-4">
                                <h2 className="text-[35px] font-bold text-black uppercase leading-tight" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {t('teamLeader.introTitle')}
                                </h2>
                                <p className="text-lg text-gray-700">
                                    {t('teamLeader.introDescription1')}
                                </p>
                                <p className="text-lg text-gray-700">
                                    {t('teamLeader.introDescription2')}
                                </p>
                            </div>

                            {/* Video Section */}
                            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg" style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                                <iframe
                                    src="https://player.vimeo.com/video/786635929?badge=0&autopause=0&player_id=0&app_id=58479"
                                    frameBorder="0"
                                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                    title="Introducción al Curso"
                                />
                            </div>

                            {/* Animated Brand Strip */}
                            <div className="relative overflow-hidden py-8">
                                <div className="flex animate-scroll-right whitespace-nowrap">
                                    <Image src="/brands-strip.png" alt="Brands" width={1200} height={80} className="h-16 w-auto inline-block" />
                                    <Image src="/brands-strip.png" alt="Brands" width={1200} height={80} className="h-16 w-auto inline-block" />
                                    <Image src="/brands-strip.png" alt="Brands" width={1200} height={80} className="h-16 w-auto inline-block" />
                                </div>
                            </div>

                            {/* Instructor Bio */}
                            <div className="prose max-w-none text-gray-700">
                                <h3 className="text-[35px] font-bold text-black uppercase mb-4" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {t('home.ivanTitle')}
                                </h3>
                                <p>
                                    {t('home.ivanSubtitle')}. {t('home.ivanDescription1')}
                                </p>
                                <p>
                                    {t('home.ivanDescription2')} {t('home.ivanDescription3')}
                                </p>
                                <p>
                                    {t('home.ivanDescription4')} {t('home.ivanDescription5')}
                                </p>
                            </div>

                            {/* Armada Española Section */}
                            <section className="bg-gray-100 py-16 rounded-[30px] mb-8">
                                <div className="mx-auto max-w-7xl px-4 lg:px-12">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                                        {/* Left: Content */}
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
                                        {/* Right: Image */}
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
                                        {/* Left: Content */}
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
                                        {/* Right: Image */}
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
                                        {/* Left: Content */}
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
                                        {/* Right: Image */}
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

                            {/* LO QUE OBTENDRÁS AL ADQUIRIR EL CURSO */}
                            <section className="mb-16">
                                <div className="text-center mb-12">
                                    <h2 className="text-5xl lg:text-6xl font-bold text-black uppercase mb-4 leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
                                        {t('teamLeader.whatYouWillGetTitle')}
                                    </h2>
                                    <p className="text-xl text-gray-700 font-medium" style={{ fontFamily: 'var(--font-montserrat)' }}>
                                        {t('teamLeader.whatYouWillGetSubtitle')}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                    {/* Left Column: Benefits List */}
                                    <div className="bg-gray-100 rounded-[30px] p-8 lg:p-12 space-y-6">
                                        {/* Benefits are mapped from translation array */}
                                        {((t('teamLeader.benefits') as unknown) as string[]).map((level: string, index: number) => {
                                            // Determine icon based on index to match original design roughly
                                            // 0: Clock, 1: List, 2: CheckCircle, 3: UploadCloud, 4: GraduationCap
                                            const icons = [Clock, List, CheckCircle, UploadCloud, GraduationCap];
                                            const Icon = icons[index] || CheckCircle;

                                            return (
                                                <div key={index} className="flex items-start gap-4">
                                                    <div className="bg-[#B70126] rounded-full p-2 mt-1 flex-shrink-0">
                                                        <Icon className="w-5 h-5 text-white" />
                                                    </div>
                                                    <p className="text-lg font-medium text-black">
                                                        {level}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Right Column: Image & Price */}
                                    <div className="flex flex-col items-center text-center">
                                        {/* Mockup Image */}
                                        <div className="relative w-full aspect-[4/3] mb-8">
                                            <img
                                                src="/curso-team-leader-mockup.png"
                                                alt="Curso Team Leader Mockup"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                        {/* Pricing */}
                                        <div className="space-y-2">
                                            <p className="text-lg font-bold text-black uppercase tracking-wide">
                                                {t('teamLeader.priceLabel')}
                                            </p>
                                            <div className="flex flex-col items-center justify-center leading-none">
                                                <span className="text-2xl font-bold text-gray-400 line-through decoration-2 decoration-black mb-2">
                                                    {t('teamLeader.originalPrice')}
                                                </span>
                                                <span className="text-4xl lg:text-5xl font-black text-black border-b-4 border-[#B70126] pb-1 whitespace-nowrap">
                                                    {t('teamLeader.currentPrice')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* What you will learn */}
                            <section>
                                <h2 className="text-[35px] font-bold text-black mb-8 uppercase" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {t('teamLeader.whatYouWillLearnTitle')}
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {((t('teamLeader.whatYouWillLearnItems') as unknown) as string[]).map((item, index) => (
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
                                    {t('teamLeader.modulesTitle')}
                                </h2>
                                <div className="space-y-4">
                                    {((t('teamLeader.modules') as unknown) as { title: string, duration: string }[]).map((mod, index) => (
                                        <ModuleItem key={index} title={mod.title} duration={mod.duration} />
                                    ))}
                                </div>
                            </section>

                            {/* FAQ Section */}
                            <section className="pt-12 border-t border-gray-200">
                                <h2 className="text-[35px] font-bold text-black mb-8 uppercase text-center" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {t('teamLeader.faqTitle')}
                                </h2>
                                <div className="space-y-6">
                                    {((t('teamLeader.faqs') as unknown) as { question: string, answer: string }[]).map((faq, index) => (
                                        <FAQItem
                                            key={index}
                                            question={faq.question}
                                            answer={faq.answer}
                                        />
                                    ))}
                                </div>
                            </section>

                        </div>

                        {/* Right Column: Sticky Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                                <div className="relative w-full aspect-video mb-6 rounded-lg overflow-hidden">
                                    <Image
                                        src="/curso-team-leader.png"
                                        alt="Curso Team Leader"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="text-3xl font-bold text-[#B70126] mb-2 text-center">
                                    {t('teamLeader.currentPrice')}
                                </div>
                                <div className="text-gray-500 line-through text-center mb-6">
                                    {t('teamLeader.originalPrice')}
                                </div>

                                <AddToCartButton
                                    course={{
                                        id: t('teamLeader.buyButton') === 'Buy' ? 'cmiq7oga203zikveg3jbf8p8u' : 'cmio13v7r000064w1fs838sgw',
                                        title: t('teamLeader.buyButton') === 'Buy' ? 'Team Leader in Executive Protection' : 'Team Leader en Protección Ejecutiva',
                                        price: 1900,
                                        image: '/curso-team-leader.png'
                                    }}
                                    label={t('teamLeader.buyButton')}
                                    className="w-full py-4 rounded-lg text-base shadow-lg"
                                />

                                <div className="space-y-4 text-sm text-gray-600 mt-6">
                                    <div className="flex justify-between border-b pb-2">
                                        <span>{t('teamLeader.durationLabel')}</span>
                                        <span className="font-bold">{t('teamLeader.duration')}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span>{t('teamLeader.accessLabel')}</span>
                                        <span className="font-bold">{t('teamLeader.access')}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span>{t('teamLeader.certificateLabel')}</span>
                                        <span className="font-bold">{t('teamLeader.certificate')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* End of content */}
            </div>
        </>
    );
}

function ModuleItem({ title, duration }: { title: string, duration: string }) {
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
                <span className="text-sm text-gray-500">{duration !== "00:00" ? duration : ""}</span>
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

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-b border-gray-200 pb-6 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 w-full text-left group"
            >
                <Play className={`w-3 h-3 text-[#B70126] transition-transform ${isOpen ? 'rotate-90' : ''} flex-shrink-0`} fill="currentColor" />
                <span className="text-xl font-bold text-black uppercase group-hover:text-[#B70126] transition-colors" style={{ fontFamily: 'var(--font-bebas)' }}>
                    {question}
                </span>
            </button>
            {isOpen && (
                <p className="mt-3 pl-6 text-gray-600 leading-relaxed">
                    {answer}
                </p>
            )}
        </div>
    );
}
