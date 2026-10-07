import { Metadata } from 'next'
import { generateMetadata as buildMetadata } from '@/lib/seo-utils'
import { getLocale } from '@/lib/get-locale'

// GSC: 11.104 impresiones, 1,2% CTR — antes esta página no tenía title ni
// description propios, así que Google mostraba el genérico de la portada.
export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale()
    const en = locale === 'en'

    return buildMetadata({
        title: en
            ? 'Ivan Ivanovich: Founder and Executive Protection Expert'
            : 'Ivan Ivanovich: Fundador y Experto en Protección Ejecutiva',
        description: en
            ? 'Meet Ivan Ivanovich, recognized among the world’s 30 most influential security professionals by the International Security Journal. Discover his career and achievements.'
            : 'Conoce a Ivan Ivanovich, reconocido entre los 30 profesionales de seguridad más influyentes del mundo por el International Security Journal. Descubre su trayectoria y logros.',
        keywords: en
            ? ['ivan ivanovich', 'executive protection expert', 'security team', 'protection academy founder']
            : ['ivan ivanovich', 'quien es ivan ivanovich', 'experto protección ejecutiva', 'equipo academia de protección'],
        image: '/ivan-photo.jpg',
        url: '/nuestro-equipo',
        type: 'profile',
    })
}

export default function NuestroEquipoLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
