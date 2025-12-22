import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { translations, Language } from '@/lib/translations';

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const posts = await prisma.blogPost.findMany({
        select: { slug: true },
        where: { published: true }
    });
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;

    const cookieStore = await cookies();
    const locale = (cookieStore.get('NEXT_LOCALE')?.value || 'es') as Language;
    const t = translations[locale];

    const post = await prisma.blogPost.findUnique({
        where: { slug },
        include: { author: true }
    });

    if (!post) {
        notFound();
    }

    // Redirect logic based on language
    if (locale === 'en' && post.language === 'es') {
        // Try to find the English version
        // Assumption: English slug is spanish-slug + "-en"
        const englishSlug = `${slug}-en`;
        const englishPost = await prisma.blogPost.findUnique({
            where: { slug: englishSlug },
            select: { slug: true }
        });

        if (englishPost) {
            redirect(`/blog/${englishPost.slug}`);
        }
    } else if (locale === 'es' && post.language === 'en') {
        // Try to find the Spanish version
        // Assumption: current slug ends with "-en"
        if (slug.endsWith('-en')) {
            const spanishSlug = slug.slice(0, -3);
            const spanishPost = await prisma.blogPost.findUnique({
                where: { slug: spanishSlug },
                select: { slug: true }
            });

            if (spanishPost) {
                redirect(`/blog/${spanishPost.slug}`);
            }
        }
    }

    // Fetch recent posts for sidebar
    const recentPosts = await prisma.blogPost.findMany({
        where: {
            published: true,
            slug: { not: slug }
        },
        orderBy: { createdAt: 'desc' },
        take: 3
    });

    // Logic to inject banners
    const banners = [
        '/images/banners/banner1.jpg?v=2',
        '/images/banners/banner2.jpg?v=2',
        '/images/banners/banner3.jpg?v=2',
        '/images/banners/banner4.jpg?v=2'
    ];

    // Helper to decode HTML entities if needed (though JSON import usually handles standard escapes)
    const decodeHtmlEntities = (str: string) => {
        return str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
            .replace(/\\u([\d\w]{4})/gi, (match, grp) => String.fromCharCode(parseInt(grp, 16)));
    };

    let contentWithBanners = post.content;

    // Ensure content is a string and decode potential unicode escapes if they persisted
    const cleanContent = decodeHtmlEntities(post.content);

    // Determine the delimiter based on content structure
    let delimiter = '';
    let splitRegex: RegExp;

    if (/<\/p>/i.test(cleanContent)) {
        delimiter = '</p>';
        splitRegex = /<\/p>/i;
    } else if (/\r\n\r\n/.test(cleanContent)) {
        delimiter = '\r\n\r\n';
        splitRegex = /\r\n\r\n/;
    } else if (/\n\n/.test(cleanContent)) {
        delimiter = '\n\n';
        splitRegex = /\n\n/;
    } else {
        // Fallback for single newlines or other formats
        delimiter = '\n';
        splitRegex = /\n/;
    }

    console.log(`[BannerDebug] Post: ${slug}, Delimiter found: "${delimiter.replace(/\n/g, '\\n').replace(/\r/g, '\\r')}"`);

    // Split content by paragraphs using the determined regex
    const paragraphs = cleanContent.split(splitRegex);

    console.log(`[BannerDebug] Post: ${slug}, Paragraphs: ${paragraphs.length}`);

    // If we have enough paragraphs, inject banners
    if (paragraphs.length > 2) {
        const newContentParts: string[] = [];

        // We want to inject 4 banners.
        // Banner 1: After 2nd paragraph (index 1)
        // Banners 2, 3: Distributed in the middle
        // Banner 4: ALWAYS at the end

        const totalBannersToDistribute = 3; // Banners 1, 2, 3
        let bannersInjected = 0;

        // Calculate distribution for banners 2 and 3
        // We have paragraphs.length - 2 (first two) - 1 (last one)
        const remainingParagraphs = paragraphs.length - 2;
        // Avoid division by zero
        const interval = remainingParagraphs > 0 ? Math.ceil(remainingParagraphs / (totalBannersToDistribute - 1 + 1)) : 1;

        console.log(`[BannerDebug] Interval calculated: ${interval}`);

        paragraphs.forEach((paragraph, index) => {
            if (paragraph.trim() === '') {
                return;
            }

            newContentParts.push(paragraph + delimiter);

            // Logic to inject banners

            // 1. First Banner: Always after the 2nd paragraph (index 1)
            if (index === 1 && bannersInjected < 1) {
                newContentParts.push(`
                    <div class="my-8 w-full flex justify-center">
                        <img src="${banners[0]}" alt="Banner Publicidad 1" class="w-full h-auto rounded-lg shadow-md object-cover" />
                    </div>
                `);
                bannersInjected++;
                console.log(`[BannerDebug] Injected Banner 1 at index ${index}`);
            }

            // 2. Middle Banners (2 and 3)
            else if (index > 1 && bannersInjected < 3) {
                const relativeIndex = index - 1;

                if (relativeIndex % interval === 0) {
                    newContentParts.push(`
                        <div class="my-8 w-full flex justify-center">
                            <img src="${banners[bannersInjected]}" alt="Banner Publicidad ${bannersInjected + 1}" class="w-full h-auto rounded-lg shadow-md object-cover" />
                        </div>
                    `);
                    bannersInjected++;
                    console.log(`[BannerDebug] Injected Banner ${bannersInjected} at index ${index}`);
                }
            }
        });

        // 3. Last Banner (4): Always append at the very end
        newContentParts.push(`
            <div class="my-8 w-full flex justify-center">
                <img src="${banners[3]}" alt="Banner Publicidad 4" class="w-full h-auto rounded-lg shadow-md object-cover" />
            </div>
        `);
        console.log(`[BannerDebug] Injected Banner 4 at the end`);

        contentWithBanners = newContentParts.join('');
    } else {
        console.log(`[BannerDebug] Not enough paragraphs to inject banners (${paragraphs.length})`);
        // Even if not enough paragraphs, try to append at least one banner or the last one if requested?
        // For now, let's just append the last banner if content is short but exists
        if (cleanContent.length > 0) {
            contentWithBanners += `
                <div class="my-8 w-full flex justify-center">
                    <img src="${banners[3]}" alt="Banner Publicidad 4" class="w-full h-auto rounded-lg shadow-md object-cover" />
                </div>
            `;
        }
    }



    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0 mb-10">
                    <Link href="/blog" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        {t.blog.backToBlog}
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content Column (2/3 width on large screens) */}
                    <div className="lg:col-span-2">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <h1 className="mt-2 font-bold tracking-tight text-gray-900 text-3xl md:text-[42px] leading-tight" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
                                {post.title}
                            </h1>
                            <div className="mt-6 flex items-center gap-x-4 text-xs text-gray-500">
                                <time dateTime={post.createdAt.toISOString()}>
                                    <time dateTime={post.createdAt.toISOString()}>
                                        {new Date(post.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </time>
                                </time>
                                <span>•</span>
                                <div className="flex items-center gap-x-2">
                                    <img
                                        src={post.author?.image || '/images/ivan-avatar.jpg'}
                                        alt={post.author?.name || 'Ivan Ivanovich'}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                    <span className="font-medium text-gray-900">{post.author?.name || 'Ivan Ivanovich'}</span>
                                </div>
                            </div>
                        </div>

                        {post.image && (
                            <div className="mt-10 aspect-video w-full overflow-hidden rounded-2xl bg-gray-100">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}

                        <div className="mt-10 max-w-none">
                            <div
                                dangerouslySetInnerHTML={{ __html: contentWithBanners }}
                                className="blog-content"
                            />
                        </div>
                    </div>

                    {/* Sidebar Column (1/3 width on large screens) */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-gray-50 p-6 rounded-2xl sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
                                {t.blog.recentArticles}
                            </h3>
                            <div className="space-y-6">
                                {recentPosts.map((recentPost) => (
                                    <div key={recentPost.slug} className="flex flex-col gap-2 group">
                                        <Link href={`/blog/${recentPost.slug}`} className="block overflow-hidden rounded-lg aspect-[3/2] bg-gray-200">
                                            {recentPost.image ? (
                                                <img
                                                    src={recentPost.image}
                                                    alt={recentPost.title}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                        </Link>
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">
                                                {new Date(recentPost.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                            <Link href={`/blog/${recentPost.slug}`}>
                                                <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
                                                    {recentPost.title}
                                                </h4>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <Link href="/blog" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
                                    {t.blog.viewAllArticles} <span>→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
