'use client';

import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

// Menciones de prensa rescatadas del WordPress anterior (página "Medios",
// ID 1413). Los titulares son textuales, tal como se publicaron entonces.
const MENTIONS = [
    { logo: '/medios/logos-medios_0000_martha.webp', title: 'Diferencias entre extorsión o secuestro' },
    { logo: '/medios/logos-medios_0006_24-horas.webp', title: 'Ven fracaso en protección a Jorge Aristóteles Sandoval, asesinado en bar de Puerto Vallarta' },
    { logo: '/medios/logos-medios_0007_siempre.webp', title: 'Necesario organismo en seguridad' },
    { logo: '/medios/logos-medios_0005_diario-contra-replica.webp', title: 'Al alza, amenazas a funcionarios: experto' },
    { logo: '/medios/logos-medios_0000_martha.webp', title: 'Todo lo que estás haciendo mal ante un robo' },
    { logo: '/medios/logos-medios_0002_Excelsior.webp', title: 'Los impactos que están cambiado la Seguridad en México' },
    { logo: '/medios/logos-medios_0000_martha.webp', title: 'La verdad sobre la protección ejecutiva' },
    { logo: '/medios/logos-medios_0002_Excelsior.webp', title: 'La protección ejecutiva como se practica está obsoleta' },
    { logo: '/medios/logos-medios_0002_Excelsior.webp', title: 'Nunca sabremos por qué el juez Villegas retiró a su escolta' },
    { logo: '/medios/logos-medios_0002_Excelsior.webp', title: 'Protección ejecutiva en tiempos de Covid' },
    { logo: '/medios/logos-medios_0002_Excelsior.webp', title: 'Protección ejecutiva: tres pasos para prevenir un ataque' },
    { logo: '/medios/logos-medios_0000_martha.webp', title: '¿Cómo cuidarnos ante la inseguridad?' },
    { logo: '/medios/logos-medios_0003_el-universal.webp', title: 'Urgen a AMLO a contar con equipo especial de protección en eventos' },
    { logo: '/medios/logos-medios_0003_el-universal.webp', title: 'Urgen a crear institución que dé protección presidencial' },
    { logo: '/medios/logos-medios_0004_ansalatina.webp', title: 'Debaten sobre seguridad de Obrador' },
    { logo: '/medios/logos-medios_0001_forbes-mexico.webp', title: 'La clase media, el nuevo blanco de los secuestradores: experto' },
    { logo: '/medios/logos-medios_0001_forbes-mexico.webp', title: 'Por qué es mejor la inteligencia que las armas' },
    { logo: '/medios/logos-medios_0002_Excelsior.webp', title: 'Retos de la protección ejecutiva en el Siglo XXI' },
    { logo: '/medios/logos-medios_0002_Excelsior.webp', title: 'Urge una nueva institución de protección presidencial' },
    { logo: '/medios/logos-medios_0002_Excelsior.webp', title: 'Sobre las armas en la protección ejecutiva y otros demonios' },
    { logo: '/medios/logos-medios_0002_Excelsior.webp', title: 'La seguridad de López Obrador, algunos apuntes' },
    { logo: '/medios/logos-medios_0002_Excelsior.webp', title: 'Ataque a casa del cardenal: una reflexión de protección ejecutiva' },
];

export default function MediosPage() {
    const { t } = useTranslation();

    return (
        <div className="bg-white min-h-screen">
            {/* Hero a sangre, mismo patrón que el resto del sitio. */}
            <div className="relative w-full overflow-hidden bg-[#0B121F]">
                <Image
                    src="/course-hero-image.jpg"
                    alt=""
                    aria-hidden="true"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="subpage-hero relative z-10 mx-auto max-w-[1440px]">
                    <p className="subpage-hero-eyebrow">{t('courses.heroEyebrow')}</p>
                    <h1 className="text-6xl font-normal uppercase leading-none text-white lg:text-8xl" style={{ fontFamily: 'var(--font-bebas)' }}>
                        {t('medios.heroTitle')}
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-100 sm:text-lg">
                        {t('medios.heroSubtitle')}
                    </p>
                </div>
            </div>

            {/* Menciones: ancho completo, líneas divisorias, logo + titular. */}
            <div className="border-t border-gray-200 bg-white">
                <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
                    <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.16em] text-gray-400">
                        {t('medios.kicker')}
                    </p>

                    <div className="grid grid-cols-1 border-t border-gray-200 lg:grid-cols-3">
                        {MENTIONS.map((mention, index) => {
                            const col = index % 3;
                            const isFirstRow = index < 3;
                            return (
                                <div
                                    key={index}
                                    className={[
                                        'flex flex-col pb-8 lg:pb-10',
                                        isFirstRow ? 'pt-6 lg:pt-8' : 'border-t border-gray-200 pt-8 lg:pt-10',
                                        col > 0 ? 'lg:border-l lg:border-gray-200 lg:pl-10' : '',
                                        col > 0 ? '' : 'lg:pr-10',
                                    ].filter(Boolean).join(' ')}
                                >
                                    <div className="mb-6 flex items-center justify-between">
                                        <div className="relative h-12 w-36 sm:h-14 sm:w-40">
                                            <Image
                                                src={mention.logo}
                                                alt=""
                                                fill
                                                className="object-contain object-left"
                                                sizes="160px"
                                            />
                                        </div>
                                        <span className="shrink-0 font-mono text-xs text-gray-400">
                                            {String(index + 1).padStart(3, '0')}
                                        </span>
                                    </div>
                                    <p className="text-lg leading-snug text-[#16171a]">
                                        {mention.title}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
