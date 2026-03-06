import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Shield, Target, Award, MapPin, Calendar, Clock, AlertTriangle } from 'lucide-react';
import MexicoLandingCTA from '@/components/landing/MexicoLandingCTA';
import ExecutiveTrainingSection from '@/components/landing/ExecutiveTrainingSection';
import PersuasionTechniquesSection from '@/components/landing/PersuasionTechniquesSection';

export default function LandingPage() {
    return (
        <div className="bg-white min-h-screen font-sans">
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
                            Ciudad de México | 24 y 25 de Marzo
                        </h2>
                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-none mb-6" style={{ fontFamily: 'var(--font-bebas)' }}>
                            Alerta <span className="text-[#B70126]">Temprana</span><br />
                            en Protección <span className="text-gray-300">Ejecutiva</span>
                        </h1>
                        <p className="text-lg md:text-3xl font-medium max-w-4xl mx-auto mb-8 md:mb-10 text-gray-200 px-2 leading-tight md:leading-normal">
                            Vive la experiencia táctica que te convertirá en un <span className="text-white font-bold">verdadero operador de élite</span>.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                            <MexicoLandingCTA
                                className="bg-[#B70126] hover:bg-[#90011E] text-white text-lg md:text-xl font-bold py-3 md:py-4 px-8 md:px-12 rounded-full transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(183,1,38,0.5)] uppercase flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
                                style={{ fontFamily: 'var(--font-montserrat)' }}
                            >
                                Reservar Mi Lugar <span className="text-2xl">→</span>
                            </MexicoLandingCTA>
                        </div>
                        <p className="mt-6 text-sm md:text-base text-gray-400 max-w-2xl mx-auto px-4 italic">
                            "No enseña lo que suena bien, entrena lo que funciona."
                        </p>
                    </div>
                </div>
            </div>

            {/* EXECUTIVE TRAINING SECTION */}
            <ExecutiveTrainingSection />

            {/* ATTACK PREPARATION SECTION (REPLACING PERSUASION) */}
            <section data-theme="light" className="py-12 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                        {/* Images Column */}
                        <div className="order-2 lg:order-1 flex flex-col gap-6">
                            <div className="relative h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/landing-pe/persuasion-1.jpg"
                                    alt="Inteligencia Operativa 1"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative h-[250px] md:h-[350px] w-full rounded-2xl overflow-hidden shadow-xl transform translate-x-4 md:translate-x-8 -mt-12 border-4 border-white">
                                <Image
                                    src="/images/landing-pe/persuasion-2.jpg"
                                    alt="Inteligencia Operativa 2"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="order-1 lg:order-2">
                            <h2 className="text-3xl md:text-5xl font-black text-black uppercase leading-none mb-6 md:mb-8 text-center lg:text-left" style={{ fontFamily: 'var(--font-bebas)' }}>
                                Los ataques no comienzan cuando se dispara; <span className="text-[#B70126]">comienzan mucho antes</span>.
                            </h2>

                            <div className="space-y-6 text-base md:text-lg text-gray-700 leading-relaxed text-center lg:text-left">
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 justify-center lg:justify-start">
                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#B70126] shrink-0" />
                                        <span>Comienzan cuando alguien recopila inteligencia sobre el objetivo.</span>
                                    </li>
                                    <li className="flex items-start gap-3 justify-center lg:justify-start">
                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#B70126] shrink-0" />
                                        <span>Cuando alguien observa sus movimientos y estudia sus rutas.</span>
                                    </li>
                                    <li className="flex items-start gap-3 justify-center lg:justify-start">
                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#B70126] shrink-0" />
                                        <span>Cuando alguien realiza vigilancia para confirmar patrones.</span>
                                    </li>
                                    <li className="flex items-start gap-3 justify-center lg:justify-start">
                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#B70126] shrink-0" />
                                        <span>Cuando alguien prepara la logística de una emboscada.</span>
                                    </li>
                                    <li className="flex items-start gap-3 justify-center lg:justify-start">
                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#B70126] shrink-0" />
                                        <span>Cuando alguien se posiciona en el punto elegido para atacar.</span>
                                    </li>
                                </ul>

                                <div className="bg-gray-50 border-l-4 border-[#B70126] p-6 shadow-sm mt-8">
                                    <p className="text-gray-800 font-medium">
                                        La mayoría de los equipos de seguridad solo reaccionar cuando el ataque ya empezó.
                                    </p>
                                    <p className="font-bold text-black text-xl mt-2 uppercase" style={{ fontFamily: 'var(--font-bebas)' }}>
                                        Los protectores de alto nivel hacen algo diferente. <span className="text-[#B70126]">Detectan la amenaza antes de que ocurra.</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* METHODOLOGY DETAILS SECTION (NEW) */}
            <section data-theme="dark" className="py-16 md:py-24 bg-[#0A0A0A] text-white overflow-hidden relative border-y border-white/5">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-6xl font-black uppercase mb-6" style={{ fontFamily: 'var(--font-bebas)' }}>
                            Aprende la metodología que está <span className="text-[#B70126]">cambiando la forma de operar</span>
                        </h2>
                        <div className="max-w-4xl mx-auto space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed font-medium">
                            <p>
                                La <span className="text-white font-bold">Alerta Temprana</span> es una metodología operativa utilizada en protección ejecutiva para detectar las señales de preparación de un ataque antes de que este ocurra.
                            </p>
                            <p>
                                A diferencia de los enfoques tradicionales que se enfocan en reaccionar cuando el ataque ya comenzó, la alerta temprana busca <span className="text-[#B70126] font-bold">intervenir mucho antes</span>, cuando los agresores aún se encuentran en la fase de preparación.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-12 shadow-2xl backdrop-blur-sm">
                        <h3 className="text-xl md:text-2xl font-bold uppercase mb-8 flex items-center gap-3 text-white border-b border-white/10 pb-4" style={{ fontFamily: 'var(--font-bebas)' }}>
                            <Shield className="text-[#B70126] w-8 h-8" /> En la práctica, esto significa aprender a identificar:
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { title: "Vigilancia Hostil", desc: "Detección de patrones de observación del adversario." },
                                { title: "Movimientos Sospechosos", desc: "Anomalías tácticas alrededor de una ruta operativa." },
                                { title: "Posicionamiento", desc: "Identificación de posibles agresores en puntos críticos." },
                                { title: "Recursos Logísticos", desc: "Señales de preparación de una emboscada." },
                                { title: "Anomalías en el Entorno", desc: "Cambios sutiles que delatan una operación hostil." }
                            ].map((item, index) => (
                                <div key={index} className="flex gap-4 group">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#B70126] text-white flex items-center justify-center rounded-xl font-bold group-hover:scale-110 transition-transform">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold uppercase text-lg">{item.title}</h4>
                                        <p className="text-gray-400 text-sm md:text-base">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-block bg-[#B70126]/10 border border-[#B70126]/30 p-6 md:p-8 rounded-2xl">
                            <p className="text-lg md:text-2xl text-white font-medium leading-tight">
                                Cuando estas señales se detectan con anticipación, el equipo de protección puede <span className="text-[#B70126] font-bold">modificar la ruta, intervenir el entorno o detener el movimiento</span>, evitando que el ejecutivo llegue al punto donde el ataque estaba preparado.
                            </p>
                            <p className="mt-6 text-xl md:text-3xl font-black uppercase text-white" style={{ fontFamily: 'var(--font-bebas)' }}>
                                La alerta temprana permite <span className="text-[#B70126]">evitar el ataque</span> antes de que ocurra.
                            </p>
                        </div>
                    </div>
                </div>
            </section>



            {/* TRAINING METHODOLOGY SECTION (MOVED & UPDATED) */}
            <section data-theme="light" className="py-16 md:py-24 bg-white text-black overflow-hidden relative border-y border-gray-100">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)', backgroundSize: '60px 60px' }}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-6xl font-black uppercase text-black mb-4" style={{ fontFamily: 'var(--font-bebas)' }}>
                            Así Funciona tu Entrenamiento <span className="text-[#B70126]">Táctico</span>
                        </h2>
                        <div className="max-w-3xl mx-auto bg-[#B70126]/5 border border-[#B70126]/10 p-6 rounded-2xl mb-12 shadow-sm">
                            <p className="text-lg md:text-xl font-bold uppercase tracking-wider text-[#B70126] mb-2">
                                Un entrenamiento que durante años estuvo reservado para equipos de élite.
                            </p>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                Durante años, este entrenamiento fue impartido exclusivamente a equipos de protección de alto nivel como la <span className="text-black font-bold">Guardia Presidencial de Costa Rica</span>, la <span className="text-black font-bold">Unidad de Infantería de la Marina de España</span> y equipos especializados en <span className="text-black font-bold">Medio Oriente</span>. Ahora, este conocimiento se abre a nuevos profesionales.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                        <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl group border-8 border-white">
                            <Image
                                src="/images/landing-pe/ivan-pensando.jpg"
                                alt="Ivan Ivanovich - Instructor Internacional"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white text-shadow-sm">
                                <p className="text-white font-black text-2xl uppercase" style={{ fontFamily: 'var(--font-bebas)' }}>Escenarios Reales</p>
                                <p className="text-white/90 text-sm italic">"Donde la teoría se vuelve instinto"</p>
                            </div>
                        </div>

                        <div className="space-y-8 text-left">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold uppercase text-black mb-4 flex items-center gap-3" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    <span className="bg-[#B70126] text-white w-10 h-10 flex items-center justify-center rounded-lg shadow-lg">1</span>
                                    Dos días de entrenamiento operativo intensivo
                                </h3>
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    Los participantes trabajarán en escenarios reales diseñados para <span className="text-black font-bold italic">recrear la lógica de una emboscada</span>.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl hover:bg-gray-100 transition-colors shadow-sm">
                                    <h4 className="text-[#B70126] font-black uppercase text-xl mb-3" style={{ fontFamily: 'var(--font-bebas)' }}>El Adversario</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Un equipo asumirá el rol del adversario, estudiando la ruta para identificar puntos de emboscada, pasos obligados y zonas de frenado.
                                    </p>
                                </div>
                                <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl hover:bg-gray-100 transition-colors shadow-sm">
                                    <h4 className="text-black font-black uppercase text-xl mb-3" style={{ fontFamily: 'var(--font-bebas)' }}>Alerta Temprana</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        El segundo equipo analizará el entorno para detectar la fase de preparación, definiendo ruta crítica y perímetros de búsqueda.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 p-8 md:p-10 rounded-3xl relative overflow-hidden text-center max-w-5xl mx-auto shadow-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#B70126]/5 blur-3xl rounded-full"></div>
                        <p className="text-xl md:text-2xl font-medium text-gray-800 leading-tight italic">
                            El objetivo es claro: <span className="text-black font-bold">identificar los puntos de espera de los agresores</span>, detectar anomalías en el entorno y <span className="text-[#B70126] font-bold">evitar que el protegido llegue al punto</span> donde la emboscada estaba preparada.
                        </p>
                        <div className="mt-8">
                            <MexicoLandingCTA className="inline-block bg-[#B70126] hover:bg-[#90011E] text-white text-lg font-bold py-4 px-10 rounded-full transition-all hover:scale-105 shadow-xl uppercase cursor-pointer">
                                Sí, quiero vivir esta experiencia
                            </MexicoLandingCTA>
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
                            "Los retos de la protección ejecutiva moderna.",
                            "Objetivos de la protección ejecutiva.",
                            "Alcance de la disuasión y de las medidas reactivas en condiciones reales.",
                            "La Línea de Ataque.",
                            "El concepto: “A la izquierda de impacto”.",
                            "Las medidas “A la derecha de impacto”.",
                            "Protección anticipada vs. protección de cerca.",
                            "Medidas de la protección anticipada “A la izquierda del impacto”.",
                            "Alerta temprana y cómo diferenciarla de una avanzada tradicional.",
                            "Definición de: Ruta crítica, horario crítico, lugar crítico de alerta, perímetro crítico y la condición crítica.",
                            "Multiplicadores de fuerza para la alerta temprana."
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
                        ¿Estás listo para desarrollar la <br /><span className="text-black">visión de un experto?</span>
                    </h2>

                    <div className="max-w-3xl mx-auto mb-8 md:mb-12">
                        <p className="text-lg md:text-2xl font-medium text-white mb-6">
                            Con la compra de tu curso presencial, adquieres automáticamente la formación online:
                        </p>
                        <p className="text-xl md:text-3xl font-bold bg-black text-white p-4 rounded-xl inline-block shadow-lg uppercase" style={{ fontFamily: 'var(--font-bebas)' }}>
                            Team Leader en Protección Ejecutiva
                        </p>
                    </div>

                    <div className="bg-white/10 rounded-3xl p-6 md:p-12 border border-white/20 backdrop-blur-md max-w-3xl mx-auto mt-8">
                        <MexicoLandingCTA
                            className="inline-block bg-white hover:bg-gray-100 text-[#B70126] text-lg md:text-2xl font-black py-4 md:py-6 px-4 md:px-12 rounded-full transition-all transform hover:scale-105 shadow-2xl uppercase w-full md:w-auto cursor-pointer"
                            style={{ fontFamily: 'var(--font-bebas)' }}
                        >
                            👉 QUIERO TOMAR ESTE CURSO
                        </MexicoLandingCTA>
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
