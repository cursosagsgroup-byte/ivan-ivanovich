import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Shield, Target, Award, MapPin, Calendar, Clock, AlertTriangle } from 'lucide-react';
import LandingCTA from '@/components/landing/LandingCTA';
import ExecutiveTrainingSection from '@/components/landing/ExecutiveTrainingSection';
import PersuasionTechniquesSection from '@/components/landing/PersuasionTechniquesSection';

export default function LandingPage() {
    return (
        <div className="bg-white min-h-screen font-sans">
            {/* HERO SECTION */}
            {/* HERO SECTION */}
            <div data-theme="dark" className="relative min-h-[90vh] md:min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
                {/* Background Pattern (Optional for texture) */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                {/* Spotlight Animation */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.8)_0%,transparent_60%)] animate-spotlight blur-2xl"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white pt-10 md:pt-20">
                    <div className="animate-fade-in-up">

                        <h2 className="text-white font-bold text-lg md:text-2xl uppercase tracking-wider mb-2">
                            Ciudad de México | 24 y 25 de Febrero
                        </h2>
                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-none mb-6" style={{ fontFamily: 'var(--font-bebas)' }}>
                            Protección <span className="text-[#B70126]">Ejecutiva</span>,<br />
                            Operatividad <span className="text-gray-300">General</span><br />
                            y Logística Protectiva
                        </h1>
                        <p className="text-lg md:text-3xl font-medium max-w-4xl mx-auto mb-8 md:mb-10 text-gray-200 px-2 leading-tight md:leading-normal">
                            Vive la experiencia táctica que te convertirá en un <span className="text-white font-bold">verdadero operador de élite</span>.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                            <LandingCTA
                                className="bg-[#B70126] hover:bg-[#90011E] text-white text-lg md:text-xl font-bold py-3 md:py-4 px-8 md:px-12 rounded-full transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(183,1,38,0.5)] uppercase flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
                                style={{ fontFamily: 'var(--font-montserrat)' }}
                            >
                                Reservar Mi Lugar <span className="text-2xl">→</span>
                            </LandingCTA>
                        </div>
                        <p className="mt-6 text-sm md:text-base text-gray-400 max-w-2xl mx-auto px-4 italic">
                            "No enseña lo que suena bien, entrena lo que funciona."
                        </p>
                    </div>
                </div>
            </div>

            {/* EXECUTIVE TRAINING SECTION */}
            <ExecutiveTrainingSection />

            {/* PERSUASION TECHNIQUES SECTION */}
            <PersuasionTechniquesSection />

            {/* PROBLEM / SOLUTION SECTION (RESTORED) */}
            <section data-theme="light" className="py-12 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="relative h-[400px] md:h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/landing-pe/feature-section.jpg"
                                    alt="Instructor Ivan Ivanovich"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-8">
                                    <p className="text-white text-lg font-bold">Ivan Ivanovich</p>
                                    <p className="text-gray-300 text-sm">Instructor de Nivel Internacional</p>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <h3 className="text-[#B70126] font-bold text-base md:text-lg uppercase tracking-wide mb-2">La Realidad Operativa</h3>
                            <h2 className="text-3xl md:text-5xl font-black text-black uppercase leading-none mb-6 md:mb-8" style={{ fontFamily: 'var(--font-bebas)' }}>
                                Una formación que <span className="text-[#B70126]">transforma</span> tu carrera
                            </h2>
                            <div className="space-y-4 md:space-y-6 text-base md:text-lg text-gray-700 leading-relaxed">
                                <p>
                                    Ha llegado el momento de que los profesionales de la protección ejecutiva descubran el poder transformador de <span className="font-bold text-black">anticipar, planificar y ejecutar con criterio real en la calle</span>.
                                </p>
                                <p>
                                    En la <span className="font-bold text-black">Ivan Ivanovich Executive Protection Academy</span>, nos hemos propuesto una misión clara: Elevar el estándar de la seguridad ejecutiva moderna a través de la formación táctica real.
                                </p>
                                <div className="bg-gray-50 border-l-4 border-[#B70126] p-4 md:p-6 my-6 md:my-8">
                                    <p className="font-bold text-black text-lg md:text-xl mb-2">Miles de profesionales</p>
                                    <p className="text-gray-600">
                                        Escoltas, jefes de seguridad y líderes corporativos ya se han entrenado con nosotros, revolucionando su manera de proteger, leer el entorno y tomar decisiones bajo presión.
                                    </p>
                                </div>
                                <p className="font-bold text-black text-lg">
                                    Después de pasar por nuestra academia, ya no operan igual. Piensan, actúan y lideran como operadores de élite.
                                </p>
                            </div>
                        </div>
                    </div>
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
                            Descubre cómo anticipar amenazas, ejecutar operativos reales y proteger con criterio estratégico.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {[
                            "Objetivos de Protección",
                            "Perfil de un elemento de Protección Ejecutiva",
                            "Medidas proactivas y reactivas",
                            "Inteligencia y contrainteligencia",
                            "Avanzadas en campo",
                            "Funcionamiento del centro de control",
                            "Plan de seguridad profesional",
                            "Desarrollo de procedimientos operativos",
                            "Integración de diferentes áreas organizacionales",
                            "Uso dinámico y discreto de vehículo back up",
                            "Formaciones discretas encubiertas"
                        ].map((item, index) => (
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
                                    Todo aplicado bajo presión, en situaciones reales simuladas en entorno urbano.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CLASSROOM IMAGE SECTION */}
            <section className="w-full relative h-[300px] md:h-[500px]">
                <Image
                    src="/images/landing-pe/classroom-training.jpg"
                    alt="Entrenamiento en aula con Iván Ivanovich"
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
                            Así Funciona tu Entrenamiento <span className="text-[#B70126]">Táctico</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gray-100 -z-10 translate-y-4"></div>

                        {/* Step 1 */}
                        <div className="relative bg-white md:pt-8 bg-white/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 md:p-0 rounded-xl md:rounded-none border md:border-none border-gray-100 shadow-sm md:shadow-none">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-black text-white text-xl md:text-2xl font-black flex items-center justify-center rounded-2xl mb-4 md:mb-6 mx-auto shadow-lg border-4 border-white relative z-10 font-[var(--font-bebas)]">01</div>
                            <h3 className="text-xl md:text-2xl font-bold text-black uppercase text-center mb-2 md:mb-4">Aprende el método</h3>
                            <p className="text-gray-600 text-center leading-relaxed text-sm md:text-base">
                                Más de <span className="font-bold text-[#B70126]">10 horas de preparación online</span>, donde desarrollarás el criterio táctico, la estructura mental y la planificación operativa de un profesional de élite.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative bg-white md:pt-8 bg-white/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 md:p-0 rounded-xl md:rounded-none border md:border-none border-gray-100 shadow-sm md:shadow-none">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#B70126] text-white text-xl md:text-2xl font-black flex items-center justify-center rounded-2xl mb-4 md:mb-6 mx-auto shadow-lg border-4 border-white relative z-10 font-[var(--font-bebas)]">02</div>
                            <h3 className="text-xl md:text-2xl font-bold text-black uppercase text-center mb-2 md:mb-4">Entrena en la calle</h3>
                            <p className="text-gray-600 text-center leading-relaxed text-sm md:text-base">
                                <span className="font-bold text-[#B70126]">2 días intensos</span> de simulacros en escenarios reales. Pondrás a prueba lo aprendido bajo presión, ejecutando operativos urbanos, avanzadas y maniobras encubiertas.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative bg-white md:pt-8 bg-white/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 md:p-0 rounded-xl md:rounded-none border md:border-none border-gray-100 shadow-sm md:shadow-none">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-black text-white text-xl md:text-2xl font-black flex items-center justify-center rounded-2xl mb-4 md:mb-6 mx-auto shadow-lg border-4 border-white relative z-10 font-[var(--font-bebas)]">03</div>
                            <h3 className="text-xl md:text-2xl font-bold text-black uppercase text-center mb-2 md:mb-4">Evoluciona</h3>
                            <p className="text-gray-600 text-center leading-relaxed text-sm md:text-base">
                                Transformación real: dejarás de reaccionar para comenzar a anticipar, influir y liderar con estrategias que hoy pocos dominan en el sector.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 md:mt-16 text-center">
                        <LandingCTA
                            className="inline-block bg-black hover:bg-[#333] text-white text-base md:text-lg font-bold py-3 md:py-4 px-8 md:px-10 rounded-full transition-all hover:scale-105 shadow-xl uppercase border border-gray-800 w-full md:w-auto cursor-pointer"
                        >
                            Sí, quiero vivir este entrenamiento completo
                        </LandingCTA>
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
                                        <h4 className="text-lg md:text-xl font-bold text-black mb-1">Profesionales Activos</h4>
                                        <p className="text-sm md:text-base text-gray-600">Eres escolta operativo, jefe de equipo o responsable de seguridad corporativa.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#B70126]">
                                        <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg md:text-xl font-bold text-black mb-1">Buscas Evolucionar</h4>
                                        <p className="text-sm md:text-base text-gray-600">Tienes experiencia, pero necesitas criterio y estrategia reales para destacar en un sector saturado.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#B70126]">
                                        <Globe className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg md:text-xl font-bold text-black mb-1">Estándares Internacionales</h4>
                                        <p className="text-sm md:text-base text-gray-600">Quieres operar con estándares internacionales desde el primer día.</p>
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
                                    "Este curso no es para quien quiere más teoría. Es para quien quiere ejecutar con excelencia."
                                </p>
                            </div>
                        </div>
                        <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl skew-y-3 transform lg:translate-x-12 ring-8 ring-white mt-8 lg:mt-0">
                            <Image
                                src="/images/landing-pe/target-audience.jpg"
                                alt="Entrenamiento de protección ejecutiva"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* INSTRUCTOR SECTION */}
            <section data-theme="light" className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#0f172a] rounded-3xl overflow-hidden shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="relative h-[400px] lg:h-auto min-h-[300px] lg:min-h-[500px]">
                                <Image
                                    src="/images/landing-pe/action-5.jpg" // Using an action shot for Ivan
                                    alt="Ivan Ivanovich"
                                    fill
                                    className="object-cover position-top opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-transparent to-transparent lg:hidden"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent lg:hidden"></div>
                            </div>
                            <div className="p-6 md:p-12 lg:p-16 flex flex-col justify-center">
                                <h3 className="text-[#B70126] font-bold text-base md:text-lg uppercase tracking-wide mb-2">Director del Curso</h3>
                                <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-6 md:mb-8" style={{ fontFamily: 'var(--font-bebas)' }}>
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
                                        <span>Autor del bestseller <strong>“Protección Ejecutiva en el Siglo XXI”</strong></span>
                                    </li>
                                    <li className="flex gap-4">
                                        <Award className="w-5 h-5 md:w-6 md:h-6 text-[#B70126] flex-shrink-0" />
                                        <span>Miembro de <strong>IPSB</strong>, referente global del sector</span>
                                    </li>
                                </ul>

                                <div className="mt-8 md:mt-10 pt-8 md:pt-10 border-t border-gray-800">
                                    <p className="text-white font-bold mb-4 uppercase text-xs md:text-sm tracking-wider">¿A quién ha entrenado?</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm text-gray-400">
                                        <div className="flex items-center gap-2"><MapPin className="w-3 h-3 md:w-4 md:h-4 text-[#B70126]" /> Unidad de Protección Presidencial de Costa Rica</div>
                                        <div className="flex items-center gap-2"><MapPin className="w-3 h-3 md:w-4 md:h-4 text-[#B70126]" /> Infantería de Marina Española</div>
                                        <div className="flex items-center gap-2"><MapPin className="w-3 h-3 md:w-4 md:h-4 text-[#B70126]" /> Unidades tácticas en México y Sudamérica</div>
                                        <div className="flex items-center gap-2"><MapPin className="w-3 h-3 md:w-4 md:h-4 text-[#B70126]" /> Líderes de seguridad corporativa</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section data-theme="dark" className="py-16 md:py-24 bg-[#B70126] text-white overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black uppercase mb-6 md:mb-8 leading-tight" style={{ fontFamily: 'var(--font-bebas)' }}>
                        ¿Quieres vivir la experiencia táctica que te convertirá en un <br /><span className="text-black">verdadero operador de élite?</span>
                    </h2>

                    <div className="max-w-3xl mx-auto mb-8 md:mb-12">
                        <p className="text-lg md:text-2xl font-medium text-white mb-6">
                            Entrena con Iván Ivanovich, domina el método que ya ha transformado a cientos de profesionales en el continente, y lleva tu carrera a un nivel que pocos alcanzan.
                        </p>

                        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mt-8">
                            <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/20 flex items-center gap-3 text-left">
                                <span className="text-2xl">🧠</span>
                                <span className="text-white font-bold text-sm md:text-base">Más de 10 horas de preparación online</span>
                            </div>
                            <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/20 flex items-center gap-3 text-left">
                                <span className="text-2xl">🔥</span>
                                <span className="text-white font-bold text-sm md:text-base">2 días de práctica intensa en la calle, bajo presión real</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/10 rounded-3xl p-6 md:p-12 border border-white/20 backdrop-blur-md max-w-3xl mx-auto mt-8">
                        <LandingCTA
                            className="inline-block bg-white hover:bg-gray-100 text-[#B70126] text-lg md:text-2xl font-black py-4 md:py-6 px-4 md:px-12 rounded-full transition-all transform hover:scale-105 shadow-2xl uppercase w-full md:w-auto cursor-pointer"
                            style={{ fontFamily: 'var(--font-bebas)' }}
                        >
                            👉 Quiero entrenar ahora con Iván Ivanovich
                        </LandingCTA>
                        <p className="mt-6 text-xs md:text-sm text-white/80 uppercase tracking-widest flex items-center justify-center gap-2">
                            <Shield className="w-3 h-3 md:w-4 md:h-4" /> Reserva Segura vía WhatsApp
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Icons components for lucide-react if needed, but imported above.
function BadgeCheck(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.78 4 4 0 0 1 0-6.74Z" /><path d="m9 12 2 2 4-4" /></svg>
}

function TrendingUp(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
}

function Globe(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
}

function ShieldCheck(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-0.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>
}
