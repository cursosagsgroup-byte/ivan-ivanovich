import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getLocale } from '@/lib/get-locale';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { translations, Language } from '@/lib/translations';

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

import { Metadata } from 'next';
import { StructuredData } from '@/components/seo/StructuredData';
import { articleSchema, personSchema } from '@/lib/seo-utils';
import KeyPoints, { type PuntoClave } from '@/components/blog/KeyPoints';
import ShareArticle from '@/components/blog/ShareArticle';

export async function generateStaticParams() {
    const posts = await prisma.blogPost.findMany({
        select: { slug: true },
        where: { published: true }
    });
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
        where: { slug },
        select: {
            title: true,
            excerpt: true,
            image: true,
            published: true,
            language: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });

    if (!post) {
        return {
            title: 'Artículo no encontrado',
            description: 'El artículo que buscas no existe o ha sido movido.'
        };
    }

    const baseUrl = 'https://ivanivanovich.com';
    const imageUrl = post.image
        ? (post.image.startsWith('http') ? post.image : `${baseUrl}${post.image}`)
        : `${baseUrl}/images/og-image.jpg`;

    // Determine locale and fallback text based on post language
    const isEnglish = post.language === 'en';
    const locale = isEnglish ? 'en_US' : 'es_ES';
    const fallbackText = isEnglish
        ? `Read the article "${post.title}" on Ivan Ivanovich Academy.`
        : `Lee el artículo "${post.title}" en Ivan Ivanovich Academy.`;

    // Pareja de idiomas: la versión en inglés es el mismo slug con sufijo -en.
    // Se comprueba que exista para no declarar un hreflang que apunte a un 404.
    const slugEs = slug.endsWith('-en') ? slug.slice(0, -3) : slug;
    const slugEn = `${slugEs}-en`;
    const gemelo = await prisma.blogPost.findFirst({
        where: { slug: slug === slugEs ? slugEn : slugEs, published: true },
        select: { slug: true },
    });

    const languages: Record<string, string> = {};
    if (slug === slugEs) {
        languages['es'] = `${baseUrl}/blog/${slugEs}`;
        if (gemelo) languages['en'] = `${baseUrl}/blog/${slugEn}`;
    } else {
        languages['en'] = `${baseUrl}/blog/${slugEn}`;
        if (gemelo) languages['es'] = `${baseUrl}/blog/${slugEs}`;
    }
    if (languages['es']) languages['x-default'] = languages['es'];

    return {
        title: post.title,
        description: post.excerpt || fallbackText,
        alternates: {
            canonical: `${baseUrl}/blog/${slug}`,
            languages,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt || fallbackText,
            url: `${baseUrl}/blog/${slug}`,
            siteName: 'Ivan Ivanovich Academy',
            locale: locale,
            type: 'article',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                }
            ],
            authors: [post.author?.name || 'Ivan Ivanovich'],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt || fallbackText,
            images: [imageUrl],
        }
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;

    const cookieStore = await cookies();
    const locale = (await getLocale()) as Language;
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
        const englishSlug = slug.endsWith('-en') ? slug : `${slug}-en`;
        const englishPost = await prisma.blogPost.findUnique({
            where: { slug: englishSlug },
            select: { slug: true }
        });

        if (englishPost && englishPost.slug !== slug) {
            redirect(`/blog/${englishPost.slug}`);
        }
    } else if (locale === 'es' && post.language === 'en') {
        // Try to find the Spanish version
        const spanishSlug = slug.endsWith('-en') ? slug.slice(0, -3) : slug;
        const spanishPost = await prisma.blogPost.findUnique({
            where: { slug: spanishSlug },
            select: { slug: true }
        });

        if (spanishPost && spanishPost.slug !== slug) {
            redirect(`/blog/${spanishPost.slug}`);
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

    // Helper to transform YouTube links into embeds
    const transformYouTubeLinks = (html: string) => {
        // Match standard links in anchor tags: <a href="...youtube...">...</a>
        const linkRegex = /<a\s+(?:[^>]*?\s+)?href="(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^"&?\/]+)[^"]*)"[^>]*>.*?<\/a>/gi;

        return html.replace(linkRegex, (match, url, videoId) => {
            return `
                <div class="my-8 w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}" 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen 
                        class="w-full h-full"
                    ></iframe>
                </div>
            `;
        });
    };

    let contentWithBanners = post.content;

    // Ensure content is a string and decode potential unicode escapes if they persisted
    const cleanContent = transformYouTubeLinks(decodeHtmlEntities(post.content));

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
                        <img src="${banners[0]}" alt="Banner Publicidad 1" class="w-full h-auto shadow-md object-cover" />
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
                            <img src="${banners[bannersInjected]}" alt="Banner Publicidad ${bannersInjected + 1}" class="w-full h-auto shadow-md object-cover" />
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
                <img src="${banners[3]}" alt="Banner Publicidad 4" class="w-full h-auto shadow-md object-cover" />
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
                    <img src="${banners[3]}" alt="Banner Publicidad 4" class="w-full h-auto shadow-md object-cover" />
                </div>
            `;
        }
    }



    // Tiempo de lectura a partir del texto real, sin etiquetas HTML.
    const palabras = post.content.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
    const minutosLectura = Math.max(1, Math.round(palabras / 200));
    const puntosClave = (Array.isArray(post.keyPoints) ? post.keyPoints : []) as PuntoClave[];

    // La franja de puntos clave se intercala tras los primeros párrafos, no al
    // principio ni al final: así funciona como una parada dentro de la lectura.
    const PARRAFOS_ANTES = 4;
    let aperturaTexto = contentWithBanners;
    let restoTexto = '';
    if (puntosClave.length > 0) {
        const corte = (() => {
            let pos = 0;
            for (let i = 0; i < PARRAFOS_ANTES; i++) {
                const siguiente = contentWithBanners.indexOf('</p>', pos);
                if (siguiente === -1) return -1;
                pos = siguiente + 4;
            }
            return pos;
        })();
        if (corte > 0 && corte < contentWithBanners.length) {
            aperturaTexto = contentWithBanners.slice(0, corte);
            restoTexto = contentWithBanners.slice(corte);
        }
    }

    return (
        <div className="bg-white pb-24 blog-page-container blog-noche">
            {/* Datos estructurados: sin ellos las IA no ven autor ni fecha del artículo */}
            <StructuredData data={articleSchema({
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                image: post.image,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                language: post.language,
                authorName: post.author?.name,
            })} />
            <StructuredData data={personSchema()} />
            {/* Portada: la foto cubre todo el fondo y un degradado negro por la
                izquierda asienta el texto. La banda es alta (620px) porque en
                una tira estrecha la foto se recortaba hasta perder la escena. */}
            <header className="blog-hero relative w-full overflow-hidden bg-white lg:bg-[#0B0B0D]">
                {post.image && (
                    <>
                        <img
                            src={post.image}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 hidden h-full w-full object-cover object-[50%_32%] lg:block"
                        />
                        {/* Capa negra traslúcida uniforme: oscurece lo justo para
                            que el título blanco lea sin esconder la foto. */}
                        <div className="absolute inset-0 hidden bg-black/55 lg:block" />
                    </>
                )}
                <div className="relative mx-auto flex max-w-[1440px] flex-col justify-center px-6 pb-8 pt-28 sm:pb-10 lg:min-h-[720px] lg:px-8 lg:pb-20 lg:pt-36">
                    <div className="max-w-3xl">
                        <p className="blog-hero-etiqueta mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#B70126]">
                            {t.blog.categoryLabel}
                        </p>
                        <div className="mb-6 h-[3px] w-12 bg-[#B70126]" />
                        <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-[56px] lg:text-white" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
                            {post.title}
                        </h1>
                        {post.subtitle && (
                            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg lg:text-white">
                                {post.subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </header>

            {/* En móvil la portada se ve entera bajo el título; en ordenador va de fondo del hero */}
            {post.image && (
                <figure className="w-full lg:hidden">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="h-auto w-full"
                    />
                </figure>
            )}

            <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
                <div className="pt-6">
                    <Link href="/blog" className="text-sm font-semibold leading-6 text-[#B70126] hover:underline">
                        {t.blog.backToBlog}
                    </Link>
                </div>

                {/* Autor, fecha, tiempo de lectura y compartir */}
                <div className="mt-4 flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-x-3">
                        <img
                            src={post.author?.image || '/images/ivan-avatar.jpg'}
                            alt={post.author?.name || 'Ivan Ivanovich'}
                            className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-semibold text-gray-900">{post.author?.name || 'Ivan Ivanovich'}</p>
                            <p className="text-sm text-gray-500">
                                <time dateTime={post.createdAt.toISOString()}>
                                    {new Date(post.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
                                        year: 'numeric', month: 'long', day: 'numeric',
                                    })}
                                </time>
                                <span className="mx-2">•</span>
                                {minutosLectura} {locale === 'en' ? 'min read' : 'min de lectura'}
                            </p>
                        </div>
                    </div>
                    <ShareArticle slug={post.slug} title={post.title} locale={locale} />
                </div>

                <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Columna del artículo */}
                    <div className="lg:col-span-2">
                        <div className="max-w-[800px]">
                            <div
                                dangerouslySetInnerHTML={{ __html: aperturaTexto }}
                                className="blog-content blog-articulo"
                            />
                            {/* La franja de puntos clave vive dentro del texto */}
                            <KeyPoints puntos={puntosClave} titulo={locale === 'en' ? 'Key points' : 'Puntos clave'} />
                            <div
                                dangerouslySetInnerHTML={{ __html: restoTexto }}
                                className="blog-content blog-articulo blog-articulo--continuacion"
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
