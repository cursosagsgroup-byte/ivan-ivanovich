import { Metadata } from 'next'
import { generateMetadata as buildMetadata } from '@/lib/seo-utils'
import { getLocale } from '@/lib/get-locale'

// GSC: 10.119 impresiones, 2,2% CTR — sin title/description propios.
export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale()
    const en = locale === 'en'

    return buildMetadata({
        title: en
            ? 'Executive Protection in the 21st Century — The New Doctrine'
            : 'Protección Ejecutiva en el Siglo XXI — La Nueva Doctrina',
        description: en
            ? 'Ivan Ivanovich’s bestselling book: discretion, detection and neutralizing threats before they happen. Discover the Timeline System, his anticipation method.'
            : 'El libro bestseller de Ivan Ivanovich: discreción, detección y desactivación de amenazas antes de que ocurran. Conoce también el Sistema Timeline, su método de anticipación.',
        keywords: en
            ? ['executive protection book', 'ivan ivanovich book', 'timeline system', 'protection doctrine']
            : ['libro protección ejecutiva', 'libro ivan ivanovich', 'sistema timeline', 'doctrina protección ejecutiva'],
        image: '/libro-doctrina-hero.jpg',
        url: '/educacion/libro',
        type: 'website',
    })
}

export default function LibroLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
