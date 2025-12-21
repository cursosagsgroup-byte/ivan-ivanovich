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
    const fs = require('fs');
    const path = require('path');
    const logPath = path.join(process.cwd(), 'debug.log');
    const log = (msg: string) => fs.appendFileSync(logPath, msg + '\n');

    const { id } = await params;
    log(`[DEBUG] Rendering course page for ID: ${id}`);
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'es';
    log(`[DEBUG] Locale: ${locale}`);
    const t = translations[locale as 'es' | 'en'];
    log(`[DEBUG] Translations loaded: ${!!t}`);

    log(`[DEBUG] Fetching course from Prisma...`);

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
    log(`[DEBUG] Course fetch result: ${course ? 'Found' : 'Not Found'}`);
    if (course) {
        log(`[DEBUG] Course title: ${course.title}`);
        log(`[DEBUG] Modules count: ${course.modules.length}`);
    }

    if (!course) {
        notFound();
    }

    // Calculate total duration (placeholder logic as duration is 0 in db currently)
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const estimatedDuration = `${Math.max(10, Math.ceil(totalLessons * 0.5))}+ Horas`; // Rough estimate

    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />
            {/* Hero Section */}
            <div className="pt-32 pb-8 lg:pt-48 lg:pb-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-[90%]">
                <div className="relative rounded-[30px] overflow-hidden bg-[#0B121F] isolate shadow-2xl">
                    <div className="absolute inset-0 -z-10 opacity-40">
                        {/* <Image
                            src="/course-hero-bg.png"
                            alt="Background"
                            fill
                            className="object-cover"
                            priority
                        /> */}
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
                                {/* {course.image ? (
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
                                )} */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <PublicFooter /> */}
        </div>
    );
}
