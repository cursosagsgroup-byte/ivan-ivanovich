import { Metadata } from 'next'
import { generateMetadata as buildMetadata } from '@/lib/seo-utils'
import { getLocale } from '@/lib/get-locale'

// Metadatos en el idioma de la petición: la misma URL sirve español y, con el
// prefijo /en, inglés. Antes eran fijos por página y el enlace compartido
// desde el otro idioma mostraba la ficha equivocada.
export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale()
    const en = locale === 'en'

    return buildMetadata({
        title: en
            ? 'Counter Surveillance for Executive Protection'
            : 'Contravigilancia para Protección Ejecutiva',
        description: en
            ? 'Learn professional counter-surveillance techniques for executive protection. Certified course with an internationally recognized instructor.'
            : 'Aprende técnicas profesionales de contravigilancia para protección ejecutiva. Curso certificado con instructor de nivel internacional reconocido entre los mejores del mundo.',
        keywords: en
            ? ['counter surveillance', 'executive protection', 'hostile surveillance detection', 'security training', 'ivan ivanovich']
            : ['contravigilancia', 'curso contravigilancia', 'protección ejecutiva', 'detección vigilancia', 'seguridad ejecutiva', 'ivan ivanovich'],
        image: '/curso-contravigilancia.png',
        url: '/educacion/contravigilancia',
        type: 'website',
    })
}

export default function ContravigilanciaLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
