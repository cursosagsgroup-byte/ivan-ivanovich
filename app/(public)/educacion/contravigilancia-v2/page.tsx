'use client';

import Image from 'next/image';
import { ChevronDown, Play, CheckCircle2, BadgeCheck, Globe, Award, Clock } from 'lucide-react';
import { useState } from 'react';
import PublicNavbar from '@/components/public/PublicNavbar';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { useTranslation } from '@/hooks/useTranslation';
import ContravigilanciaLandingCTA from '@/components/landing/ContravigilanciaLandingCTA';

export default function ContravigilanciaV2Page() {
    const { t } = useTranslation();

    return (
        <div className="bg-white min-h-screen font-sans">
            <PublicNavbar />

            {/* HERO SECTION (Full width, dark style like PE) */}
            <div data-theme="dark" className="relative min-h-[90vh] md:min-h-screen w-full flex items-center justify-center overflow-hidden bg-black pt-20">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                {/* Spotlight Animation */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.8)_0%,transparent_60%)] animate-spotlight blur-2xl"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white pt-10 pb-20">
                    <div className="animate-fade-in-up">
                        <h2 className="text-white font-bold text-lg md:text-2xl uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                            CURSO EN LÍNEA
                        </h2>
                        
                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-none mb-6" style={{ fontFamily: 'var(--font-bebas)' }}>
                            <span className="text-white">Contravigilancia para</span><br />
                            <span className="text-[#B70126]">Protección Ejecutiva</span>
                        </h1>
                        
                        <p className="text-lg md:text-3xl font-medium max-w-4xl mx-auto mb-10 text-gray-200 px-2 leading-tight md:leading-normal">
                            Aprende a detectar vigilancia hostil antes de un ataque.
                        </p>
 
                        <div className="flex justify-center px-4">
                            <ContravigilanciaLandingCTA
                                className="bg-[#B70126] hover:bg-[#90011E] text-white text-lg md:text-xl font-bold py-3 md:py-4 px-8 md:px-12 rounded-full transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(183,1,38,0.5)] uppercase flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer group"
                                style={{ fontFamily: 'var(--font-montserrat)' }}
                            >
                                Iniciar curso <span className="text-2xl transition-transform duration-300 group-hover:translate-x-2">→</span>
                            </ContravigilanciaLandingCTA>
                        </div>
                        <p className="mt-4 text-white font-bold uppercase tracking-widest text-sm md:text-base animate-pulse" style={{ fontFamily: 'var(--font-bebas)' }}>
                            💳 Paga a meses sin intereses
                        </p>
                        <p className="mt-6 text-sm md:text-base text-gray-400 max-w-2xl mx-auto px-4 italic">
                            &quot;Aprenderás a detectar la vigilancia hostil, incluso cuando los criminales creen que están ocultos.&quot;
                        </p>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA: Full Width Sections */}
            <div className="space-y-16 py-12 md:py-24">
                
                {/* Intro Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black text-black uppercase leading-none mb-6 md:mb-8" style={{ fontFamily: 'var(--font-bebas)' }}>
                            {t('counterSurveillance.introTitle')}
                        </h2>
                        <div className="space-y-6 text-base md:text-lg text-gray-700 leading-relaxed">
                            <p>
                                {t('counterSurveillance.introDescription1')} <span className="font-bold text-black">Aprenderás a detectar la vigilancia hostil</span>, incluso cuando los criminales creen que están ocultos.
                            </p>
                            <div className="bg-gray-50 border-l-4 border-[#B70126] p-4 md:p-6 my-6 md:my-8">
                                <p className="text-gray-900 font-bold text-lg md:text-xl italic">
                                    &quot;La mayoría de los equipos seguridad solo reaccionan cuando el ataque ya empezó. Los <span className="text-[#B70126]">operadores de élite</span> detectan la amenaza antes de que ocurra.&quot;
                                </p>
                            </div>
                            <p className="font-bold text-black text-xl">
                                {t('counterSurveillance.introDescription3')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Video Section */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5" style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                        <iframe
                            src="https://player.vimeo.com/video/954253693"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                            title="Introducción al Curso"
                        />
                    </div>
                </section>

                {/* What You Will Learn (Dark theme style from PE) */}
                <section className="bg-gray-900 py-16 md:py-24 text-white relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10 md:mb-16">
                            <span className="text-[#B70126] font-bold tracking-widest uppercase text-sm md:text-base">Temario del Curso</span>
                            <h2 className="text-3xl md:text-6xl font-black uppercase mt-2" style={{ fontFamily: 'var(--font-bebas)' }}>
                                {t('counterSurveillance.whatYouWillLearnTitle')}
                            </h2>
                            <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-base md:text-lg px-2">
                                Desarrolla la capacidad de identificar riesgos antes de que se conviertan en ataques.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                            {(t('counterSurveillance.whatYouWillLearnItems') as unknown as string[]).map((item, index) => (
                                <div key={index} className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 hover:border-[#B70126] transition-all hover:bg-gray-700 group flex items-start gap-4">
                                    <div className="bg-[#B70126]/20 p-2.5 rounded-lg group-hover:bg-[#B70126] transition-colors shrink-0">
                                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-[#B70126] group-hover:text-white" />
                                    </div>
                                    <p className="text-base md:text-lg font-medium text-gray-200 group-hover:text-white pt-1">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Modules Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-6xl font-black text-black uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
                            <span className="text-[#B70126]">Temario</span> de Especialización
                        </h2>
                    </div>
                    <div className="max-w-5xl mx-auto space-y-6">
                        {(t('counterSurveillance.modules') as unknown as string[]).map((module, index) => (
                            <ModuleItem key={index} num={`0${index+1}`} title={module} duration="" />
                        ))}
                    </div>
                </section>

                {/* HORIZONTAL PURCHASE SECTION (Exact scale match for horizontal bar) */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 bg-white">
                            <div className="relative aspect-video md:aspect-auto md:min-h-full lg:col-span-5 bg-gray-50">
                                <Image
                                    src="/curso-contravigilancia.jpg"
                                    alt="Curso Contravigilancia"
                                    fill
                                    className="object-cover object-center transition-transform duration-700 hover:scale-105"
                                />
                                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-3 rounded-lg flex items-center gap-2 border border-white/20">
                                    <Play className="w-3 h-3 text-[#B70126] fill-[#B70126]" /> CURSO ONLINE
                                </div>
                            </div>
                            
                            <div className="p-6 lg:p-10 flex flex-col justify-center lg:col-span-7 text-center md:text-left">
                                <div className="mb-6">
                                    <div className="text-gray-400 font-medium line-through text-sm md:text-base">
                                        {t('counterSurveillance.originalPrice')}
                                    </div>
                                    <div className="text-3xl md:text-4xl font-black text-[#B70126] leading-none mt-1" style={{ fontFamily: 'var(--font-bebas)' }}>
                                        {t('counterSurveillance.currentPrice')}
                                    </div>
                                    <div className="mt-3 inline-flex items-center gap-1.5 bg-[#B70126]/5 text-[#B70126] font-bold py-1 px-3 rounded-full text-[10px] uppercase tracking-wider border border-[#B70126]/10">
                                        <Award className="w-3 h-3" /> Certificación WSO
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '1px' }}>
                                        <AddToCartButton
                                            course={{
                                                id: 'cmio13v7u000164w1bhkqj8ej',
                                                title: 'Contravigilancia Para Protección Ejecutiva',
                                                price: 2500,
                                                image: '/curso-contravigilancia.jpg'
                                            }}
                                            label={t('counterSurveillance.buyButton')}
                                            className="w-full md:w-auto px-8 py-3 rounded-xl text-base md:text-lg font-bold uppercase shadow-[0_10px_20px_rgba(183,1,38,0.2)] hover:shadow-[0_15px_30px_rgba(183,1,38,0.3)] transition-all transform hover:-translate-y-0.5 bg-[#B70126] hover:bg-[#90011E] text-white"
                                        />
                                    </div>
                                    <p className="text-[#B70126] font-bold uppercase text-[10px] tracking-widest text-center md:text-left">
                                        💳 Paga a meses sin intereses
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600 font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                                            <Globe className="w-3.5 h-3.5 text-[#B70126]" />
                                        </div>
                                        <div>
                                            <div className="text-[9px] text-gray-400 uppercase tracking-widest">Formato</div>
                                            <div className="font-bold text-black">100% Online</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                                            <Clock className="w-3.5 h-3.5 text-[#B70126]" />
                                        </div>
                                        <div>
                                            <div className="text-[9px] text-gray-400 uppercase tracking-widest">Acceso</div>
                                            <div className="font-bold text-black">De por vida</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                                            <BadgeCheck className="w-3.5 h-3.5 text-[#B70126]" />
                                        </div>
                                        <div>
                                            <div className="text-[9px] text-gray-400 uppercase tracking-widest">Certificado</div>
                                            <div className="font-bold text-black">Incluido</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="space-y-24">
                    {/* ARMADA ESPAÑOLA (Styled like PE) */}
                    <section className="bg-gray-50 py-16 md:py-24 border-y border-gray-100">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                                <div className="text-center lg:text-left">
                                    <h3 className="text-[#B70126] font-bold text-base md:text-lg uppercase tracking-wide mb-2">{t('home.armadaLabel')}</h3>
                                    <h2 className="text-3xl md:text-5xl font-black text-black uppercase leading-none mb-6 md:mb-8" style={{ fontFamily: 'var(--font-bebas)' }}>
                                        {t('home.armadaTitle')}
                                    </h2>
                                    <p className="text-gray-600 mb-10 text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                        Fuimos el <span className="font-bold text-black">primer equipo civil</span> en capacitar a la prestigiosa <span className="text-[#B70126] font-bold">Infantería de Marina de España</span> en técnicas avanzadas de protección.
                                    </p>
                                    <div className="flex gap-6 justify-center lg:justify-start">
                                        <div className="bg-white p-4 rounded-2xl shadow-xl w-24 h-24 relative flex items-center justify-center grayscale hover:grayscale-0 transition-all border border-gray-100">
                                            <Image src="/escudo-armada-1.png" alt="Escudo Armada 1" fill className="p-4 object-contain" />
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl shadow-xl w-24 h-24 relative flex items-center justify-center grayscale hover:grayscale-0 transition-all border border-gray-100">
                                            <Image src="/escudo-armada-2.png" alt="Escudo Armada 2" fill className="p-4 object-contain" />
                                        </div>
                                    </div>
                                </div>
                                <div className="relative h-[400px] md:h-[600px] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] order-first lg:order-last">
                                    <Image src="/photo-armada-square.jpg" alt="Armada" fill className="object-cover transition-transform duration-1000 hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* COSTA RICA (Styled like PE) */}
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <div className="relative h-[400px] md:h-[600px] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)]">
                                <Image src="/photo-costarica-square.jpg" alt="Costa Rica" fill className="object-cover transition-transform duration-1000 hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                            </div>
                            <div className="text-center lg:text-left">
                                <h3 className="text-[#B70126] font-bold text-base md:text-lg uppercase tracking-wide mb-2">{t('home.costaRicaLabel')}</h3>
                                <h2 className="text-3xl md:text-5xl font-black text-black uppercase leading-none mb-6 md:mb-8" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {t('home.costaRicaTitle')}
                                </h2>
                                <p className="text-gray-600 text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    Entrenamiento especializado para la <span className="font-bold text-black">Unidad de Protección Presidencial</span>, elevando los estándares de seguridad nacional.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Top 9 Mundial e ISJ (Styled like PE/ATM but with PE sizes) */}
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                            <div className="bg-black text-white rounded-[2.5rem] overflow-hidden p-10 md:p-14 flex flex-col justify-between h-full group transform transition duration-500 hover:shadow-2xl hover:shadow-[#B70126]/10 border border-white/5 relative">
                                <div className="relative z-10">
                                    <h3 className="text-[#B70126] font-bold text-base uppercase tracking-widest mb-4">{t('home.top9Label')}</h3>
                                    <h2 className="text-3xl md:text-5xl font-black uppercase leading-none mb-8" style={{ fontFamily: 'var(--font-bebas)' }}>{t('home.top9Title')}</h2>
                                    <p className="text-gray-400 font-medium mb-10 text-base md:text-lg leading-relaxed italic border-l-3 border-[#B70126] pl-6">{t('home.top9Description')}</p>
                                </div>
                                <div className="relative h-80 w-full rounded-2xl overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity ring-1 ring-white/10 z-10">
                                    <Image src="/photo-top9-square.png" alt="Top 9" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                                </div>
                            </div>

                            <div className="bg-black text-white rounded-[2.5rem] overflow-hidden p-10 md:p-14 flex flex-col justify-between h-full group transform transition duration-500 hover:shadow-2xl hover:shadow-[#B70126]/10 border border-white/5 relative">
                                <div className="relative z-10">
                                    <h3 className="text-[#B70126] font-bold text-base uppercase tracking-widest mb-4">{t('home.isjLabel')}</h3>
                                    <h2 className="text-3xl md:text-5xl font-black uppercase leading-none mb-8" style={{ fontFamily: 'var(--font-bebas)' }}>{t('home.isjTitle')}</h2>
                                    <p className="text-gray-400 font-medium mb-10 text-base md:text-lg leading-relaxed italic border-l-3 border-[#B70126] pl-6 text-white/90">
                                        &quot;Iván Ivanovich ha sido nombrado entre los <span className="font-bold text-white">30 líderes más influyentes</span> de la seguridad global.&quot;
                                    </p>
                                </div>
                                <div className="relative h-80 w-full rounded-2xl overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity ring-1 ring-white/10 z-10">
                                    <Image src="/images/isj-ivan.png" alt="ISJ" fill className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-700" />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            
            {/* INSTRUCTOR SECTION (Dark PE Style) */}
            <section data-theme="dark" className="bg-[#0f172a] py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden bg-black/50 border border-white/10">
                        <div className="relative h-[400px] lg:h-auto min-h-[300px] lg:min-h-[500px]">
                            <Image
                                src="/images/landing-pe/action-5.jpg" 
                                alt="Ivan Ivanovich"
                                fill
                                className="object-cover object-top opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-transparent to-transparent lg:hidden"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent lg:hidden"></div>
                        </div>
                        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center text-white">
                            <h3 className="text-[#B70126] font-bold text-sm md:text-base uppercase tracking-widest mb-2">Instructor Master</h3>
                            <h2 className="text-4xl md:text-5xl font-black uppercase mb-8" style={{ fontFamily: 'var(--font-bebas)' }}>
                                Iván Ivanovich
                            </h2>
                            <ul className="space-y-4 md:space-y-6 text-gray-300 text-sm md:text-base">
                                <li className="flex gap-4">
                                    <Award className="w-5 h-5 md:w-6 md:h-6 text-[#B70126] flex-shrink-0" />
                                    <span>Presidente de <strong>WSO</strong> – Worldwide Security Options</span>
                                </li>
                                <li className="flex gap-4">
                                    <Award className="w-5 h-5 md:w-6 md:h-6 text-[#B70126] flex-shrink-0" />
                                    <span>Reconocido entre los <strong>30 profesionales más influyentes del mundo</strong> (International Security Journal)</span>
                                </li>
                                <li className="flex gap-4">
                                    <Award className="w-5 h-5 md:w-6 md:h-6 text-[#B70126] flex-shrink-0" />
                                    <span>Fundador de la Ivan Ivanovich Executive Protection Academy, entre las <strong>9 mejores del mundo</strong> (EP Wired, USA)</span>
                                </li>
                                <li className="flex gap-4">
                                    <Award className="w-5 h-5 md:w-6 md:h-6 text-[#B70126] flex-shrink-0" />
                                    <span>Autor del bestseller <strong>&quot;Protección Ejecutiva en el Siglo XXI&quot;</strong></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}

// Helper Components
function ModuleItem({ num, title, duration }: { num: string, title: string, duration?: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 md:p-6 transition-colors text-left"
            >
                <div className="flex items-center gap-4">
                    <div className="text-[#B70126] font-black text-xl opacity-50 font-[var(--font-bebas)]">{num}</div>
                    <span className="font-bold text-gray-900 text-base md:text-lg">{title}</span>
                </div>
                <div className="flex items-center gap-4">
                    {duration && <span className="hidden leading-none sm:block text-sm text-gray-400 font-medium">{duration}</span>}
                    <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition-transform ${isOpen ? 'rotate-180 bg-[#B70126]/10 text-[#B70126]' : 'text-gray-400'}`}>
                        <ChevronDown className="w-5 h-5" />
                    </div>
                </div>
            </button>
            {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-4 bg-white p-3 rounded-lg border border-gray-100">
                        <Play className="w-4 h-4 text-[#B70126]" />
                        <span className="font-medium">Video de instrucción detallada</span>
                    </div>
                </div>
            )}
        </div>
    );
}
