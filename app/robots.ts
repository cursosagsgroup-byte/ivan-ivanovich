import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/mi-cuenta/',
                    '/curso/',
                    '/_next/',
                    '/private/',
                ],
            },
        ],
        sitemap: 'https://ivanivanovich.com/sitemap.xml',
    }
}
