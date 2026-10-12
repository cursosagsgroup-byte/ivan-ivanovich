import { Metadata } from 'next';
import HeroSection from '@/components/public/HeroSection';
import dynamic from 'next/dynamic';
import { StructuredData } from '@/components/seo/StructuredData';
import { generateMetadata as buildMetadata, organizationSchema } from '@/lib/seo-utils';
import { getLocale } from '@/lib/get-locale';

const TestimonialsCarousel = dynamic(() => import('@/components/TestimonialsCarousel'), {
    loading: () => <div className="h-96 w-full animate-pulse bg-gray-100 rounded-xl" />
});
const RecognitionsSection = dynamic(() => import('@/components/public/RecognitionsSection'));
const BlogCarousel = dynamic(() => import('@/components/BlogCarousel'), {
    loading: () => <div className="h-96 w-full animate-pulse bg-gray-100 rounded-xl" />
});
const ManifestoSection = dynamic(() => import('@/components/public/ManifestoSection'));
const ContactSection = dynamic(() => import('@/components/public/ContactSection'));

// Portada sin cliente directo: nada de este archivo usa hooks, así que puede
// ser un Server Component y exportar su propio canonical + hreflang (antes
// vivían en metadata.ts, pero ese archivo nunca se enganchó a Next.js porque
// page.tsx era 'use client' — Google no veía ninguna etiqueta canonical ni
// alternate en la portada).
export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const en = locale === 'en';

    return buildMetadata({
        title: en
            ? 'Ivan Ivanovich - Executive Protection Academy'
            : 'Ivan Ivanovich - Academia de Protección Ejecutiva',
        description: en
            ? 'Executive Protection Academy recognized among the top 9 in the world. Certified Team Leader and Counter-surveillance courses with an international instructor.'
            : 'Academia de Protección Ejecutiva reconocida entre las 9 mejores del mundo. Cursos certificados de Team Leader y Contravigilancia con instructor de nivel internacional.',
        keywords: en
            ? ['executive protection', 'private security', 'team leader', 'counter-surveillance', 'executive protection academy', 'ivan ivanovich']
            : ['protección ejecutiva', 'seguridad privada', 'academia protección', 'ivan ivanovich', 'curso protección ejecutiva', 'team leader', 'contravigilancia'],
        image: '/og-image.jpg',
        url: '',
        type: 'website',
    });
}

const homeSchema = organizationSchema();

export default function LandingPage() {
    return (
        <>
            <StructuredData data={homeSchema} />
            <div className="home-page bg-white min-h-screen">
                {/* Hero a sangre: la sección maneja su propio ancho completo */}
                <HeroSection />

                {/* Testimonios: carrusel con el mismo patrón editorial que
                    el del blog, antes del acordeón de reconocimientos. */}
                <TestimonialsCarousel />

                {/* Reconocimientos: mismo patrón editorial, ancho completo —
                    continúa la numeración del libro (003) con 004-007. */}
                <RecognitionsSection />

                {/* Blog: mismo patrón editorial que los cursos, ancho
                    completo — se sale del contenedor max-w-7xl a propósito. */}
                <BlogCarousel />

                {/* Manifiesto: la doctrina se revela palabra a palabra con
                    el scroll, justo antes del formulario. */}
                <ManifestoSection />

                {/* Contacto: mismo patrón, también a ancho completo. */}
                <ContactSection />
            </div>
        </>
    );
}
