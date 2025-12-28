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

export function articleSchema(article: {
    title: string
    description: string
    image: string
    datePublished: string
    dateModified: string
    author: string
    url: string
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        image: article.image,
        datePublished: article.datePublished,
        dateModified: article.dateModified,
        author: {
            '@type': 'Person',
            name: article.author,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Ivan Ivanovich Academia',
            logo: {
                '@type': 'ImageObject',
                url: 'https://ivanivanovich.com/logo.png',
            },
        },
        url: article.url,
    }
}

export function personSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Ivan Ivanovich',
        jobTitle: 'Experto en Protección Ejecutiva',
        description: 'Instructor y experto reconocido internacionalmente en protección ejecutiva y seguridad privada',
        url: 'https://ivanivanovich.com/ivan',
        image: 'https://ivanivanovich.com/ivan-photo.jpg',
        sameAs: [
            // Add Ivan's social profiles
        ],
    }
}
