'use client';

import Link from 'next/link';
import posts from '@/app/data/blog-posts.json';
import { useTranslation } from '@/hooks/useTranslation';

interface BlogSectionProps {
    limit?: number;
}

export default function BlogSection({ limit }: BlogSectionProps) {
    const { t, language } = useTranslation();

    // Sort posts by date descending
    const sortedPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const displayPosts = limit ? sortedPosts.slice(0, limit) : sortedPosts;

    return (
        <section className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-4xl font-black tracking-tight text-black sm:text-5xl mb-6 uppercase" style={{
                        fontFamily: 'Montserrat, sans-serif'
                    }}>
                        {t('home.blogTitle')}
                    </h2>
                </div>

                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {displayPosts.map((post) => (
                        <article key={post.id} className="flex flex-col items-start">
                            <div className="relative w-full">
                                <div className="aspect-video w-full rounded-lg bg-slate-200 overflow-hidden">
                                    {post.image ? (
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            {t('blog.noImage')}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="max-w-xl mt-6">
                                <div className="flex items-center gap-x-4 text-xs text-gray-500">
                                    <time dateTime={post.date}>
                                        {new Date(post.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </time>
                                </div>
                                <div className="group relative mt-3">
                                    <h3 className="text-lg font-bold leading-6 text-black group-hover:text-gray-700">
                                        <Link href={`/blog/${post.slug}`}>
                                            <span className="absolute inset-0" />
                                            {post.title}
                                        </Link>
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-gray-600 line-clamp-3">
                                        {post.excerpt ? post.excerpt.replace(/<[^>]*>/g, '') : ''}
                                    </p>
                                    <p className="mt-2 text-xs text-gray-500">{post.author}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {limit && limit < sortedPosts.length && (
                    <div className="mt-12 text-center">
                        <Link
                            href="/blog"
                            className="inline-block rounded bg-black px-8 py-3 text-sm font-bold uppercase text-white hover:bg-gray-800 transition-colors"
                        >
                            {language === 'es' ? 'Ver todas las entradas' : 'View all posts'}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
