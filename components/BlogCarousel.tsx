'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    image: string;
    createdAt: string;
}

export default function BlogCarousel() {
    const { t, language } = useTranslation();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
        Autoplay({ delay: 4000, stopOnInteraction: false })
    ]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/blog?language=${language}`);
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data);
                }
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [language]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    if (loading) {
        return <div className="h-96 flex items-center justify-center">Loading...</div>;
    }

    if (posts.length === 0) {
        return null;
    }

    return (
        <div className="relative group">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-4 sm:-ml-8">
                    {posts.map((post) => (
                        <div key={post.id} className="flex-[0_0_100%] min-w-0 pl-4 sm:pl-8 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
                            <article className="flex flex-col h-full">
                                <div className="relative w-full overflow-hidden rounded-2xl aspect-video mb-6 group/card">
                                    {post.image ? (
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                            {t('blog.noImage')}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/10 transition-colors" />
                                </div>

                                <div className="flex flex-col flex-grow">
                                    <div className="flex items-center gap-x-4 text-xs text-gray-500 mb-3">
                                        <time dateTime={post.createdAt}>
                                            {new Date(post.createdAt).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </time>
                                    </div>

                                    <h3 className="text-xl font-bold leading-snug text-slate-900 mb-3 line-clamp-2 group-hover:text-[#B70126] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                        <Link href={`/blog/${post.slug}`}>
                                            <span className="absolute inset-0" />
                                            {post.title}
                                        </Link>
                                    </h3>

                                    <p className="text-sm leading-relaxed text-gray-600 line-clamp-3 mb-4 flex-grow">
                                        {post.excerpt ? post.excerpt.replace(/<[^>]*>/g, '') : ''}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm font-medium text-[#B70126]">
                                        {t('home.readArticle')}
                                        <svg className="w-4 h-4 transition-transform group-hover/card:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-900 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#B70126] hover:text-white disabled:opacity-0 z-10"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={scrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-900 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#B70126] hover:text-white disabled:opacity-0 z-10"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
}
