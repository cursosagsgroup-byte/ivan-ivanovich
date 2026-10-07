import { Metadata } from 'next'
import { generateMetadata as buildMetadata } from '@/lib/seo-utils'
import { getLocale } from '@/lib/get-locale'

// GSC: 9.196 impresiones, 1,0% CTR — sin title/description propios estaba
// compitiendo en el buscador con la descripción genérica de la portada.
export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale()
    const en = locale === 'en'

    return buildMetadata({
        title: en
            ? 'In-Person Executive Protection Courses'
            : 'Cursos Presenciales de Protección Ejecutiva',
        description: en
            ? 'Hands-on, intensive executive protection training in person. Train with an internationally recognized instructor. Check upcoming dates and locations.'
            : 'Entrenamiento teórico y práctico de protección ejecutiva, presencial e intensivo. Fórmate con un instructor de nivel internacional. Conoce fechas y sedes disponibles.',
        keywords: en
            ? ['in-person executive protection course', 'security training', 'ivan ivanovich', 'protective training']
            : ['curso presencial protección ejecutiva', 'curso práctico seguridad', 'ivan ivanovich', 'entrenamiento escoltas'],
        image: '/course-hero-image.jpg',
        url: '/educacion/cursos-presenciales',
        type: 'website',
    })
}

export default function CursosPresencialesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
