'use client';

import HeroSection from '@/components/public/HeroSection';
import Link from 'next/link';
import BlogCarousel from '@/components/BlogCarousel';
import ContactSection from '@/components/public/ContactSection';
import { useTranslation } from '@/hooks/useTranslation';

export default function LandingPage() {
    const { t } = useTranslation();

    return (
        <div className="bg-white min-h-screen pt-24">
            {/* Hero Section */}
            <div className="mx-auto pt-24 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <HeroSection />
            </div>

            {/* Content Container */}
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Ivan Ivanovich Section - White Background */}
                <section className="bg-white py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl">
                        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
                            {/* Left Column - Image */}
                            <div className="lg:pr-4">
                                <div className="relative overflow-hidden rounded-2xl aspect-square">
                                    <img src="/ivan-photo.jpg" alt="Ivan Ivanovich" className="w-full h-full object-cover" />
                                </div>
                            </div>

                            {/* Right Column - Content */}
                            <div>
                                <h2 className="text-3xl md:text-5xl font-bold text-black uppercase mb-6" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {t('home.ivanTitle')}
                                </h2>
                                <div className="space-y-6 text-base leading-7 text-gray-700">
                                    <p className="text-lg font-semibold text-black">
                                        {t('home.ivanSubtitle')}
                                    </p>
                                    <p>{t('home.ivanDescription1')}</p>
                                    <p>{t('home.ivanDescription2')}</p>
                                    <p>{t('home.ivanDescription3')}</p>
                                    <p>{t('home.ivanDescription4')}</p>
                                    <p>{t('home.ivanDescription5')}</p>
                                    <p>{t('home.ivanDescription6')}</p>
                                    <div className="mt-8">
                                        <Link
                                            href="/nuestro-equipo"
                                            className="text-[#B70126] hover:text-[#D9012D] font-bold text-lg"
                                        >
                                            {t('home.readMore')} →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Armada Española Section */}
                <section className="bg-gray-100 py-16 rounded-[30px] mb-8">
                    <div className="mx-auto max-w-7xl px-6 lg:px-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Left: Content */}
                            <div>
                                <p className="text-[#B70126] font-bold text-sm uppercase mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                                    {t('home.armadaLabel')}
                                </p>
                                <h2 className="text-3xl md:text-5xl font-bold text-black uppercase mb-6" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {t('home.armadaTitle')}
                                </h2>
                                <p className="text-gray-600 text-lg mb-6">
                                    {t('home.armadaDescription')}
                                </p>
                                <div className="flex gap-6 justify-center lg:justify-start">
                                    <img src="/escudo-armada-1.png" alt="Escudo Armada 1" className="h-24 w-auto" />
                                    <img src="/escudo-armada-2.png" alt="Escudo Armada 2" className="h-24 w-auto" />
                                </div>
                            </div>
                            {/* Right: Image */}
                            <div className="relative aspect-square w-full max-w-md mx-auto lg:w-[80%] overflow-hidden rounded-2xl">
                                <img src="/photo-armada-square.jpg" alt="Armada Española Training" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Unidad de Protección Presidencial - Costa Rica */}
                <section className="bg-gray-100 py-16 rounded-[30px] mb-8">
                    <div className="mx-auto max-w-7xl px-6 lg:px-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Left: Content */}
                            <div>
                                {/* Mobile Layout (< md) */}
                                <div className="block md:hidden">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="pr-4">
                                            <p className="text-[#B70126] font-bold text-sm uppercase mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                                                {t('home.costaRicaLabel')}
                                            </p>
                                            <h2 className="text-3xl font-bold text-black uppercase" style={{ fontFamily: 'var(--font-bebas)' }}>
                                                {t('home.costaRicaTitle')}
                                            </h2>
                                        </div>
                                        <img src="/escudo-costarica.png" alt="Escudo Costa Rica" className="h-20 w-auto flex-shrink-0" />
                                    </div>
                                    <p className="text-gray-600 text-base">
                                        {t('home.costaRicaDescription')}
                                    </p>
                                </div>

                                {/* Desktop Layout (>= md) */}
                                <div className="hidden md:block">
                                    <p className="text-[#B70126] font-bold text-sm uppercase mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                                        {t('home.costaRicaLabel')}
                                    </p>
                                    <h2 className="text-5xl font-bold text-black uppercase mb-6" style={{ fontFamily: 'var(--font-bebas)' }}>
                                        {t('home.costaRicaTitle')}
                                    </h2>
                                    <div className="flex items-start gap-6 mb-6">
                                        <img src="/escudo-costarica.png" alt="Escudo Costa Rica" className="h-24 w-auto flex-shrink-0" />
                                        <p className="text-gray-600 text-base">
                                            {t('home.costaRicaDescription')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Right: Image */}
                            <div className="relative aspect-square w-full max-w-md mx-auto lg:w-[80%] overflow-hidden rounded-2xl">
                                <img src="/photo-costarica-square.jpg" alt="Costa Rica Training" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* TOP 9 MUNDIAL */}
                <section className="bg-gray-100 py-16 rounded-[30px] mb-8">
                    <div className="mx-auto max-w-7xl px-6 lg:px-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                            <div className="relative aspect-square w-full max-w-md mx-auto lg:w-[80%] overflow-hidden rounded-2xl">
                                <img src="/photo-top9-square.png" alt="TOP 9 Mundial" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ISJ Influencer 2025 Section */}
                <section className="bg-gray-100 py-16 rounded-[30px] mb-8">
                    <div className="mx-auto max-w-7xl px-6 lg:px-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Left: Content */}
                            <div>
                                <p className="text-[#B70126] font-bold text-sm uppercase mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                                    {t('home.isjLabel')}
                                </p>
                                <h2 className="text-5xl font-bold text-black uppercase mb-6" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {t('home.isjTitle')}
                                </h2 >
                                <p className="text-gray-600 text-lg">
                                    {t('home.isjDescription')}
                                </p>
                            </div>
                            {/* Right: Image */}
                            <div className="relative aspect-square w-full max-w-md mx-auto lg:w-[80%] overflow-hidden rounded-2xl">
                                <img src="/images/isj-influencer-2025.jpg" alt="ISJ Influencer 2025" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Blog Section - White */}
                <section className="bg-white py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl">
                        <div className="mx-auto max-w-2xl text-center mb-16">
                            <h2 className="text-4xl font-black tracking-tight text-black sm:text-5xl mb-6 uppercase" style={{
                                fontFamily: 'Montserrat, sans-serif'
                            }}>
                                {t('home.blogTitle')}
                            </h2>
                        </div>

                        <div className="mx-auto mt-16">
                            <BlogCarousel />
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <ContactSection />
            </div>
        </div>
    );
}
