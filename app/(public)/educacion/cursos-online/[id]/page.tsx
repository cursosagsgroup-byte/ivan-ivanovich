import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Check, ChevronDown, Play, Clock, Award, Users } from 'lucide-react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { translations } from '@/lib/translations';
import ModuleList from './ModuleList';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
    const { id } = await params;

    // Server-side logging safe for production (stdout)
    console.log(`[INFO] Rendering course page for ID: ${id}`);

    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'es';
    const t = translations[locale as 'es' | 'en'] || translations.es; // Fallback to 'es' safety

    try {
        const course = await prisma.course.findUnique({
            where: { id },
            include: {
                modules: {
                    orderBy: { order: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' }
                        }
                    }
                }
            }
        });

        if (!course) {
            console.warn(`[WARN] Course not found for ID: ${id}`);
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
                    <Award className="w-16 h-16 text-yellow-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Curso no encontrado</h1>
                    <p className="text-gray-400 mb-6">No pudimos encontrar el curso con ID: {id}</p>
                    <a href="/" className="px-6 py-2 bg-[#B70126] rounded-full hover:bg-[#90011E] transition-colors">
                        Volver al Inicio
                    </a>
                </div>
            );
        }

        // Calculate total duration (placeholder logic as duration is 0 in db currently)
        const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
        // const estimatedDuration = `${Math.max(10, Math.ceil(totalLessons * 0.5))}+ Horas`; // Unused variable

        return (
            <div className="min-h-screen bg-white">
                <PublicNavbar />
                {/* Hero Section */}
                <div className="pt-32 pb-8 lg:pt-48 lg:pb-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-[90%]">
                    <div className="relative rounded-[30px] overflow-hidden bg-[#0B121F] isolate shadow-2xl">
                        <div className="absolute inset-0 -z-10 opacity-40">
                            {/* Placeholder for background image if needed later */}
                        </div>

                        <div className="mx-auto max-w-full px-6 py-16 lg:px-12 lg:py-24 relative z-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                {/* Left Column: Title */}
                                <div className="text-left">
                                    <div className="inline-block bg-[#B70126] rounded-full px-8 py-3 mb-6">
                                        <span className="text-white font-bold text-xl lg:text-2xl uppercase tracking-wide" style={{ fontFamily: 'var(--font-montserrat)' }}>
                                            {locale === 'es' ? 'CURSO ONLINE' : 'ONLINE COURSE'}
                                        </span>
                                    </div>
                                    <h1 className="text-5xl lg:text-7xl font-normal text-white uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
                                        {course.title}
                                    </h1>
                                </div>

                                {/* Right Column: Image */}
                                <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl">
                                    {course.image ? (
                                        <Image
                                            src={course.image}
                                            alt={course.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                            <Award className="w-20 h-20 text-white/20" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <PublicFooter /> */}
            </div>
        );
    } catch (error) {
        console.error('[ERROR] Failed to fetch course:', error);
        throw error; // Let app/error.tsx handle it with a user-friendly message
    }
}

