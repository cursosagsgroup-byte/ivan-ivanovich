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
            url: `${baseUrl}/en/educacion/counter-surveillance`,
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

    return [...staticPages, ...coursePages, ...blogPages]
}
