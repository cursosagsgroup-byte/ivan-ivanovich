import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, Users, Award } from 'lucide-react';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { translations } from '@/lib/translations';


export default async function CursosOnlinePage() {
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'es';
    const t = translations[locale as 'es' | 'en'];

    // Fetch published courses from database filtered by language
    const courses = await prisma.course.findMany({
        where: {
            published: true,
            language: locale,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return (
        <div className="bg-white min-h-screen pt-24">
            {/* Hero Section */}
            <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-[95%]">
                <div className="relative rounded-[30px] overflow-hidden bg-[#0B121F] isolate shadow-2xl min-h-[500px] lg:h-[38vh] lg:min-h-[350px] flex items-center py-8 lg:py-0">
                    <div className="absolute inset-0 -z-10 opacity-40">
                        <Image
                            src="/course-hero-bg.png"
                            alt="Background"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="w-full px-6 lg:px-12 relative z-10">
                        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 items-center">
                            {/* Left Column: Title */}
                            <div className="text-center lg:text-left">
                                <h1 className="text-6xl lg:text-8xl font-normal text-white uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {t.courses.title}
                                </h1>
                            </div>

                            {/* Right Column: Image */}
                            <div className="flex justify-center lg:justify-end w-full mt-2 lg:mt-0">
                                <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border-4 border-white shadow-2xl lg:h-[28vh] lg:w-auto">
                                    <Image
                                        src="/course-hero-image.jpg"
                                        alt="Cursos en línea"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">

                {/* Courses Grid */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {courses.map((course) => {
                        const getCourseLink = (title: string, id: string) => {
                            const lowerTitle = title.toLowerCase();
                            if (lowerTitle.includes('team leader')) return '/educacion/team-leader';
                            if (lowerTitle.includes('contravigilancia')) return '/educacion/contravigilancia';
                            if (lowerTitle.includes('counter surveillance')) return '/educacion/counter-surveillance';
                            if (lowerTitle.includes('libro')) return '/educacion/libro';
                            // Specific match for "Protección Ejecutiva, Operatividad General y Logística Protectiva"
                            // Using a significant substring to ensure it matches the correct course and NOT others like "Contravigilancia..."
                            if (lowerTitle.includes('operatividad general') && lowerTitle.includes('logística')) return '/proteccion-ejecutiva-operatividad-general';
                            return `/educacion/cursos-online/${id}`;
                        };

                        const courseLink = getCourseLink(course.title, course.id);

                        return (
                            <div
                                key={course.id}
                                className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 hover:ring-[#B70126]/50 transition-all shadow-lg"
                            >
                                {/* Course Image */}
                                <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
                                    <Link href={courseLink} className="block w-full h-full">
                                        {course.image ? (
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                <Award className="w-16 h-16" />
                                            </div>
                                        )}
                                    </Link>
                                </div>

                                {/* Course Content */}
                                <div className="p-6">
                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-black mb-2 group-hover:text-[#B70126] transition-colors">
                                        <Link href={courseLink}>
                                            {course.title}
                                        </Link>
                                    </h3>

                                    {/* Instructor */}
                                    <p className="text-sm text-gray-600 mb-4">{t.courses.instructor}</p>

                                    {/* Description */}
                                    <p className="text-gray-700 text-sm mb-6 line-clamp-2">
                                        {course.description}
                                    </p>

                                    {/* Meta Info */}
                                    <div className="flex items-center gap-x-6 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                                        <div className="flex items-center gap-x-1.5">
                                            <Award className="h-4 w-4" />
                                            <span>{locale === 'es' ? 'Certificado' : 'Certificate'}</span>
                                        </div>
                                    </div>

                                    {/* Price and CTA */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-3xl font-bold text-black">${course.price.toFixed(2)}</span>
                                            <span className="text-gray-600 text-sm ml-2">MXN</span>
                                        </div>
                                        <AddToCartButton
                                            course={{
                                                id: course.id,
                                                title: course.title,
                                                price: course.price,
                                                image: course.image || ''
                                            }}
                                            className="rounded-md px-6 py-2.5 text-sm shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Login/Register Section */}
                <div className="mt-16 rounded-2xl bg-gray-50 p-8 ring-1 ring-gray-200">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-black mb-4">
                            {locale === 'es' ? '¿Ya tienes una cuenta?' : 'Already have an account?'}
                        </h3>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/mi-cuenta"
                                className="w-full sm:w-auto rounded-md bg-[#B70126] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#D9012D] transition-colors"
                            >
                                {t.auth.login}
                            </Link>
                            <Link
                                href="/mi-cuenta"
                                className="w-full sm:w-auto rounded-md border border-gray-300 px-6 py-2.5 text-sm font-semibold text-black hover:bg-gray-100 transition-colors"
                            >
                                {t.auth.register}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
