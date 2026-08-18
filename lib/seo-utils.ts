import { Metadata } from 'next'

interface SEOProps {
    title: string
    description: string
    keywords?: string[]
    image?: string
    url?: string
    type?: 'website' | 'article' | 'profile'
    publishedTime?: string
    modifiedTime?: string
    author?: string
}

export function generateMetadata({
    title,
    description,
    keywords = [],
    image = '/og-image.jpg',
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author = 'Ivan Ivanovich',
}: SEOProps): Metadata {
    const baseUrl = 'https://ivanivanovich.com'
    const fullUrl = url ? `${baseUrl}${url}` : baseUrl
    const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`

    const metadata: Metadata = {
        title,
        description,
        keywords: keywords.join(', '),
        authors: [{ name: author }],
        openGraph: {
            type,
            url: fullUrl,
            title,
            description,
            siteName: 'Ivan Ivanovich Academia',
            images: [
                {
                    url: fullImageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: 'es_ES',
            alternateLocale: ['en_US'],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [fullImageUrl],
            creator: '@ivanivanovich', // Add your actual Twitter handle
        },
        alternates: {
            canonical: fullUrl,
            // El sitio sirve la misma ruta en español y, con prefijo /en, en
            // inglés. Declararlo evita que Google trate ambas como duplicados
            // y le permite servir cada idioma a quien corresponde.
            languages: {
                es: fullUrl,
                en: url ? `${baseUrl}/en${url}` : `${baseUrl}/en`,
                'x-default': fullUrl,
            },
        },
    }

    // Add article-specific metadata
    if (type === 'article' && (publishedTime || modifiedTime)) {
        metadata.openGraph = {
            ...metadata.openGraph,
            type: 'article',
            publishedTime,
            modifiedTime,
            authors: [author],
        }
    }

    return metadata
}

// JSON-LD structured data helpers
export function organizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Ivan Ivanovich Academia de Protección Ejecutiva',
        url: 'https://ivanivanovich.com',
        logo: 'https://ivanivanovich.com/logo.png',
        description: 'Academia de Protección Ejecutiva reconocida entre las 9 mejores del mundo',
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'MX',
        },
        sameAs: [
            // Add your social media URLs
            'https://facebook.com/ivanivanovich',
            'https://instagram.com/ivanivanovich',
            'https://linkedin.com/company/ivanivanovich',
        ],
    }
}

export function courseSchema(course: {
    name: string
    description: string
    image: string
    price: number
    currency: string
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.name,
        description: course.description,
        provider: {
            '@type': 'Organization',
            name: 'Ivan Ivanovich Academia',
            url: 'https://ivanivanovich.com',
        },
        image: course.image,
        hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: 'online',
            courseWorkload: 'PT10H',
        },
        offers: {
            '@type': 'Offer',
            price: course.price,
            priceCurrency: course.currency,
            availability: 'https://schema.org/InStock',
        },
    }
}

/**
 * Iván como entidad: es la marca del sitio, y sus credenciales son lo que las
 * IA citan cuando alguien pregunta por autoridades en protección ejecutiva.
 * Sin esto, sus reconocimientos solo existían como texto suelto.
 */
export function personSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': 'https://ivanivanovich.com/#ivan',
        name: 'Ivan Ivanovich',
        url: 'https://ivanivanovich.com',
        image: 'https://ivanivanovich.com/ivan-photo.jpg',
        jobTitle: 'Instructor de Protección Ejecutiva',
        description:
            'Experto global en seguridad con más de 30 años de experiencia en escenarios de alto riesgo en Europa, América y África. Presidente del Board of Directors de WSO-Worldwide Security Options.',
        knowsAbout: [
            'Protección Ejecutiva',
            'Contravigilancia',
            'Alerta Temprana',
            'Análisis de Amenazas',
            'Inteligencia y Contrainteligencia',
        ],
        award: [
            'Top 9 mejores academias de Protección Ejecutiva del mundo — EP Wired',
            'Top 30 profesionales de seguridad más influyentes 2025 — International Security Journal',
            'Instructor de la Fuerza de Protección de la Infantería de Marina Española',
        ],
        worksFor: {
            '@type': 'Organization',
            name: 'Ivan Ivanovich Academia de Protección Ejecutiva',
            url: 'https://ivanivanovich.com',
        },
    };
}

/** Datos estructurados de un artículo del blog, para resultados enriquecidos y citación por IA. */
export function articleSchema(post: {
    title: string;
    slug: string;
    excerpt?: string | null;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
    language: string;
    authorName?: string | null;
}) {
    const baseUrl = 'https://ivanivanovich.com';
    const imageUrl = post.image
        ? post.image.startsWith('http') ? post.image : `${baseUrl}${post.image}`
        : `${baseUrl}/og-image.jpg`;

    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt || undefined,
        image: [imageUrl],
        datePublished: post.createdAt.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        inLanguage: post.language === 'en' ? 'en' : 'es',
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${baseUrl}/blog/${post.slug}` },
        author: {
            '@type': 'Person',
            '@id': `${baseUrl}/#ivan`,
            name: post.authorName || 'Ivan Ivanovich',
            url: baseUrl,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Ivan Ivanovich Academia de Protección Ejecutiva',
            logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
        },
    };
}
