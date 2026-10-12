'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    image: string;
    createdAt: string;
}

/** Carrusel de artículos del inicio: mismo lenguaje visual que los cursos
 *  (etiqueta monoespaciada, línea divisoria, ancho completo) pero en
 *  formato carrusel — las líneas separan las tarjetas visibles en vez de
 *  filas fijas. */
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
        return <div className="flex h-96 w-full items-center justify-center bg-white text-sm text-gray-400">…</div>;
    }

    if (posts.length === 0) {
        return null;
    }

    return (
        <div className="bg-white py-16 lg:py-20">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
                {/* Encabezado con la etiqueta y los controles del carrusel */}
                <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-gray-400">
                            {t('home.blogKicker')}
                        </p>
                        <h2
                            className="text-4xl font-normal uppercase leading-none text-[#16171a] lg:text-6xl"
                            style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.02em' }}
                        >
                            {t('home.blogTitle')}
                        </h2>
                    </div>
                    <div className="flex shrink-0 gap-px">
                        <button
                            onClick={scrollPrev}
                            className="flex h-11 w-11 items-center justify-center bg-[#16171a] text-white transition-colors hover:bg-[#B70126]"
                            aria-label="Anterior"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={scrollNext}
                            className="flex h-11 w-11 items-center justify-center bg-[#16171a] text-white transition-colors hover:bg-[#B70126]"
                            aria-label="Siguiente"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="border-t border-gray-200">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                            {posts.map((post, i) => (
                                <div
                                    key={post.id}
                                    className={`min-w-0 flex-[0_0_86%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] ${i > 0 ? 'border-l border-gray-200' : ''}`}
                                >
                                    <article className={`group/card flex h-full flex-col pb-2 pt-8 lg:pt-10 ${i > 0 ? 'pl-6 lg:pl-12' : 'pr-6 lg:pr-12'}`}>
                                        <div className="mb-5 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.14em]">
                                            <span className="text-gray-400">{t('home.articleKicker')}</span>
                                            <time dateTime={post.createdAt} className="text-gray-400">
                                                {new Date(post.createdAt).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </time>
                                        </div>

                                        <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] w-full overflow-hidden bg-gray-100">
                                            {post.image ? (
                                                <Image
                                                    src={post.image}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                                                    sizes="(max-width: 640px) 86vw, (max-width: 1024px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-gray-400">
                                                    {t('blog.noImage')}
                                                </div>
                                            )}
                                        </Link>

                                        <h3
                                            className="mb-3 mt-6 text-xl font-bold leading-snug text-[#16171a] line-clamp-2"
                                            style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                                        >
                                            <Link href={`/blog/${post.slug}`} className="transition-colors group-hover/card:text-[#B70126]">
                                                {post.title}
                                            </Link>
                                        </h3>

                                        <p className="mb-6 flex-grow text-base leading-relaxed text-gray-600 line-clamp-3 lg:text-[17px]">
                                            {post.excerpt ? post.excerpt.replace(/<[^>]*>/g, '') : ''}
                                        </p>

                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="mt-auto flex w-fit items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#B70126]"
                                        >
                                            {t('home.readArticle')}
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover/card:translate-x-1" />
                                        </Link>
                                    </article>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
