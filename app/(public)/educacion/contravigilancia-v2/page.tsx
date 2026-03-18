'use client';

import Image from 'next/image';
import { ChevronDown, Play, CheckCircle2, BadgeCheck, Globe, Award, Clock, AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { useTranslation } from '@/hooks/useTranslation';
import ContravigilanciaLandingCTA from '@/components/landing/ContravigilanciaLandingCTA';
import ExecutiveTrainingSection from '@/components/landing/ExecutiveTrainingSection';
import PersuasionTechniquesSection from '@/components/landing/PersuasionTechniquesSection';

export default function ContravigilanciaV2Page() {
    const { t } = useTranslation();

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* HERO SECTION */}
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

            {/* EXECUTIVE TRAINING SECTION */}
            <ExecutiveTrainingSection />

            {/* PERSUASION TECHNIQUES SECTION */}
            <PersuasionTechniquesSection />

            {/* PROBLEM / SOLUTION SECTION */}
            <section data-theme="light" className="py-12 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="relative h-[400px] md:h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/curso-contravigilancia.jpg"
                                    alt="Curso de Contravigilancia"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-8">
                                    <p className="text-white text-lg font-bold">Curso en Línea</p>
                                    <p className="text-gray-300 text-sm">Certificación WSO</p>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <h3 className="text-[#B70126] font-bold text-base md:text-lg uppercase tracking-wide mb-2">La Realidad Operativa</h3>
                            <h2 className="text-3xl md:text-5xl font-black text-black uppercase leading-none mb-6 md:mb-8" style={{ fontFamily: 'var(--font-bebas)' }}>
                                Una formación que <span className="text-[#B70126]">transforma</span> tu criterio
                            </h2>
                            <div className="space-y-4 md:space-y-6 text-base md:text-lg text-gray-700 leading-relaxed">
                                <p>
                                    {t('counterSurveillance.introDescription1')} <span className="font-bold text-black">Aprenderás a detectar la vigilancia hostil</span>, incluso cuando los criminales creen que están ocultos.
                                </p>
                                <p>
                                    La mayoría de los equipos de seguridad solo reaccionan cuando el ataque ya empezó. Los <span className="font-bold text-black">operadores de élite</span> detectan la amenaza antes de que ocurra.
                                </p>
                                <div className="bg-gray-50 border-l-4 border-[#B70126] p-4 md:p-6 my-6 md:my-8">
                                    <p className="font-bold text-black text-lg md:text-xl mb-2">Capacitación de nivel mundial</p>
                                    <p className="text-gray-600">
                                        Profesionales de protección ejecutiva en todo el continente ya dominan las técnicas de contravigilancia que enseñamos en este curso, anticipándose a las amenazas antes de que se materialicen.
                                    </p>
                                </div>
                                <p className="font-bold text-black text-lg">
                                    {t('counterSurveillance.introDescription3')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Section */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-0">
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

                {/* WHAT YOU WILL LEARN */}
                <section data-theme="dark" className="py-16 md:py-24 bg-gray-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10 md:mb-16">
                            <span className="text-[#B70126] font-bold tracking-widest uppercase text-sm md:text-base">Temario del Curso</span>
                            <h2 className="text-3xl md:text-6xl font-black uppercase mt-2" style={{ fontFamily: 'var(--font-bebas)' }}>
                                ¿Qué <span className="text-[#B70126]">Aprenderás?</span>
                            </h2>
                            <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-base md:text-lg px-2">
                                Desarrolla la capacidad de identificar riesgos antes de que se conviertan en ataques.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                            {(t('counterSurveillance.whatYouWillLearnItems') as unknown as string[]).map((item, index) => (
                                <div key={index} className="bg-gray-800 p-4 md:p-6 rounded-xl hover:bg-gray-700 transition-colors border border-gray-700 hover:border-[#B70126] group">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-[#B70126]/20 p-2 rounded-lg group-hover:bg-[#B70126] transition-colors shrink-0">
                                            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-[#B70126] group-hover:text-white" />
                                        </div>
                                        <p className="text-base md:text-lg font-medium text-gray-200 group-hover:text-white">{item}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Destacado */}
                            <div className="bg-gradient-to-br from-[#B70126] to-[#90011E] p-6 rounded-xl shadow-lg md:col-span-2 lg:col-span-1 flex items-center mt-4 md:mt-0">
                                <div>
                                    <h4 className="text-lg md:text-xl font-bold uppercase mb-2 text-white flex items-center gap-2">
                                        <AlertTriangle className="w-6 h-6" />
                                        Enfoque Real
                                    </h4>
                                    <p className="text-white/90 text-sm md:text-base">
                                        Contenido aplicado a escenarios operativos reales de protección ejecutiva.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            {/* CLASSROOM IMAGE SECTION */}
            <section className="w-full relative h-[300px] md:h-[500px]">
                <Image
                    src="/curso-contravigilancia.jpg"
                    alt="Curso de Contravigilancia - Ivan Ivanovich"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
            </section>

            {/* TRAINING METHODOLOGY 3 STEPS */}
            <section data-theme="light" className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 md:mb-20">
                        <h2 className="text-3xl md:text-6xl font-black uppercase text-black" style={{ fontFamily: 'var(--font-bebas)' }}>
                            Así Funciona tu Entrenamiento <span className="text-[#B70126]">Online</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gray-100 -z-10 translate-y-4"></div>

                        <div className="relative bg-white md:pt-8 bg-white/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 md:p-0 rounded-xl md:rounded-none border md:border-none border-gray-100 shadow-sm md:shadow-none">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-black text-white text-xl md:text-2xl font-black flex items-center justify-center rounded-2xl mb-4 md:mb-6 mx-auto shadow-lg border-4 border-white relative z-10 font-[var(--font-bebas)]">01</div>
                            <h3 className="text-xl md:text-2xl font-bold text-black uppercase text-center mb-2 md:mb-4">Accede al contenido</h3>
                            <p className="text-gray-600 text-center leading-relaxed text-sm md:text-base">
                                Inscríbete y obtén <span className="font-bold text-[#B70126]">acceso inmediato</span> a todo el material. Videos, recursos y ejercicios disponibles 24/7 para que aprendas a tu ritmo.
                            </p>
                        </div>

                        <div className="relative bg-white md:pt-8 bg-white/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 md:p-0 rounded-xl md:rounded-none border md:border-none border-gray-100 shadow-sm md:shadow-none">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#B70126] text-white text-xl md:text-2xl font-black flex items-center justify-center rounded-2xl mb-4 md:mb-6 mx-auto shadow-lg border-4 border-white relative z-10 font-[var(--font-bebas)]">02</div>
                            <h3 className="text-xl md:text-2xl font-bold text-black uppercase text-center mb-2 md:mb-4">Aprende el método</h3>
                            <p className="text-gray-600 text-center leading-relaxed text-sm md:text-base">
                                Domina las técnicas de <span className="font-bold text-[#B70126]">contravigilancia</span> que usan los operadores de élite. Detecta vigilancia hostil antes de que se convierta en amenaza.
                            </p>
                        </div>

                        <div className="relative bg-white md:pt-8 bg-white/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 md:p-0 rounded-xl md:rounded-none border md:border-none border-gray-100 shadow-sm md:shadow-none">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-black text-white text-xl md:text-2xl font-black flex items-center justify-center rounded-2xl mb-4 md:mb-6 mx-auto shadow-lg border-4 border-white relative z-10 font-[var(--font-bebas)]">03</div>
                            <h3 className="text-xl md:text-2xl font-bold text-black uppercase text-center mb-2 md:mb-4">Certifícate</h3>
                            <p className="text-gray-600 text-center leading-relaxed text-sm md:text-base">
                                Obtén tu certificación WSO y lleva tu perfil profesional a un nivel que pocos alcanzan en el sector.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 md:mt-16 text-center">
                        <ContravigilanciaLandingCTA
                            className="inline-block bg-black hover:bg-[#333] text-white text-base md:text-lg font-bold py-3 md:py-4 px-8 md:px-10 rounded-full transition-all hover:scale-105 shadow-xl uppercase border border-gray-800 w-full md:w-auto cursor-pointer"
                        >
                            Sí, quiero acceder al curso completo
                        </ContravigilanciaLandingCTA>
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

                {/* TARGET AUDIENCE */}
                <section data-theme="light" className="bg-gray-50 py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-black text-black uppercase mb-6 md:mb-8 text-center lg:text-left" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    ¿Para quién es <br /><span className="text-[#B70126]">este curso?</span>
                                </h2>
                                <div className="space-y-4 md:space-y-6">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#B70126]">
                                            <BadgeCheck className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg md:text-xl font-bold text-black mb-1">Profesionales de Protección</h4>
                                            <p className="text-sm md:text-base text-gray-600">Eres escolta operativo, jefe de equipo o responsable de seguridad corporativa.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#B70126]">
                                            <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg md:text-xl font-bold text-black mb-1">Buscas Evolucionar</h4>
                                            <p className="text-sm md:text-base text-gray-600">Necesitas criterio preventivo y herramientas reales para anticiparte a las amenazas.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#B70126]">
                                            <Globe className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg md:text-xl font-bold text-black mb-1">Estándares Internacionales</h4>
                                            <p className="text-sm md:text-base text-gray-600">Quieres operar con metodologías probadas a nivel mundial.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#B70126]">
                                            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg md:text-xl font-bold text-black mb-1">Alto Perfil</h4>
                                            <p className="text-sm md:text-base text-gray-600">Debes proteger figuras de alto perfil sin margen de error.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 md:mt-10 bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <p className="text-black font-bold text-base md:text-lg text-center">
                                        &quot;Este curso no es para quien quiere más teoría. Es para quien quiere ejecutar con excelencia.&quot;
                                    </p>
                                </div>
                            </div>
                            <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl skew-y-3 transform lg:translate-x-12 ring-8 ring-white mt-8 lg:mt-0">
                                <Image
                                    src="/curso-contravigilancia.jpg"
                                    alt="Curso de Contravigilancia para Protección Ejecutiva"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            
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
