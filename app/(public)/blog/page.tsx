import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { translations } from '@/lib/translations';
import Pagination from '@/components/ui/Pagination';
import BlogSearch from '@/components/blog/BlogSearch';
import { Prisma } from '@prisma/client';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog - Protección Ejecutiva y Seguridad',
    description: 'Artículos, noticias y recursos sobre protección ejecutiva, seguridad privada y formación profesional. Actualizado regularmente por expertos en el sector.',
    openGraph: {
        title: 'Blog - Ivan Ivanovich Academia',
        description: 'Contenido experto sobre protección ejecutiva y seguridad privada',
        type: 'website',
    },
};

export default async function BlogIndexPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams;
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'es';
    const t = translations[locale as 'es' | 'en'];

    // Pagination and Search parameters
    const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1;
    const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
    const limit = 12; // 4 rows of 3 articles
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: Prisma.BlogPostWhereInput = {
        published: true,
        language: locale,
        ...(search && {
            OR: [
                { title: { contains: search } }, // Case insensitive by default in SQLite/Postgres usually, but depends on DB collation
                { content: { contains: search } },
                { excerpt: { contains: search } }
            ]
        })
    };

    // Fetch total count for pagination
    const totalPosts = await prisma.blogPost.count({
        where: whereClause
    });

    const totalPages = Math.ceil(totalPosts / limit);

    // Fetch posts from database, sorted by date descending, filtered by language, with pagination
    const sortedPosts = await prisma.blogPost.findMany({
        where: whereClause,
        orderBy: [
            { pinned: 'desc' },
            { createdAt: 'desc' }
        ],
        include: { author: true },
        skip: skip,
        take: limit
    });

    return (
        <div className="bg-white min-h-screen pt-24">
            {/* Hero Section */}
            <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-[95%]">
                <div className="relative rounded-[30px] overflow-hidden bg-[#0B121F] isolate shadow-2xl min-h-[500px] lg:h-[38vh] lg:min-h-[350px] flex items-center py-8 lg:py-0">
                    <div className="absolute inset-0 -z-10 opacity-40">
                        <img
                            src="/course-hero-bg.png"
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="w-full px-6 lg:px-12 relative z-10">
                        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 items-center">
                            {/* Left Column: Title */}
                            <div className="text-center lg:text-left">
                                <h1 className="text-6xl lg:text-8xl font-normal text-white uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {t.blog.heroTitle}
                                </h1>
                            </div>

                            {/* Right Column: Image */}
                            <div className="flex justify-center lg:justify-end w-full mt-2 lg:mt-0">
                                <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border-4 border-white shadow-2xl lg:h-[28vh] lg:w-auto">
                                    <img
                                        src="/ivan-photo.jpg"
                                        alt="Ivan Ivanovich"
                                        className="w-full h-full object-cover object-center"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="bg-white py-16 sm:py-24">
                <div className="mx-auto max-w-[95%] lg:max-w-[90%] px-4 lg:px-8">

                    {/* Search Bar */}
                    <BlogSearch placeholder={locale === 'es' ? 'Buscar artículos...' : 'Search articles...'} />

                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {sortedPosts.length > 0 ? (
                            sortedPosts.map((post) => (
                                <article key={post.id} className="flex flex-col items-start justify-between">
                                    <div className="relative w-full">
                                        <div className="aspect-video w-full rounded-2xl bg-gray-100 overflow-hidden sm:aspect-[2/1] lg:aspect-[3/2]">
                                            {post.image ? (
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="absolute inset-0 h-full w-full object-cover object-top"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-gray-400">
                                                    {t.blog.noImage}
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                                    </div>
                                    <div className="max-w-xl">
                                        <div className="mt-8 flex items-center gap-x-4 text-xs">
                                            <time dateTime={post.createdAt.toISOString()} className="text-gray-500">
                                                {new Date(post.createdAt).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </time>
                                        </div>
                                        <div className="group relative">
                                            <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
                                                <Link href={`/blog/${post.slug}`}>
                                                    <span className="absolute inset-0" />
                                                    {post.title}
                                                </Link>
                                            </h3>
                                            <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                                                {post.excerpt ? post.excerpt.replace(/<[^>]*>/g, '') : ''}
                                            </p>
                                        </div>
                                        <div className="relative mt-8 flex items-center gap-x-4">
                                            <div className="text-sm leading-6">
                                                <p className="font-semibold text-gray-900">
                                                    <span className="absolute inset-0" />
                                                    {post.author?.name || 'Ivan Ivanovich'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                {locale === 'es' ? 'No se encontraron artículos.' : 'No articles found.'}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            baseUrl="/blog"
                            searchQuery={search}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
