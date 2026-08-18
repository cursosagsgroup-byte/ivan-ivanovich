import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://ivanivanovich.com'

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/servicios`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/educacion/cursos-online`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/ivan`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contacto`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ]

    // Versión en inglés de las páginas fijas. Desde que /en se sirve con 200
    // (antes redirigía), son URLs indexables por derecho propio y el hreflang
    // de cada página apunta a ellas, así que deben figurar en el sitemap.
    const staticPagesEn: MetadataRoute.Sitemap = staticPages.map((page) => ({
        ...page,
        url: page.url === baseUrl ? `${baseUrl}/en` : page.url.replace(baseUrl, `${baseUrl}/en`),
        priority: typeof page.priority === 'number' ? Math.max(page.priority - 0.1, 0.1) : undefined,
    }))

    // Dynamic course pages
    const courses = await prisma.course.findMany({
        select: {
            id: true,
            updatedAt: true,
        },
    })

    const coursePages: MetadataRoute.Sitemap = [
        // Spanish courses
        {
            url: `${baseUrl}/educacion/team-leader`,
            lastModified: courses.find(c => c.id === 'cmio13v7r000064w1fs838sgw')?.updatedAt || new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/educacion/contravigilancia`,
            lastModified: courses.find(c => c.id === 'cmio13v7u000164w1bhkqj8ej')?.updatedAt || new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        // English courses
        {
            url: `${baseUrl}/en/educacion/team-leader`,
            lastModified: courses.find(c => c.id === 'cmiq7oga203zikveg3jbf8p8u')?.updatedAt || new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/en/educacion/contravigilancia`,
            lastModified: courses.find(c => c.id === 'cmiq7oga703zjkvegaq8v1ir4')?.updatedAt || new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
    ]

    // Dynamic blog posts
    const blogPosts = await prisma.blogPost.findMany({
        where: {
            published: true,
        },
        select: {
            slug: true,
            updatedAt: true,
        },
    })

    const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    return [...staticPages, ...staticPagesEn, ...coursePages, ...blogPages]
}
